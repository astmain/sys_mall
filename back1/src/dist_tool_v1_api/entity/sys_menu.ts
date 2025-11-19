 import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column, ManyToOne, OneToMany, JoinColumn,ManyToMany, CreateDateColumn, UpdateDateColumn, BeforeUpdate, AfterLoad } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'
import { Exclude, Expose } from 'class-transformer'
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiProperty, PickType } from '@nestjs/swagger'
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, IsNotEmptyObject, IsString, IsIn, IsBoolean, IsMobilePhone, Min, ValidateNested } from 'class-validator'

import { } from 'typeorm';

// 公共类
import { at_timestamp } from './common'
import { sys_depart } from './sys_depart'



// ================================== Entity ==================================
@Entity('sys_menu')
export class sys_menu extends at_timestamp {
  constructor(user_data?: Partial<sys_menu>) {
    super()
    Object.assign(this, user_data)
  }

  @PrimaryColumn({ type: 'varchar', comment: '主键ID' })
  @ApiProperty({ description: '主键ID', example: 'uuid' })
  @IsString()
  id: string = uuidv4()


  @Column()
  @ApiProperty({ description: '菜单名称', example: '首页' })
  @IsString()
  @IsNotEmpty()
  name: string

  @Column()
  @ApiProperty({ description: '路径', example: '/user/list' })
  @IsString()
  path: string


  @Column({ default: "menu" })
  @ApiProperty({ description: '类型', example: 'menu' })
  @IsString()
  @IsNotEmpty()
  @IsIn(['menu', 'button'])
  type: string = 'menu'


  @Column({ default: "" })
  @ApiProperty({ description: '备注', example: "" })
  @IsString()
  remark: string = ""


  @Column({ default: true })
  @ApiProperty({ description: '状态', example: "1" })
  @IsBoolean()
  status: boolean = true


  @Column({ type: 'varchar', nullable: true })
  @ApiProperty({ description: '父菜单ID', example: 'uuid' })
  @IsString()
  parent_id: string | null;


  @ManyToOne(() => sys_menu, (menu) => menu.children, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_id' }) // 显式指定外键列名
  parent: sys_menu | null;


  @OneToMany(() => sys_menu, (menu) => menu.parent)
  children: sys_menu[];



  @ManyToMany(() => sys_depart, (depart) => depart.sys_menu)
  sys_depart: sys_depart[];

}



// ================================== dto ==================================
export class find_tree_menu extends PickType(sys_menu, ['path', 'type']) { }



// ================================== type ==================================
export type find_tree_menu_type = InstanceType<typeof find_tree_menu>;


