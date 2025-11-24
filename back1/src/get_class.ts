import { DiscoveryService } from '@nestjs/core'

export function get_class(app) {
  // 使用 DiscoveryService 获取所有控制器和提供者
  const discoveryService = app.get(DiscoveryService)
  const controllers = discoveryService.getControllers()
  const providers = discoveryService.getProviders()

  // 收集所有控制器类
  for (const wrapper of controllers) {
    if (wrapper.metatype) {
      console.log('wrapper.metatype', wrapper.metatype)
    }
  }

  // 收集所有提供者类（过滤非类类型的 Provider）
  for (const wrapper of providers) {
    if (wrapper.metatype && typeof wrapper.metatype === 'function') {
      console.log('wrapper.metatype', wrapper.metatype)
    }
  }
}
