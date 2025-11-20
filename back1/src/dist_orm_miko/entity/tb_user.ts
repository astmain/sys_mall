import { Entity, PrimaryKey as ColumnAutoIncrement, Property as Column } from '@mikro-orm/core'

@Entity({ tableName: 'tb_user' })
export class tb_user {
  @ColumnAutoIncrement()
  id!: number

  @Column()
  name!: string

  @Column()
  email!: string

  @Column() //设置默认值
  password: string = '123456'

  @Column() //设置默认值
  status: boolean = true
}
