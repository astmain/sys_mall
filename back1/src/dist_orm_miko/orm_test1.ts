import { orm_connect, orm_close } from './orm_connect'
import { tb_user } from './entity/tb_user'
orm_test()
export async function orm_test() {
  try {
    const { db } = await orm_connect()
    const user = await db.find(tb_user, { name: { $like: '%1%' } })
    console.log('✅orm_test---用户:', user)
    
    // ========== persistAndFlush vs flush 的区别 ==========
    
    // 【方式1】使用 flush() - 需要先 create/persist，再 flush
    // create() 相当于 persist()，将实体加入工作单元（但未写入数据库）
    const one = db.create(tb_user, { name: '1', email: '1@1.com', password: '123456', status: true })
    await db.flush() // 只负责将工作单元中的变更写入数据库
    
    // 【方式2】使用 persistAndFlush() - 一步到位（推荐）
    // persistAndFlush = persist + flush 的组合
    // 注意：如果实体已经通过 create() 加入了工作单元，persistAndFlush 会重复处理
    // const two = new tb_user()
    // two.name = '2'
    // two.email = '2@2.com'
    // two.password = '123456'
    // two.status = true
    // await db.persistAndFlush(two) // 先标记为待持久化，然后立即 flush
    
    // 【方式3】批量操作 - 使用 flush() 更合适
    // const user1 = db.create(tb_user, { name: 'user1', email: 'u1@1.com', password: '123456', status: true })
    // const user2 = db.create(tb_user, { name: 'user2', email: 'u2@2.com', password: '123456', status: true })
    // const user3 = db.create(tb_user, { name: 'user3', email: 'u3@3.com', password: '123456', status: true })
    // await db.flush() // 一次性提交所有变更，性能更好
    
    // 方法2: 使用原生 SQL 插入（不经过 ORM，直接写入数据库）
    // await db.getConnection().execute(
    //   `INSERT INTO tb_user (name, email, password, status) VALUES (?, ?, ?, ?)`,
    //   ['2', '2@2.com', '123456', true]
    // )
    
    // 方法3: 使用事务自动 flush（在事务结束时自动 flush）
    // await db.transactional(async (em) => {
    //   em.create(tb_user, { name: '3', email: '3@3.com', password: '123456', status: true })
    //   // 事务结束时自动 flush
    // })
    
    console.log('✅orm_test---用户one:', one)
    return true
  } catch (error) {
    console.error('❌orm_test---数据库连接测试失败:', error.message)
    return false
  } finally {
    await orm_close()
  }
}
