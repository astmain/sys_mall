import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class login {
  @ApiProperty({ description: '用户名', example: '15160315110' })
  @IsString()
  @IsNotEmpty()
  phone: string

  @ApiProperty({ description: '用户ID', example: '123456' })
  @IsString()
  @IsNotEmpty()
  password: string
}

import { util_class_to_interface } from '@src/plugins/util_class_to_interface'
export type login_interface = util_class_to_interface<login>
