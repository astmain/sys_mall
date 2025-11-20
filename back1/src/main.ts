import { NestFactory } from '@nestjs/core'
import { Module } from '@nestjs/common'

// ================================== 插件 ==================================
import { filter_cors } from './plugins/filter_cors'
import { filter_dto } from './plugins/filter_dto'
import { filter_request } from './plugins/filter_request'
import { filter_response } from './plugins/filter_response'
import { Api_doc_group_swagger_knife4j2 } from './plugins/Api_doc_group_swagger_knife4j2'

// ================================== 模块 ==================================
import { App_Auth_Module } from './App_Auth'
import { home_module } from './home'
import { v1_module } from './v1_module'

const list_module = [v1_module, { title: 'common', description: '通用接口', imports: [home_module] }]

@Module({
  imports: [App_Auth_Module, ...list_module.flatMap((o) => o.imports)],
  controllers: [],
})
class App_Module {}

async function bootstrap() {
  const app = await NestFactory.create(App_Module)
  await filter_cors(app) // CORS配置(跨域请求)
  await filter_dto(app) // dto配置(全局验证管道)
  await filter_request(app) // 请求拦截器
  await filter_response(app) // 响应拦截器
  await Api_doc_group_swagger_knife4j2(app, list_module) // swagger文档

  await app.listen(process.env.PORT ?? 3001)
  console.log(`http://127.0.0.1:3001`)
}
bootstrap()
