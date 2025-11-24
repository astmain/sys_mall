// routes-scanner.service.ts
import { Injectable, OnModuleInit, RequestMethod } from '@nestjs/common'
import { DiscoveryService, Reflector } from '@nestjs/core'
import { PATH_METADATA, METHOD_METADATA } from '@nestjs/common/constants'

@Injectable()
export class RoutesScanner implements OnModuleInit {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
  ) {}

  onModuleInit() {
    const controllers = this.discoveryService.getControllers()
    const routes: { method: string; path: string }[] = []

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
        // routes.push({ method: RequestMethod[requestMethod], path: fullPath })
        console.log(`111---fullPath:`,requestMethod, fullPath)
        // 我想得到login的dto类


      }
    }

    // 这里你可以把 routes 存数据库 / 打日志 / 做权限表
    // console.log('All routes:', routes)
  }
}
