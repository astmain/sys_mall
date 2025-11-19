import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, BeforeUpdate, AfterLoad } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'
import { Exclude, Expose } from 'class-transformer'
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiProperty, PickType } from '@nestjs/swagger'
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, IsNotEmptyObject, IsString, IsIn, IsBoolean, IsMobilePhone, Min, ValidateNested, IsArray } from 'class-validator'

import { at_timestamp } from './common'
import { sys_depart } from './sys_depart'

@Entity('sys_user')
export class sys_user extends at_timestamp {
  constructor(user_data?: Partial<sys_user>) {
    super()
    Object.assign(this, user_data)
  }

  @PrimaryColumn({ type: 'varchar', comment: '主键ID' })
  @ApiProperty({ description: '主键ID', example: 'uuid' })
  @IsString()
  user_id: string = uuidv4()

  @Column()
  @ApiProperty({ description: '手机号', example: '15160315110' })
  @IsString()
  @IsNotEmpty()
  @IsMobilePhone('zh-CN', {}, { message: '手机号格式不正确' })
  phone: string

  @Column()
  @ApiProperty({ description: '密码', example: '123456' })
  @IsString()
  @IsNotEmpty()
  password: string

  @Column()
  @ApiProperty({ description: '姓名', example: '姓名' })
  @IsString()
  name: string = ''

  @Column()
  @ApiProperty({ description: '头像', example: 'https://cdn.jsdelivr.net/gh/astmain/filestore@master/avatar_default.png' })
  @IsString()
  avatar: string = 'https://cdn.jsdelivr.net/gh/astmain/filestore@master/avatar_default.png'

  @Column()
  @ApiProperty({ description: '备注', example: '' })
  @IsString()
  remark: string = ''

  @Column()
  @ApiProperty({ description: '状态', example: '1' })
  @IsBoolean()
  status: boolean = true

  @Column()
  @ApiProperty({ description: '性别', example: '男' })
  @IsString()
  @IsNotEmpty()
  @IsIn(['男', '女', '未知'], { message: '性别格式不正确' })
  gender: '男' | '女' | '未知' = '未知'

  @ManyToMany(() => sys_depart, (o) => o.sys_user)
  @JoinTable({
    name: 'ref_user_depart', // 中间表名（可选）
    joinColumn: { name: 'user_id', referencedColumnName: 'user_id' },
    inverseJoinColumn: { name: 'depart_id', referencedColumnName: 'id' },
  })
  sys_depart: sys_depart[]
}

// ================================== dto ==================================
export class login extends PickType(sys_user, ['phone', 'password']) {}
// export class login extends PickType(sys_user, ['phone']) {}
export class remove_ids_user {
  @ApiProperty({ description: 'ids', example: ['1', '2'], isArray: true })
  @IsArray()
  @IsString({ each: true })
  ids: string[]
}
