import { Injectable, OnModuleInit, RequestMethod } from '@nestjs/common'
import { DiscoveryService, Reflector } from '@nestjs/core'
import { PATH_METADATA, METHOD_METADATA, ROUTE_ARGS_METADATA } from '@nestjs/common/constants'
import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum'
import { getMetadataStorage } from 'class-validator'

// nestjs/swagger 内部用到的 metadata key
const SWAGGER_PROPS_ARRAY_KEY = 'swagger/apiModelPropertiesArray'
const SWAGGER_PROP_KEY = 'swagger/apiModelProperties'

// 我们只关心 class-validator metadata 里的少量字段
type CVMeta = {
  type?: string
  constraints?: any[]
}

/**
 * 把 Reflect.getMetadata('design:type') 拿到的类型转换成 TS 类型名字符串
 */
function getTsTypeName(designType: Function | undefined): string {
  if (!designType) return 'any'

  switch (designType) {
    case String:
      return 'string'
    case Number:
      return 'number'
    case Boolean:
      return 'boolean'
    case Array:
      return 'any[]'
    case Date:
      return 'Date'
    default:
      // 自定义类 / 枚举等
      return designType.name || 'any'
  }
}

@Injectable()
export class RoutesScanner implements OnModuleInit {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
  ) {}

  onModuleInit() {
    const controllers = this.discoveryService.getControllers()

    for (const wrapper of controllers) {
      const { instance } = wrapper
      if (!instance) continue

      const controllerPath = this.reflector.get<string>(PATH_METADATA, instance.constructor) ?? ''

      const prototype = Object.getPrototypeOf(instance)
      const methodNames = Object.getOwnPropertyNames(prototype).filter((name) => name !== 'constructor' && typeof prototype[name] === 'function')

      for (const methodName of methodNames) {
        const handler = prototype[methodName]

        const routePath = this.reflector.get<string>(PATH_METADATA, handler)
        const requestMethod = this.reflector.get<RequestMethod>(METHOD_METADATA, handler)

        if (!routePath || requestMethod === undefined) continue

        const fullPath = [controllerPath, routePath].filter(Boolean).join('/').replace(/\/+/g, '/')

        // 暂时只处理 v1/auth/login
        if (!fullPath.includes('v1/auth/login')) continue

        console.log('=== route:', fullPath, 'method:', RequestMethod[requestMethod])

        // -------- 1. 拿到该方法所有参数类型 --------
        const paramTypes: any[] = Reflect.getMetadata('design:paramtypes', instance, methodName) ?? []

        // -------- 2. 从 ROUTE_ARGS_METADATA 里找哪个参数是 @Body() --------
        const routeArgs: Record<string, any> = Reflect.getMetadata(ROUTE_ARGS_METADATA, instance.constructor, methodName) ?? {}

        // key 形如 "3:0" 这里 3 就是 RouteParamtypes.BODY
        const bodyMetaEntry = Object.entries(routeArgs).find(([key]) => key.startsWith(`${RouteParamtypes.BODY}:`))

        if (!bodyMetaEntry) {
          console.log('没有找到 @Body() 参数')
          continue
        }

        const [, bodyMeta] = bodyMetaEntry
        const bodyIndex: number = bodyMeta.index
        const dtoClass = paramTypes[bodyIndex]

        if (!dtoClass) {
          console.log('没有拿到 DTO class')
          continue
        }

        console.log('Body DTO class name:', dtoClass.name)

        // -------- 3. 计算 DTO 字段名（Swagger + design:type 双保险） --------
        const dtoProto = dtoClass.prototype

        // 3.1 Swagger 里声明过的字段
        const swaggerPropsRaw: string[] = Reflect.getMetadata(SWAGGER_PROPS_ARRAY_KEY, dtoProto) ?? []

        const fieldSet = new Set<string>()

        for (const p of swaggerPropsRaw) {
          const name = p.startsWith(':') ? p.slice(1) : p
          fieldSet.add(name)
        }

        // 3.2 再扫一遍 prototype，只要有 design:type 元数据，也算一个字段
        const ownProps = Object.getOwnPropertyNames(dtoProto)
        for (const key of ownProps) {
          if (key === 'constructor') continue
          if (fieldSet.has(key)) continue
          if (Reflect.hasMetadata('design:type', dtoProto, key)) {
            fieldSet.add(key)
          }
        }

        const fieldNames = [...fieldSet]

        if (!fieldNames.length) {
          console.log('没有从 DTO 上读到字段')
          continue
        }

        // -------- 4. 从 class-validator 拿验证规则（用于 IsIn / ArrayMinSize 等） --------
        const cvStorage = getMetadataStorage() as any

        const validationMetas: CVMeta[] = cvStorage.getTargetValidationMetadatas(
          dtoClass, // targetConstructor
          undefined, // targetSchema
          false, // always
          false, // strictGroups
          undefined, // groups
        )

        const metasByProp: Record<string, CVMeta[]> = cvStorage.groupByPropertyName(validationMetas)

        // -------- 5. 组装字段信息（类型 + IsIn 枚举 + 数组信息） --------
        const fields = fieldNames.map((name) => {
          // TS 的运行时类型信息（design:type）
          const designType: Function | undefined = Reflect.getMetadata('design:type', dtoProto, name)

          // swagger 的 metadata（有 type、isArray、required、enum 等）
          const swaggerMeta: any = Reflect.getMetadata(SWAGGER_PROP_KEY, dtoProto, name) ?? {}

          // 先判断是不是数组
          const swaggerIsArray: boolean = !!swaggerMeta.isArray
          const rawTypeFromSwagger: Function | undefined = swaggerMeta.type && typeof swaggerMeta.type === 'function' ? swaggerMeta.type : undefined

          const rawType: Function | undefined = rawTypeFromSwagger || designType

          // 只用 swagger / design:type 判断是否数组
          const isArray = swaggerIsArray || rawType === Array

          let typeName: string

          if (isArray) {
            // 有明确元素类型（例如 type: info_file, isArray: true）
            if (rawTypeFromSwagger && rawTypeFromSwagger !== Array) {
              const elemTypeName = getTsTypeName(rawTypeFromSwagger)
              typeName = `${elemTypeName}[]`
            } else {
              // 没有元素类型就退回 any[]
              typeName = 'any[]'
            }
          } else {
            typeName = getTsTypeName(rawType)
          }

          const required: boolean = swaggerMeta.required ?? true

          const metasForProp = (metasByProp[name] ?? []) as CVMeta[]

          // ====== IsIn：枚举值 ======
          const isInMeta = metasForProp.find((m) => Array.isArray(m.constraints) && Array.isArray(m.constraints[0]))
          let enumValues: any[] | undefined
          if (isInMeta) {
            enumValues = isInMeta.constraints![0] as any[]
          }

          // ====== ArrayMinSize：最小长度 ======
          const arrayMinMeta = metasForProp.find((m) => m.type === 'arrayMinSize' && Array.isArray(m.constraints))
          let arrayMinSize: number | undefined
          if (arrayMinMeta) {
            arrayMinSize = arrayMinMeta.constraints![0] as number
          }

          return {
            name,
            type: typeName,
            required,
            enumValues,
            isArray,
            arrayMinSize,
          }
        })

        console.log('DTO 字段解析结果：', fields)
        // 期望类似：
        // [
        //   { name:'phone', type:'string', required:true, isArray:false },
        //   { name:'password', type:'string', required:true, isArray:false },
        //   { name:'code', type:'string', required:true, enumValues:['个人','企业'], isArray:false },
        //   { name:'list_img', type:'info_file[]' 或 'any[]', required:true, isArray:true, arrayMinSize:1 },
        // ]

        // -------- 6. 生成 interface 源码（枚举自动变成联合类型） --------
        const interfaceBody = fields
          .map((f) => {
            let fieldType = f.type

            if (f.enumValues && f.enumValues.length > 0) {
              const union = f.enumValues.map((v) => JSON.stringify(v)).join(' | ')
              fieldType = union
              if (f.isArray) {
                fieldType = `(${fieldType})[]`
              }
            }

            return `  ${f.name}${f.required ? '' : '?'}: ${fieldType};`
          })
          .join('\n')

        const interfaceCode = `export interface ${dtoClass.name}DtoGenerated {\n${interfaceBody}\n}`

        console.log('生成的 interface 源码：\n', interfaceCode)
      }
    }
  }
}
