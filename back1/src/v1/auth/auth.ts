import { Module, Body } from '@nestjs/common'
import { Api_group } from '@src/plugins/Api_group'
import { Api_public } from '@src/App_Auth'
import { Api_Post } from '@src/plugins/Api_Post'
// ================================== 数据库 ==================================
import  { login } from '@src/dist_tool_v1_api/entity/sys_user'
// ================================== dto ==================================

// ================================== 服务 ==================================
@Api_group('v1', '认证')
export class auth {
  @Api_public()
  @Api_Post('登陆')
  login(@Body() body: login) {
    console.log('auth---login', body)
    return { code: 200, msg: '登录成功', result: { body } }
  }
}

@Module({
  controllers: [auth],
  providers: [],
})
export class auth_module {}
