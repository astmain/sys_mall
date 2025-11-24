// routes-scanner.service.ts
import { Injectable, OnModuleInit, RequestMethod } from '@nestjs/common'
import { DiscoveryService, Reflector } from '@nestjs/core'
import { PATH_METADATA, METHOD_METADATA, PARAMTYPES_METADATA, ROUTE_ARGS_METADATA } from '@nestjs/common/constants'

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

      // Controller 上的 @Controller('xxx')
      const controllerPath = this.reflector.get<string>(PATH_METADATA, instance.constructor) ?? ''

      const prototype = Object.getPrototypeOf(instance)
      const methodNames = Object.getOwnPropertyNames(prototype).filter((name) => name !== 'constructor' && typeof prototype[name] === 'function')

      for (const methodName of methodNames) {
        const handler = prototype[methodName]

        // 方法上的 @Get('xxx') / @Post('xxx') 等
        const routePath = this.reflector.get<string>(PATH_METADATA, handler)
        const requestMethod = this.reflector.get<RequestMethod>(METHOD_METADATA, handler)

        // 不是路由的方法（比如普通工具方法）会拿不到 meta，跳过
        if (routePath == null || requestMethod == null) continue

        const fullPath = [controllerPath, routePath].filter(Boolean).join('/').replace(/\/+/g, '/')
        if (!fullPath.includes('login')) continue

        // 获取方法参数的元数据
        const paramTypes = Reflect.getMetadata(PARAMTYPES_METADATA, instance, methodName) || []
        const routeArgs = Reflect.getMetadata(ROUTE_ARGS_METADATA, instance.constructor, methodName) || {}

        // 查找 @Body() 装饰器的参数
        // NestJS 中，ROUTE_ARGS_METADATA 的键格式是 "参数索引:装饰器类型"
        // 装饰器类型 0 通常代表 @Body()
        let dtoClass: any = null

        // 遍历所有路由参数键
        for (const key of Object.keys(routeArgs)) {
          const [paramIndex, decoratorType] = key.split(':')
          const index = parseInt(paramIndex)

          // 装饰器类型 0 表示 @Body()
          if (!isNaN(index) && decoratorType === '0') {
            // 如果 paramTypes 中有对应索引的参数，使用它
            if (paramTypes[index]) {
              dtoClass = paramTypes[index]
              break
            }
            // 如果索引超出范围，可能是 paramTypes 只包含有装饰器的参数
            // 尝试使用第一个参数（通常 @Body() 是第一个参数）
            else if (paramTypes.length > 0 && paramTypes[0] && typeof paramTypes[0] === 'function') {
              dtoClass = paramTypes[0]
              break
            }
          }
        }

        // 如果还没找到，且只有一个参数，直接使用第一个参数
        if (!dtoClass && paramTypes.length === 1 && typeof paramTypes[0] === 'function') {
          dtoClass = paramTypes[0]
        }

        console.log(`111---fullPath:`, RequestMethod[requestMethod], fullPath)
        console.log(`222---DTO Class:`, dtoClass?.name || '未找到 DTO')
        if (dtoClass) {
          console.log(`333---DTO 类名:`, dtoClass.name)

          // 获取 DTO 的所有属性（包括继承的属性）
          const getAllProperties = (cls: any): string[] => {
            const properties = new Set<string>()

            // 方法1: 尝试实例化获取属性
            try {
              const instance = new cls()
              Object.keys(instance).forEach((key) => properties.add(key))
            } catch (e) {
              // 如果无法实例化，继续其他方法
            }

            // 方法2: 遍历原型链获取所有属性描述符
            let current = cls.prototype
            while (current && current !== Object.prototype) {
              Object.getOwnPropertyNames(current).forEach((name) => {
                if (name !== 'constructor') {
                  const descriptor = Object.getOwnPropertyDescriptor(current, name)
                  if (descriptor) {
                    // 如果是数据属性（有 getter/setter 或值不是函数），添加到列表
                    if (descriptor.get || descriptor.set || (descriptor.value !== undefined && typeof descriptor.value !== 'function')) {
                      properties.add(name)
                    } else if (descriptor.value === undefined && !descriptor.set) {
                      // undefined 值且没有 setter，可能是属性
                      properties.add(name)
                    }
                  }
                }
              })
              current = Object.getPrototypeOf(current)
            }

            // 方法3: 使用 Swagger 元数据获取属性
            try {
              const swaggerMetadata = Reflect.getMetadata('swagger/apiModelProperties', cls.prototype) || {}
              Object.keys(swaggerMetadata).forEach((key) => properties.add(key))
            } catch (e) {
              // Swagger 元数据可能不存在
            }

            return Array.from(properties).filter((prop) => prop !== 'constructor' && !prop.startsWith('__') && prop !== 'prototype')
          }

          const allProperties = getAllProperties(dtoClass)

          console.log(`444---DTO 所有属性:`, allProperties)

          // 特别检查 phone, password, code
          const targetProps = ['phone', 'password', 'code']
          const foundProps = targetProps.filter((prop) => allProperties.includes(prop))
          const missingProps = targetProps.filter((prop) => !allProperties.includes(prop))

          console.log(`555---找到的目标属性:`, foundProps)
          if (missingProps.length > 0) {
            console.log(`666---缺失的属性:`, missingProps)
            // 如果缺失，尝试从原型链中查找
            console.log(`777---原型链检查:`, {
              prototype: Object.getOwnPropertyNames(dtoClass.prototype),
              parent: dtoClass.prototype.__proto__ ? Object.getOwnPropertyNames(dtoClass.prototype.__proto__) : [],
            })
          } else {
            console.log(`666---✅ 所有目标属性都已找到！`)
          }
        }
      }
    }
  }
}
