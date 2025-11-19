import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, JoinColumn, CreateDateColumn, UpdateDateColumn, BeforeUpdate, AfterLoad } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'
import { Exclude, Expose } from 'class-transformer'
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiProperty, PickType } from '@nestjs/swagger'
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, IsNotEmptyObject, IsString, IsIn, IsBoolean, IsMobilePhone, Min, ValidateNested } from 'class-validator'

import { } from 'typeorm';

// 公共类
import { at_timestamp } from './common'
import { sys_user } from './sys_user'
import { sys_menu } from './sys_menu'



// ================================== Entity ==================================
@Entity('sys_depart')
export class sys_depart extends at_timestamp {
  constructor(user_data?: Partial<sys_depart>) {
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
  name: string




  @Column({ default: "depart", select: false })
  @ApiProperty({ description: '类型', example: 'depart' })
  @IsString()
  @IsNotEmpty()
  @IsIn(['depart', 'company'])
  type: string = 'depart'


  @Column({ default: "", select: false })
  @ApiProperty({ description: '备注', example: "" })
  @IsString()
  remark: string = ""

  @Column({ default: 0, select: false })
  @ApiProperty({ description: '排序', example: 0 })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  sort: number = 0


  @Column({ default: true, select: false })
  @ApiProperty({ description: '状态', example: true })
  @IsBoolean()
  status: boolean = true


  @Column({ type: 'varchar', nullable: true })
  @ApiProperty({ description: '父部门ID', example: 'uuid' })
  @IsString()
  parent_id: string | null;


  @ManyToOne(() => sys_depart, (o) => o.children, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_id' })
  parent: sys_depart | null;


  @OneToMany(() => sys_depart, (o) => o.parent)
  children: sys_depart[];



  // 多对多：用户
  @ManyToMany(() => sys_user, (o) => o.sys_depart)
  @JoinTable({
    name: 'ref_user_depart', // 中间表名（可选）
    joinColumn: { name: 'depart_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'user_id' },
  })
  sys_user: sys_user[];



  // 多对多：菜单
  @ManyToMany(() => sys_menu, (o) => o.sys_depart)
  @JoinTable({
    name: 'ref_depart_menu', // 中间表名（可选）
    joinColumn: { name: 'depart_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'menu_id', referencedColumnName: 'id' },
  })
  sys_menu: sys_menu[];


}



// ================================== dto ==================================




// ================================== type ==================================



