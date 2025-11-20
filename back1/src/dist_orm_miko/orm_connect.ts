import { MikroORM } from '@mikro-orm/core'
import { EntityManager } from '@mikro-orm/postgresql'
import config from './config'

let orm: MikroORM | null = null
export async function orm_connect() {
  if (!orm) {
    try {
      orm = await MikroORM.init(config)
      const db = orm.em as EntityManager
      // db['create'] = orm.em.persist
      console.log('✅orm_connect---数据库连接成功')
      const isConnected = await orm.isConnected()
      console.log('✅orm_connect---数据库连接状态:', isConnected ? '已连接' : '未连接')
      await db.getConnection().execute('SELECT 1') // 执行一个简单查询测试连接
      console.log('✅orm_connect---SELECT 1')
      orm['db'] = db

      return { orm, db }
    } catch (error) {
      console.error('❌orm_connect---数据库连接失败:', error.message)
      throw error
    }
  }
  return { orm, db: orm.em }
}

export async function orm_close() {
  if (orm) {
    await orm.close()
    orm = null
    console.log('✅ orm_close---MikroORM 数据库连接已关闭')
  }
}
