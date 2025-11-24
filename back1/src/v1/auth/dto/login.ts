import { ApiProperty, PickType, OmitType, IntersectionType, PartialType } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsIn } from 'class-validator'
import { Prisma } from '@prisma/client'
import { sys_user } from '@src/orm_prisma/table/sys_user'
import { Matches } from 'class-validator'
import { ArrayMinSize } from 'class-validator'
import { ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
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

// 类class转接口interface
import { util_class_to_interface } from '@src/plugins/util_class_to_interface'
export type login_interface = util_class_to_interface<login>
