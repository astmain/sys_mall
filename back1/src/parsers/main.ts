/**
 * TypeScript 类解析器
 * 
 * 这个模块的主要功能是：
 * 1. 解析 TypeScript 类定义文件
 * 2. 提取类的属性及其类型信息
 * 3. 支持处理继承关系（如 PickType）
 * 4. 支持从装饰器（如 @IsIn）中提取类型信息
 */

import * as fs from 'fs'
import * as path from 'path'
import * as ts from 'typescript'

// 示例调用：解析指定类文件
parseClassToTypes({ classFilePath: 'back1/src/v1/auth/dto/login_phone.ts' })

/**
 * 解析类文件并提取类型信息
 * 
 * @param classFilePath - 要解析的类文件路径（相对或绝对路径）
 * 
 * 主要流程：
 * 1. 解析文件路径并读取源代码
 * 2. 查找并加载 tsconfig.json 配置
 * 3. 创建 TypeScript 编译器和类型检查器
 * 4. 遍历源文件中的类声明
 * 5. 提取类的属性信息
 */
function parseClassToTypes({ classFilePath }) {
  // 将相对路径转换为绝对路径
  const absolutePath = path.resolve(classFilePath)
  console.log('absolutePath', absolutePath)
  
  // 读取源文件内容（虽然读取了，但实际主要使用 TypeScript API 解析）
  const sourceCode = fs.readFileSync(absolutePath, 'utf-8')
  
  // 查找最近的 tsconfig.json 配置文件
  const configPath = ts.findConfigFile(path.dirname(absolutePath), ts.sys.fileExists, 'tsconfig.json')
  console.log('configPath', configPath)
  
  // 设置默认的编译器选项
  let compilerOptions: ts.CompilerOptions = {
    target: ts.ScriptTarget.Latest,           // 使用最新的 JavaScript 目标版本
    module: ts.ModuleKind.ESNext,            // 使用 ESNext 模块系统
    jsx: ts.JsxEmit.None,                    // 不处理 JSX
    moduleResolution: ts.ModuleResolutionKind.NodeJs,  // 使用 Node.js 模块解析策略
    experimentalDecorators: true,             // 启用实验性装饰器支持
    emitDecoratorMetadata: true,             // 启用装饰器元数据（用于反射）
  }
  
  // 如果找不到配置文件，直接返回
  if (!configPath) return
  
  // 读取并解析 tsconfig.json
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile)
  if (!configFile.config) return

  // 解析配置文件内容，合并到编译器选项
  const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, path.dirname(configPath))
  compilerOptions = { ...compilerOptions, ...parsed.options }

  // 获取所有相关的源文件（包括依赖的文件）
  const allFiles = getAllSourceFiles(absolutePath, configPath || undefined)
  console.log('allFiles', allFiles)
  
  // 创建编译器主机（提供文件系统访问接口）
  const host = ts.createCompilerHost(compilerOptions)
  console.log('host', host)
  
  // 创建 TypeScript 程序（包含所有源文件和类型信息）
  const program = ts.createProgram(allFiles, compilerOptions, host)
  console.log('program', program)
  
  // 获取目标源文件的 AST（抽象语法树）
  const sourceFile = program.getSourceFile(absolutePath)
  console.log('sourceFile', sourceFile)

  // 创建类型检查器（用于获取类型信息）
  const checker = program.getTypeChecker()
  console.log('checker', checker)

  // 如果源文件不存在，直接返回
  if (!sourceFile) return

  // 遍历源文件的所有子节点，查找类声明
  sourceFile.forEachChild((node) => {
    if (ts.isClassDeclaration(node)) {
      const nodeName = node.name?.text
      console.log('nodeName', nodeName)
      // 解析类的属性信息
      const properties = parseClassProperties(node, checker, sourceFile, program)
    }
  })
}

/**
 * 获取所有相关的源文件
 * 
 * 这个函数会收集所有需要编译的 TypeScript 源文件，包括：
 * - 起始文件本身
 * - tsconfig.json 中配置的所有源文件
 * - 如果无法从 tsconfig 获取，则递归搜索 src 目录
 * 
 * @param startFile - 起始文件路径
 * @param configPath - tsconfig.json 的路径（可选）
 * @returns 所有源文件的路径数组
 */
