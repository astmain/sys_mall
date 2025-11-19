import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeUpdate, AfterLoad } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'
import { Exclude, Expose } from 'class-transformer'
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiProperty, PickType } from '@nestjs/swagger'
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, IsNotEmptyObject, IsString, Min, ValidateNested } from 'class-validator'
@Entity('tb_user')
export class tb_user {
  constructor(user_data?: Partial<tb_user>) {
    Object.assign(this, user_data)
  }

  @PrimaryColumn({ type: 'varchar', comment: '主键ID' })
  @ApiProperty({ description: '主键ID', example: 'uuid' })
  @IsString()
  id: string = uuidv4() // 默认生成

  @Column({ length: 50 })
  @ApiProperty({ description: '名称', example: '名称' })
  @IsString()
  name: string

  @Column()
  @ApiProperty({ description: '密码', example: '123456' })
  @IsString()
  password: string

  @CreateDateColumn() // 自动记录创建时间
  at_created: Date

  @UpdateDateColumn() // 自动记录更新时间
  at_updated: Date

  @Exclude() // 不从 plain object 自动赋值
  other_name: string = '123' // 默认值（对 new User() 有效）

  @AfterLoad()
  setDefaultValues() {
    // 从数据库加载后，确保 other_name 有默认值
    this.other_name = this.name + '_' + this.at_updated.toLocaleString()
    console.log('other_name', this.other_name)
  }
}
