import { Controller, Get, Module } from '@nestjs/common'
import { Body } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Res } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { Api_public } from './App_Auth'
import { PickType } from '@nestjs/swagger'
import { sys_user } from '@src/orm_prisma/table/sys_user'
import { ApiProperty } from '@nestjs/swagger'
import { IsString, Matches } from 'class-validator'
import { ArrayMinSize } from 'class-validator'
import { ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { IsIn } from 'class-validator'
import { IsArray } from 'class-validator'

export class info_file {
  @ApiProperty({ description: 'url', example: 'https://www.baidu.com/img/flexible/logo/pc/result.png' })
  @IsString()
  @Matches(/^https?:\/\//, { message: 'url-必须以http或https开头' })
  url: string

  @ApiProperty({ description: '文件名称', example: 'result.png' })
  @IsString()
  file_name: string
}

export class login extends PickType(sys_user, ['phone', 'password']) {
  @ApiProperty({ description: '验证码', example: '123456' })
  @IsIn(['个人', '企业'], { message: "分类:必须是-['个人', '企业']" })
  code: string

  @ApiProperty({ description: '列表-主图轮播图', type: [info_file] })
  @ArrayMinSize(1, { message: '列表-主图轮播图-至少需要一个元素' })
  @ValidateNested({ each: true })
  @Type(() => info_file)
  @IsArray()
  list_img: info_file[]
}

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

  @ApiOperation({ summary: '首页文档', description: '首页文档:' + process.env.VITE_url_app_run })
  @Get('api222')
  async api222(@Body() body: login, @Res() res: any) {
    console.log('api222---body', body)
    return { code: 200, msg: '成功', result: {} }
  }
}

@Module({
  controllers: [home],
  providers: [],
})
export class home_module {}
