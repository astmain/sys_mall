// routes-scanner.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common'
import { DiscoveryService, Reflector } from '@nestjs/core'
import { PATH_METADATA, METHOD_METADATA, ROUTE_ARGS_METADATA } from '@nestjs/common/constants'
import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum'

// 一定要在项目入口 somewhere import 'reflect-metadata'
// 一般在 main.ts 顶部：import 'reflect-metadata'

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

        if (!routePath) continue

        const fullPath = [controllerPath, routePath].filter(Boolean).join('/').replace(/\/+/g, '/')

        // 暂时只处理 v1/auth/login
        if (!fullPath.includes('v1/auth/login')) continue

        console.log('=== route:', fullPath, 'method:', methodName)

        // -------- 1. 拿到该方法所有参数类型 --------
        const paramTypes: any[] = Reflect.getMetadata('design:paramtypes', instance, methodName) ?? []
        console.log('paramTypes', paramTypes.toString())

        // -------- 2. 从 ROUTE_ARGS_METADATA 里找哪个参数是 @Body() --------
        const routeArgs: Record<string, any> = Reflect.getMetadata(ROUTE_ARGS_METADATA, instance.constructor, methodName) ?? {}

        // key 形如 "3:0" 这里 3 就是 RouteParamtypes.BODY
        const bodyMetaEntry = Object.entries(routeArgs).find(([key]) => key.startsWith(`${RouteParamtypes.BODY}:`))

        if (!bodyMetaEntry) {
          console.log('没有找到 @Body() 参数')
          continue
        }

        const [, bodyMeta] = bodyMetaEntry
        console.log('bodyMeta', bodyMeta)
        const bodyIndex: number = bodyMeta.index
        const dtoClass = paramTypes[bodyIndex]
        console.log('dtoClass', dtoClass
            . toString())
        if (!dtoClass) {
          console.log('没有拿到 DTO class')
          continue
        }

        console.log('Body DTO class name:', dtoClass.name)

        // -------- 3. 从 swagger metadata 中拿 DTO 的字段 --------
        const dtoProto = dtoClass.prototype

        // 这个 key 是 nestjs/swagger 内部用的，保存了所有 @ApiProperty 字段
        const swaggerProps: string[] = Reflect.getMetadata('swagger/apiModelPropertiesArray', dtoProto) ?? []
        console.log('swaggerProps', swaggerProps)

        // 里面的值形如 ":phone"、":password"、":code"，前面有个冒号，去掉
        const fieldNames = swaggerProps.map((p) => p.slice(1))

        console.log('DTO 字段：', fieldNames) // 这里应该是 ['phone', 'password', 'code']

        // 你要的话可以进一步做点事情，比如：
        // 生成 interface 文本、权限表、日志等等
        const interfaceCode = `interface ${dtoClass.name} { ${fieldNames.join('; ')} }`
      }
    }
  }
}
