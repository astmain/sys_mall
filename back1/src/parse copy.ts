import * as ts from 'typescript'
import * as fs from 'fs'
import * as path from 'path'

/**
 * 使用 TypeScript AST 解析类定义，提取类型信息
 */

// 获取所有相关的源文件
function getAllSourceFiles(startFile: string, configPath?: string): string[] {
  const files = new Set<string>([startFile])

  // 如果提供了 tsconfig.json，使用它来获取所有源文件
  if (configPath) {
    try {
      const configFile = ts.readConfigFile(configPath, ts.sys.readFile)
      if (configFile.config) {
        const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, path.dirname(configPath))
        // 添加所有包含的源文件
        parsed.fileNames.forEach((file: string) => {
          if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
            files.add(file)
          }
        })
      }
    } catch (e) {
      console.warn('Failed to read tsconfig.json, falling back to directory scan:', e)
    }
  }

  // 如果从 tsconfig 没有获取到文件，则递归搜索 src 目录
  if (files.size === 1) {
    const startDir = path.dirname(startFile)
    const srcDir = findSrcDirectory(startDir)

    if (srcDir) {
      try {
        const allTsFiles = findTsFilesRecursive(srcDir)
        allTsFiles.forEach((file) => files.add(file))
      } catch (e) {
        console.warn('Failed to scan directory:', e)
      }
    }
  }

  return Array.from(files)
}

// 查找 src 目录
function findSrcDirectory(startDir: string): string | null {
  let current = startDir
  while (current !== path.dirname(current)) {
    const srcPath = path.join(current, 'src')
    if (fs.existsSync(srcPath) && fs.statSync(srcPath).isDirectory()) {
      return srcPath
    }
    current = path.dirname(current)
  }
  return null
}

// 递归查找所有 .ts 文件
function findTsFilesRecursive(dir: string): string[] {
  const files: string[] = []

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    entries.forEach((entry) => {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        // 跳过 node_modules 和 dist
        if (entry.name !== 'node_modules' && entry.name !== 'dist') {
          files.push(...findTsFilesRecursive(fullPath))
        }
      } else if (entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
        files.push(fullPath)
      }
    })
  } catch (e) {
    // 忽略错误
  }

  return files
}

// 解析类型节点，返回类型字符串
function parseTypeNode(typeNode: ts.TypeNode, checker: ts.TypeChecker, sourceFile: ts.SourceFile): string {
  if (ts.isArrayTypeNode(typeNode)) {
    const elementType = parseTypeNode(typeNode.elementType, checker, sourceFile)
    return `Array<${elementType}>`
  }

  if (ts.isTypeReferenceNode(typeNode)) {
    const typeName = typeNode.typeName
    if (ts.isIdentifier(typeName)) {
      const name = typeName.text

      // 处理泛型参数
      if (typeNode.typeArguments && typeNode.typeArguments.length > 0) {
        const args = typeNode.typeArguments.map((arg) => parseTypeNode(arg, checker, sourceFile)).join(', ')
        return `${name}<${args}>`
      }

      return name
    }
  }

  // 检查关键字类型
  switch (typeNode.kind) {
    case ts.SyntaxKind.StringKeyword:
      return 'string'
    case ts.SyntaxKind.NumberKeyword:
      return 'number'
    case ts.SyntaxKind.BooleanKeyword:
      return 'boolean'
    case ts.SyntaxKind.AnyKeyword:
      return 'any'
    case ts.SyntaxKind.VoidKeyword:
      return 'void'
  }

  // 获取类型的文本表示
  const type = checker.getTypeFromTypeNode(typeNode)
  const typeString = checker.typeToString(type)
  return typeString
}

// 从数组字面量中提取字符串
function extractStringArrayFromNode(node: ts.Node): string[] {
  const keys: string[] = []

  if (ts.isArrayLiteralExpression(node)) {
    node.elements.forEach((element) => {
      if (ts.isStringLiteral(element)) {
        keys.push(element.text)
      } else if (ts.isIdentifier(element)) {
        keys.push(element.text)
      }
    })
  } else if (ts.isTupleTypeNode(node)) {
    node.elements.forEach((element) => {
      if (ts.isStringLiteral(element)) {
        keys.push(element.text)
      } else if (ts.isLiteralTypeNode(element) && ts.isStringLiteral(element.literal)) {
        keys.push(element.literal.text)
      }
    })
  }

  return keys
}

