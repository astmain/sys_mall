import { Controller, Module, Get, Post, Body, Query, Req, Inject } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger'
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger'
import { Api_Get } from '@src/plugins/Api_Get'
import { Api_Post } from '@src/plugins/Api_Post'
import { Api_group } from '@src/plugins/Api_group'
import { Api_public } from '@src/App_Auth'

// ================================== 服务工具 ==================================
import { util_uuid9 } from '@src/plugins/util_uuid9'
import { JwtService } from '@nestjs/jwt'

@Api_public()
@Api_group('v1', '000000')
export class demo {
  @Api_Post('111111')
  async login(@Body() body: any, @Req() _req: any) {
    console.log(`login---body:`, body)
    return { code: 200, msg: '成功', result: {} }
  }

  @Api_Post('222222')
  async init_data_sys_menu_depart_user(@Body() body: any, @Req() _req: any) {
    return { code: 200, msg: '成功', result: {} }
  }
}

@Module({
  controllers: [demo],
  providers: [],
})
export class demo_module {}
