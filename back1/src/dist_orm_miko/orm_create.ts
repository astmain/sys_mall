import { orm_connect, orm_close } from './orm_connect'

orm_create()
/**
 * 数据库表创建(根据实体定义)
 * 注意：这只会创建不存在的表，不会删除或修改已存在的表
 */
export async function orm_create() {
  try {
    const { orm, db } = await orm_connect()
    const generator = orm.schema

    // 创建所有表
    await generator.createSchema()
    console.log('✅orm_create---数据库表创建成功')
    return true
  } catch (error) {
    console.error('❌orm_create---数据库表创建失败:', error)
    throw error
  }finally{
    await orm_close()
  }
}
