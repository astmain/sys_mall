import { Module } from '@nestjs/common'
import { Api_group } from '@src/plugins/Api_group'
import { Api_public } from '@src/App_Auth'
import { Api_Post } from '@src/plugins/Api_Post'
// ================================== 数据库 ==================================

// ================================== dto ==================================

// ================================== 服务 ==================================
@Api_group('v1', '认证')
export class auth {
  @Api_public()
  @Api_Post('登陆')
  login() {
    console.log('login')
    return 'login'
  }
}

@Module({
  controllers: [auth],
  providers: [],
})
export class auth_module {}
