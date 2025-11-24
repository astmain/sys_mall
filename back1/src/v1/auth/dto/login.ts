import { ApiProperty, PickType, OmitType, IntersectionType, PartialType } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsIn } from 'class-validator'
import { Prisma } from '@prisma/client'
import { sys_user } from '@src/orm_prisma/table/sys_user'

export class login extends PickType(sys_user, ['phone', 'password']) {
  @ApiProperty({ description: '验证码', example: '123456' })
  @IsString()
  @IsIn(['个人', '企业'], { message: "分类:必须是-['个人', '企业']" })
  code: number
}

// 类class转接口interface
import { util_class_to_interface } from '@src/plugins/util_class_to_interface'
export type login_interface = util_class_to_interface<login>
