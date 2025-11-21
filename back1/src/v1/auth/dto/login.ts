import { ApiProperty, OmitType, PickType } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
// 我希望导入prisma的sys_user表的类型
import { Prisma } from '@prisma/client'

type pick_type = Pick<Prisma.sys_userGetPayload<{}>, 'phone' | 'password'>

export class login implements pick_type {
  @ApiProperty({ description: '用户名', example: '15160315110' })
  @IsString()
  @IsNotEmpty()
  phone: string

  @ApiProperty({ description: '用户ID', example: '123456' })
  @IsString()
  @IsNotEmpty()
  password: string

  aaa: string
}

// 类class转接口interface
import { util_class_to_interface } from '@src/plugins/util_class_to_interface'
export type login_interface = util_class_to_interface<login>
