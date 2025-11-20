import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

@Entity({ tableName: 'tb_user' })
export class tb_user {
  @PrimaryKey()
  id!: number

  @Property()
  name!: string

  @Property()
  email!: string
}