// 从 PickType 调用中提取信息
function extractPickTypeInfo(heritageType: ts.ExpressionWithTypeArguments, sourceFile: ts.SourceFile): { baseClassName: string; keys: string[] } | null {
  const expr = heritageType.expression

  // PickType 可能是一个 CallExpression 或者 Identifier
  if (ts.isCallExpression(expr)) {
    // PickType(sys_user, ['phone', 'password'])
    const callExpr = expr
    const funcName = ts.isIdentifier(callExpr.expression) ? callExpr.expression.text : null

    if (funcName === 'PickType' && callExpr.arguments.length >= 2) {
      // 第一个参数是基础类
      const baseClassArg = callExpr.arguments[0]
      let baseClassName: string | null = null

      if (ts.isIdentifier(baseClassArg)) {
        baseClassName = baseClassArg.text
      } else if (ts.isPropertyAccessExpression(baseClassArg)) {
        baseClassName = baseClassArg.name?.text || null
      }

      // 第二个参数是选中的键数组
      const keysArg = callExpr.arguments[1]
      const keys = extractStringArrayFromNode(keysArg)

      if (baseClassName && keys.length > 0) {
        return { baseClassName, keys }
      }
    }
  } else if (ts.isIdentifier(expr) && expr.text === 'PickType') {
    // 如果是类型参数形式 PickType<BaseClass, Keys>
    if (heritageType.typeArguments && heritageType.typeArguments.length >= 2) {
      const baseClassType = heritageType.typeArguments[0]
      const pickedKeys = heritageType.typeArguments[1]

      let baseClassName: string | null = null
      if (ts.isTypeReferenceNode(baseClassType) && ts.isIdentifier(baseClassType.typeName)) {
        baseClassName = baseClassType.typeName.text
      }

      const keys = extractStringArrayFromNode(pickedKeys)

      if (baseClassName && keys.length > 0) {
        return { baseClassName, keys }
      }
    }
  }

  return null
}

// 从装饰器中提取 @IsIn 的枚举值
function extractIsInValues(member: ts.PropertyDeclaration): string[] | null {
  // 使用 ts.getDecorators 或直接访问 modifiers
  const decorators = ts.getDecorators ? ts.getDecorators(member) : (member.modifiers?.filter((m) => m.kind === ts.SyntaxKind.Decorator) as ts.Decorator[] | undefined)

  if (!decorators || decorators.length === 0) return null

  for (const decorator of decorators) {
    const expr = decorator.expression

    // 检查是否是 @IsIn 装饰器
    if (ts.isCallExpression(expr)) {
      const funcName = ts.isIdentifier(expr.expression) ? expr.expression.text : null

      if (funcName === 'IsIn' && expr.arguments.length > 0) {
        // 第一个参数是数组，例如 ['个人', '企业']
        const firstArg = expr.arguments[0]
        const values = extractStringArrayFromNode(firstArg)

        if (values.length > 0) {
          return values
        }
      }
    }
  }

  return null
}

// 解析类属性
function parseClassProperties(classDeclaration: ts.ClassDeclaration, checker: ts.TypeChecker, sourceFile: ts.SourceFile, program: ts.Program): Array<{ name: string; type: string }> {
  const properties: Array<{ name: string; type: string }> = []

  // 先处理继承的类（PickType）- 必须在遍历类成员之前，这样继承的属性会先被添加
  if (classDeclaration.heritageClauses) {
    classDeclaration.heritageClauses.forEach((heritageClause) => {
      if (heritageClause.token === ts.SyntaxKind.ExtendsKeyword) {
        heritageClause.types.forEach((heritageType) => {
          if (ts.isExpressionWithTypeArguments(heritageType)) {
            const pickTypeInfo = extractPickTypeInfo(heritageType, sourceFile)

            if (pickTypeInfo) {
              const { baseClassName, keys } = pickTypeInfo

              // 从基础类获取这些属性的类型
              const baseClassFile = findClassInProject(baseClassName, program)
              if (baseClassFile) {
                const baseProps = parseClassPropertiesFromFile(baseClassFile, baseClassName, program)
                baseProps.forEach((prop) => {
                  if (keys.includes(prop.name)) {
                    // 避免重复添加
                    if (!properties.find((p) => p.name === prop.name)) {
                      properties.push(prop)
                    }
                  }
                })
              }
            }
          }
        })
      }
    })
  }

  // 然后遍历类成员
  classDeclaration.members.forEach((member) => {
    if (ts.isPropertyDeclaration(member) && member.name && ts.isIdentifier(member.name)) {
      const propertyName = member.name.text
      let propertyType = 'any'

      // 先检查是否有 @IsIn 装饰器，如果有则使用联合类型
      const isInValues = extractIsInValues(member)
      if (isInValues && isInValues.length > 0) {
        // 生成联合类型，例如: "个人" | "企业"
        propertyType = isInValues.map((v) => `"${v}"`).join(' | ')
      } else if (member.type) {
        propertyType = parseTypeNode(member.type, checker, sourceFile)
      } else if (member.initializer) {
        // 如果没有显式类型，尝试从初始化表达式推断
        const type = checker.getTypeAtLocation(member.initializer)
        propertyType = checker.typeToString(type)
      } else {
        // 尝试从装饰器元数据获取类型
        const type = checker.getTypeAtLocation(member)
        propertyType = checker.typeToString(type)
      }

      // 避免重复添加（可能继承的属性已经添加了）
      if (!properties.find((p) => p.name === propertyName)) {
        properties.push({ name: propertyName, type: propertyType })
      }
    }
  })

  return properties
}

