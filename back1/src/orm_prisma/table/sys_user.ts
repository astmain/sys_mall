import { Prisma } from '@prisma/client'
import { ApiProperty, PickType, OmitType, IntersectionType, PartialType } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator'

export class sys_user implements Omit<Prisma.sys_userGetPayload<{}>, 'sys_depart' | 'arg_user_address_take'> {
  @ApiProperty({ description: '用户ID', example: 'uuid-string' })
  @IsString()
  id: string

  @ApiProperty({ description: '手机号', example: '15160315110' })
  @IsString()
  @IsNotEmpty()
  phone: string

  @ApiProperty({ description: '密码', example: '123456' })
  @IsString()
  @IsNotEmpty()
  password: string

  @ApiProperty({ description: '头像', example: 'https://cdn.jsdelivr.net/gh/astmain/filestore@master/avatar_default.png' })
  @IsString()
  @IsNotEmpty()
  avatar: string

  @ApiProperty({ description: '性别', example: '未知' })
  @IsString()
  @IsNotEmpty()
  gender: string

  @ApiProperty({ description: '姓名', example: '张三' })
  @IsString()
  name: string

  @ApiProperty({ description: '备注', example: '' })
  @IsString()
  @IsOptional()
  remark: string

  @ApiProperty({ description: '创建时间', example: new Date() })
  created_at: Date

  @ApiProperty({ description: '更新时间', example: new Date() })
  updated_at: Date

  @ApiProperty({ description: '状态', example: true })
  @IsBoolean()
  status: boolean
}
