import { ApiProperty, OmitType, PickType } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
// 我希望导入prisma的sys_user表的类型
import { Prisma } from '@prisma/client'

// 定义严格的类型：只包含 phone 和 password 字段
type sys_user_login_strict = Prisma.sys_userGetPayload<{ select: { phone: true; password: true, } }>

// 严格类型检查：确保类中只能有 sys_user_login_strict 中的字段
// 如果类中有额外字段，下面的类型会报错
type StrictMatch<T, U extends Record<keyof T, any> = Record<keyof T, any>> = Exclude<keyof U, keyof T> extends never ? U : never

export class login implements sys_user_login_strict {
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

// 严格模式检查：如果类中有额外字段（如 aaa），这里会报错
// 检查 login 类是否有额外字段，如果有就产生类型错误
type _CheckExtraFields = Exclude<keyof login, keyof sys_user_login_strict> extends never ? login : `❌ 错误：类中有额外字段 "${Exclude<keyof login, keyof sys_user_login_strict>}"，请删除！`

// 如果 login 类有额外字段，下面的类型会报错
const _strict_check: _CheckExtraFields = null as any as login

// 类class转接口interface
import { util_class_to_interface } from '@src/plugins/util_class_to_interface'
export type login_interface = util_class_to_interface<login>
