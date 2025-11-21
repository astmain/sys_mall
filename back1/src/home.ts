import { Controller, Get, Module } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Res } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { Api_public } from './App_Auth'


@Api_public()
@Controller()
@ApiTags('首页')
export class home {
  @ApiOperation({ summary: '首页文档', description: '首页文档:' + process.env.VITE_url_app_run })
  @Get()
  async doc(@Res() res: any) {
    // return res.redirect(process.env.VITE_url_app_run + '/doc.html')
    return res.redirect('http://127.0.0.1:3001/doc.html')
  }
}



@Module({
  controllers: [home],
  providers: [],
})
export class home_module { }