function getAllSourceFiles(startFile: string, configPath?: string): string[] {
  // 使用 Set 避免重复文件
  const files = new Set<string>([startFile])

  // 如果提供了 tsconfig.json，使用它来获取所有源文件
  if (configPath) {
    try {
      const configFile = ts.readConfigFile(configPath, ts.sys.readFile)
      if (configFile.config) {
        const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, path.dirname(configPath))
        // 添加所有包含的源文件（排除声明文件 .d.ts）
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

  // 如果从 tsconfig 没有获取到文件（只有起始文件），则递归搜索 src 目录
  if (files.size === 1) {
    const startDir = path.dirname(startFile)
    const srcDir = findSrcDirectory(startDir)

    if (srcDir) {
      try {
        // 递归查找 src 目录下的所有 .ts 文件
        const allTsFiles = findTsFilesRecursive(srcDir)
        allTsFiles.forEach((file) => files.add(file))
      } catch (e) {
        console.warn('Failed to scan directory:', e)
      }
    }
  }

  return Array.from(files)
}

/**
 * 查找 src 目录
 * 
 * 从起始目录开始，向上遍历目录树，查找名为 'src' 的目录
 * 
 * @param startDir - 起始目录路径
 * @returns src 目录的路径，如果找不到则返回 null
 */
function findSrcDirectory(startDir: string): string | null {
  let current = startDir
  // 向上遍历直到到达根目录
  while (current !== path.dirname(current)) {
    const srcPath = path.join(current, 'src')
    // 检查是否存在 src 目录
    if (fs.existsSync(srcPath) && fs.statSync(srcPath).isDirectory()) {
      return srcPath
    }
    // 移动到父目录
    current = path.dirname(current)
  }
  return null
}

/**
 * 递归查找所有 .ts 文件
 * 
 * 递归遍历目录树，收集所有 TypeScript 源文件（排除声明文件）
 * 
 * @param dir - 要搜索的目录路径
 * @returns 所有找到的 .ts 文件路径数组
 */
function findTsFilesRecursive(dir: string): string[] {
  const files: string[] = []

  try {
    // 读取目录内容（包含文件类型信息）
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    entries.forEach((entry) => {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        // 跳过 node_modules 和 dist 目录（这些目录通常不需要解析）
        if (entry.name !== 'node_modules' && entry.name !== 'dist') {
          // 递归搜索子目录
          files.push(...findTsFilesRecursive(fullPath))
        }
      } else if (entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
        // 只添加 .ts 文件，排除声明文件 .d.ts
        files.push(fullPath)
      }
    })
  } catch (e) {
    // 忽略读取错误（如权限问题）
  }

  return files
}

/**
 * 解析类属性
 * 
 * 从类声明中提取所有属性的名称和类型信息，包括：
 * 1. 从继承的类（如 PickType）中获取的属性
 * 2. 类中直接声明的属性
 * 3. 从装饰器（如 @IsIn）中提取的类型信息
 * 
 * @param classDeclaration - TypeScript 类声明节点
 * @param checker - 类型检查器，用于获取类型信息
 * @param sourceFile - 源文件对象
 * @param program - TypeScript 程序对象
 * @returns 属性数组，每个属性包含 name（名称）和 type（类型字符串）
 */
function parseClassProperties(classDeclaration: ts.ClassDeclaration, checker: ts.TypeChecker, sourceFile: ts.SourceFile, program: ts.Program): Array<{ name: string; type: string }> {
  const properties: Array<{ name: string; type: string }> = []

  // 先处理继承的类（PickType）- 必须在遍历类成员之前，这样继承的属性会先被添加
  if (classDeclaration.heritageClauses) {
    classDeclaration.heritageClauses.forEach((heritageClause) => {
      // 只处理 extends 继承，不处理 implements
      if (heritageClause.token === ts.SyntaxKind.ExtendsKeyword) {
        heritageClause.types.forEach((heritageType) => {
          if (ts.isExpressionWithTypeArguments(heritageType)) {
            // 提取 PickType 信息（如 PickType(BaseClass, ['prop1', 'prop2'])）
            const pickTypeInfo = extractPickTypeInfo(heritageType, sourceFile)

            if (pickTypeInfo) {
              const { baseClassName, keys } = pickTypeInfo

              // 从基础类获取这些属性的类型
              const baseClassFile = findClassInProject(baseClassName, program)
              if (baseClassFile) {
                // 解析基础类的所有属性
                const baseProps = parseClassPropertiesFromFile(baseClassFile, baseClassName, program)
                baseProps.forEach((prop) => {
                  // 只添加 PickType 中指定的属性
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

  // 然后遍历类成员，提取直接声明的属性
  classDeclaration.members.forEach((member) => {
    // 只处理属性声明（不是方法）
    if (ts.isPropertyDeclaration(member) && member.name && ts.isIdentifier(member.name)) {
      const propertyName = member.name.text
      let propertyType = 'any'  // 默认类型

      // 先检查是否有 @IsIn 装饰器，如果有则使用联合类型
      // @IsIn(['个人', '企业']) 会生成类型: "个人" | "企业"
      const isInValues = extractIsInValues(member)
      if (isInValues && isInValues.length > 0) {
        // 生成联合类型字符串，例如: "个人" | "企业"
        propertyType = isInValues.map((v) => `"${v}"`).join(' | ')
      } else if (member.type) {
        // 如果有显式类型声明，解析类型节点
        propertyType = parseTypeNode(member.type, checker, sourceFile)
      } else if (member.initializer) {
        // 如果没有显式类型，尝试从初始化表达式推断类型
        // 例如: property = 123 会推断为 number
        const type = checker.getTypeAtLocation(member.initializer)
        propertyType = checker.typeToString(type)
      } else {
        // 尝试从装饰器元数据获取类型（如果启用了 emitDecoratorMetadata）
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

/**
 * 从装饰器中提取 @IsIn 的枚举值
 * 
 * 解析属性上的 @IsIn(['值1', '值2']) 装饰器，提取其中的字符串数组
 * 这些值将用于生成联合类型，如: "值1" | "值2"
 * 
 * @param member - 属性声明节点
 * @returns 装饰器中的字符串数组，如果没有找到 @IsIn 装饰器则返回 null
 */
function extractIsInValues(member: ts.PropertyDeclaration): string[] | null {
  // 获取属性上的所有装饰器
  // 兼容不同版本的 TypeScript API
  const decorators = ts.getDecorators ? ts.getDecorators(member) : (member.modifiers?.filter((m) => m.kind === ts.SyntaxKind.Decorator) as ts.Decorator[] | undefined)

  if (!decorators || decorators.length === 0) return null

  // 遍历所有装饰器，查找 @IsIn
  for (const decorator of decorators) {
    const expr = decorator.expression

    // 检查是否是函数调用形式的装饰器（如 @IsIn(...)）
    if (ts.isCallExpression(expr)) {
      const funcName = ts.isIdentifier(expr.expression) ? expr.expression.text : null

      // 如果装饰器名称是 'IsIn' 且有参数
      if (funcName === 'IsIn' && expr.arguments.length > 0) {
        const firstArg = expr.arguments[0]
        // 从第一个参数中提取字符串数组
        const values = extractStringArrayFromNode(firstArg)

        if (values.length > 0) {
          return values
        }
      }
    }
  }

  return null
}

/**
 * 从数组字面量中提取字符串
 * 
 * 从 TypeScript AST 节点中提取字符串数组，支持：
 * - 数组字面量: ['a', 'b', 'c']
 * - 元组类型: ['a', 'b']
 * 
 * @param node - TypeScript AST 节点（可能是数组字面量或元组类型）
 * @returns 提取的字符串数组
 */
function extractStringArrayFromNode(node: ts.Node): string[] {
  const keys: string[] = []

  // 处理数组字面量表达式: ['a', 'b']
  if (ts.isArrayLiteralExpression(node)) {
    node.elements.forEach((element) => {
      if (ts.isStringLiteral(element)) {
        // 字符串字面量: 'a'
        keys.push(element.text)
      } else if (ts.isIdentifier(element)) {
        // 标识符（变量名）
        keys.push(element.text)
      }
    })
  } else if (ts.isTupleTypeNode(node)) {
    // 处理元组类型: ['a', 'b']
    node.elements.forEach((element) => {
      if (ts.isStringLiteral(element)) {
        keys.push(element.text)
      } else if (ts.isLiteralTypeNode(element) && ts.isStringLiteral(element.literal)) {
        // 字面量类型节点
        keys.push(element.literal.text)
      }
    })
  }

  return keys
}

/**
 * 解析类型节点，返回类型字符串
 * 
 * 将 TypeScript AST 中的类型节点转换为可读的类型字符串，支持：
 * - 基本类型：string, number, boolean, any, void
 * - 数组类型：Array<T> 或 T[]
 * - 泛型类型：Promise<T>, Map<K, V> 等
 * - 自定义类型：类名、接口名等
 * 
 * @param typeNode - TypeScript 类型节点
 * @param checker - 类型检查器，用于获取类型信息
 * @param sourceFile - 源文件对象
 * @returns 类型的字符串表示，如 'string', 'Array<number>', 'Promise<string>' 等
 */
function parseTypeNode(typeNode: ts.TypeNode, checker: ts.TypeChecker, sourceFile: ts.SourceFile): string {
  // 处理数组类型: T[] 或 Array<T>
  if (ts.isArrayTypeNode(typeNode)) {
    const elementType = parseTypeNode(typeNode.elementType, checker, sourceFile)
    return `Array<${elementType}>`
  }

  // 处理类型引用（自定义类型、泛型等）
  if (ts.isTypeReferenceNode(typeNode)) {
    const typeName = typeNode.typeName
    if (ts.isIdentifier(typeName)) {
      const name = typeName.text

      // 处理泛型参数（如 Promise<string>, Map<string, number>）
      if (typeNode.typeArguments && typeNode.typeArguments.length > 0) {
        const args = typeNode.typeArguments.map((arg) => parseTypeNode(arg, checker, sourceFile)).join(', ')
        return `${name}<${args}>`
      }

      // 没有泛型参数，直接返回类型名
      return name
    }
  }

  // 检查基本类型关键字
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

  // 对于其他复杂类型，使用类型检查器获取类型的文本表示
  // 这可以处理联合类型、交叉类型、字面量类型等
  const type = checker.getTypeFromTypeNode(typeNode)
  const typeString = checker.typeToString(type)
  return typeString
}

/**
 * 从 PickType 调用中提取信息
 * 
 * 解析继承语句中的 PickType，提取基础类名和选中的属性键
 * 支持两种形式：
 * 1. extends PickType(BaseClass, ['prop1', 'prop2']) - 函数调用形式
 * 2. extends PickType<BaseClass, ['prop1', 'prop2']> - 泛型形式
 * 
 * @param heritageType - 继承类型表达式节点
 * @param sourceFile - 源文件对象
 * @returns 包含基础类名和属性键数组的对象，如果解析失败则返回 null
 */
function extractPickTypeInfo(heritageType: ts.ExpressionWithTypeArguments, sourceFile: ts.SourceFile): { baseClassName: string; keys: string[] } | null {
  const expr = heritageType.expression

  // PickType 可能是一个 CallExpression（函数调用）或者 Identifier（泛型）
  if (ts.isCallExpression(expr)) {
    // 处理函数调用形式: PickType(sys_user, ['phone', 'password'])
    const callExpr = expr
    const funcName = ts.isIdentifier(callExpr.expression) ? callExpr.expression.text : null

    if (funcName === 'PickType' && callExpr.arguments.length >= 2) {
      // 第一个参数是基础类（可能是标识符或属性访问）
      const baseClassArg = callExpr.arguments[0]
      let baseClassName: string | null = null

      if (ts.isIdentifier(baseClassArg)) {
        // 直接标识符: sys_user
        baseClassName = baseClassArg.text
      } else if (ts.isPropertyAccessExpression(baseClassArg)) {
        // 属性访问: SomeModule.sys_user
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
    // 处理泛型形式: PickType<BaseClass, ['prop1', 'prop2']>
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

/**
 * 在项目中查找类定义
 * 
 * 遍历程序中的所有源文件，查找指定名称的类声明
 * 
 * @param className - 要查找的类名
 * @param program - TypeScript 程序对象
 * @returns 包含该类的源文件，如果找不到则返回 null
 */
function findClassInProject(className: string, program: ts.Program): ts.SourceFile | null {
  // 遍历所有源文件
  for (const sourceFile of program.getSourceFiles()) {
    // 跳过声明文件（.d.ts）
    if (sourceFile.isDeclarationFile) continue

    let found = false
    // 遍历文件中的所有节点，查找类声明
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

/**
 * 从文件解析类属性
 * 
 * 在指定的源文件中查找指定名称的类，并解析其属性
 * 
 * @param sourceFile - 源文件对象
 * @param className - 要解析的类名
 * @param program - TypeScript 程序对象
 * @returns 类的属性数组，每个属性包含 name 和 type
 */
function parseClassPropertiesFromFile(sourceFile: ts.SourceFile, className: string, program: ts.Program): Array<{ name: string; type: string }> {
  const checker = program.getTypeChecker()
  const properties: Array<{ name: string; type: string }> = []

  // 遍历源文件，查找指定名称的类
  sourceFile.forEachChild((node) => {
    if (ts.isClassDeclaration(node) && node.name?.text === className) {
      // 解析类的属性
      const props = parseClassProperties(node, checker, sourceFile, program)
      properties.push(...props)
    }
  })

  return properties
}
