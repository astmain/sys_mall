import { orm_connect, orm_close } from './orm_connect'
import { tb_user } from './entity/tb_user'
orm_test()
export async function orm_test() {
  try {
    const { db } = await orm_connect()
    const user = await db.find(tb_user, { name: { $like: '%1%' } })
    console.log('✅orm_test---用户:', user)

    const one = db.create(tb_user, { name: '1', email: '1@1.com', password: '123456', status: true })
    await db.flush() // 只负责将工作单元中的变更写入数据库

    console.log('✅orm_test---用户one:', one)
    return true
  } catch (error) {
    console.error('❌orm_test---数据库连接测试失败:', error.message)
    return false
  } finally {
    await orm_close()
  }
}
