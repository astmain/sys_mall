import { orm_connect, orm_close } from './orm_connect'

orm_update() //会清空数据库表，然后重新创建,如果遇到 增加字段就会报错

/**
 * 数据库表-结构更新(根据实体定义)
 * 注意：这会修改已存在的表结构,会清空数据库表，然后重新创建,如果遇到 增加字段就会报错
 */
export async function orm_update() {
  try {
    const { orm, db } = await orm_connect()
    await orm.schema.updateSchema()
    console.log('✅orm_update---数据库表更新成功')
    return true
  } catch (error) {
    console.error('❌orm_update---数据库表更新失败:', error.message)
    throw error
  } finally {
    await orm_close()
  }
}
