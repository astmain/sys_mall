import { ApiProperty, PickType, OmitType, IntersectionType, PartialType } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
// 我希望导入prisma的sys_user表的类型
import { Prisma } from '@prisma/client'

type pick_type = Pick<Prisma.sys_userGetPayload<{}>, 'phone' | 'password'>

export class login implements Pick<Prisma.sys_userGetPayload<{}>, 'phone' | 'password'> {
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

class class1 {
  tel: string
}
class class2 {
  phone: string
}

type AssertOnly<T, K extends keyof T = keyof T> = {
  // 允许的字段
  [P in K]: T[P]
} & {
  // 除了 K 以外的字段统统禁止（类型变成 never）
  [P in Exclude<keyof T, K>]?: never
}

const type1: AssertOnly<class1> = { tel: '123456' }

export class login222 {
  aaa: string
  bbb: string
  phone: string
}

// 类class转接口interface
import { util_class_to_interface } from '@src/plugins/util_class_to_interface'
export type login_interface = util_class_to_interface<login>