// 在项目中查找类定义
function findClassInProject(className: string, program: ts.Program): ts.SourceFile | null {
  for (const sourceFile of program.getSourceFiles()) {
    if (sourceFile.isDeclarationFile) continue

    let found = false
    sourceFile.forEachChild((node) => {
      if (ts.isClassDeclaration(node) && node.name?.text === className) {
        found = true
      }
    })
    if (found) {
      return sourceFile
    }
  }
  return null
}

// 从文件解析类属性
function parseClassPropertiesFromFile(sourceFile: ts.SourceFile, className: string, program: ts.Program): Array<{ name: string; type: string }> {
  const checker = program.getTypeChecker()
  const properties: Array<{ name: string; type: string }> = []

  sourceFile.forEachChild((node) => {
    if (ts.isClassDeclaration(node) && node.name?.text === className) {
      const props = parseClassProperties(node, checker, sourceFile, program)
      properties.push(...props)
    }
  })

  return properties
}

// 生成类型定义代码
function generateTypeDefinition(typeName: string, properties: Array<{ name: string; type: string }>): string {
  const props = properties.map((p) => `  ${p.name}: ${p.type}`).join('\n')
  return `export type ${typeName} = {\n${props}\n}`
}

// 主解析函数
export function parseClassToTypes(
  classFilePath: string,
  className: string,
): {
  [typeName: string]: string
} {
  const absolutePath = path.resolve(classFilePath)

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${absolutePath}`)
  }

  const sourceCode = fs.readFileSync(absolutePath, 'utf-8')

  // 读取 tsconfig.json 以获取正确的编译选项
  const configPath = ts.findConfigFile(path.dirname(absolutePath), ts.sys.fileExists, 'tsconfig.json')
  let compilerOptions: ts.CompilerOptions = {
    target: ts.ScriptTarget.Latest,
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.None,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    experimentalDecorators: true,
    emitDecoratorMetadata: true,
  }

  if (configPath) {
    const configFile = ts.readConfigFile(configPath, ts.sys.readFile)
    if (configFile.config) {
      const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, path.dirname(configPath))
      compilerOptions = { ...compilerOptions, ...parsed.options }
    }
  }

  // 获取所有相关的源文件
  const allFiles = getAllSourceFiles(absolutePath, configPath || undefined)
  const host = ts.createCompilerHost(compilerOptions)
  const program = ts.createProgram(allFiles, compilerOptions, host)
  const sourceFile = program.getSourceFile(absolutePath)

  if (!sourceFile) {
    throw new Error(`Failed to parse source file: ${absolutePath}`)
  }

  const checker = program.getTypeChecker()
  const types: { [typeName: string]: string } = {}

  // 查找目标类
  sourceFile.forEachChild((node) => {
    if (ts.isClassDeclaration(node)) {
      const nodeName = node.name?.text

      // 解析目标类
      if (nodeName === className) {
        const properties = parseClassProperties(node, checker, sourceFile, program)
        types[`form_${className.toLowerCase()}`] = generateTypeDefinition(`form_${className.toLowerCase()}`, properties)
      }

      // 解析所有相关的类（如 info_file）
      if (nodeName && nodeName !== className) {
        const properties = parseClassProperties(node, checker, sourceFile, program)
        if (properties.length > 0) {
          types[nodeName] = generateTypeDefinition(nodeName, properties)
        }
      }
    }
  })

  return types
}

// 使用示例：解析 login 类
// 注意：这个函数需要在运行时调用，或者作为构建脚本使用
parseLoginClass()
export function parseLoginClass() {
  //   const loginFilePath = path.join(__dirname, 'v1/auth/dto/login.ts')
  const loginFilePath = path.join(__dirname, 'v1/auth/dto/login_phone.ts')
  try {
    console.log('loginFilePath', loginFilePath)
    const types = parseClassToTypes(loginFilePath, 'login')
    console.log('types', types)
    return types
  } catch (error) {
    console.error('解析错误:', error)
    throw error
  }
}

// // 手动定义的类型（作为参考）
// export type info_file = {
//   url: string
//   file_name: string
// }

// export type form_login = {
//   phone: string
//   password: string
//   code: "个人" | "企业"
//   list_img: Array<info_file>
// }
