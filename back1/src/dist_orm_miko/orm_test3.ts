import { orm_connect, orm_close } from './orm_connect'
import { tb_user } from './entity/tb_user'
import { EntityManager } from '@mikro-orm/postgresql'
orm_test()
export async function orm_test() {
  try {
    const { db } = await orm_connect()
    // 使用 createQueryBuilder 查询（需要类型断言以支持 createQueryBuilder）
    const em = db as EntityManager
    // const result = await em.createQueryBuilder(tb_user).select('id').getResultList()
    const result = await em.createQueryBuilder(tb_user).select(['id', 'name', 'aaa']).getSingleResult()

    console.log('✅orm_test---查询结果:', result)
    return true
  } catch (error) {
    console.error('❌orm_test---数据库连接测试失败:', error.message)
    return false
  } finally {
    await orm_close()
  }
}
