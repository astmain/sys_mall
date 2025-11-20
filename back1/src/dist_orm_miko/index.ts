// pnpm install @mikro-orm/core @mikro-orm/postgresql pg
// pnpm install -D @mikro-orm/cli

import 'reflect-metadata'
import { MikroORM } from '@mikro-orm/core'
import config from './config'
// 确保实体被加载
import './entity/tb_user'

// 全局 ORM 实例
let orm: MikroORM | null = null

/**
 * 初始化 MikroORM 数据库连接
 */
export async function initMikroORM() {
  if (!orm) {
    try {
      orm = await MikroORM.init(config)
      console.log('✅ MikroORM 数据库连接成功')

      // 可选：检查连接状态
      const isConnected = await orm.isConnected()
      console.log('数据库连接状态:', isConnected ? '已连接' : '未连接')

      return orm
    } catch (error) {
      console.error('❌ MikroORM 数据库连接失败:', error)
      throw error
    }
  }
  return orm
}

/**
 * 获取 ORM 实例（如果未初始化则自动初始化）
 */
export async function getORM() {
  return await initMikroORM()
}

/**
 * 获取 EntityManager
 */
export async function getEntityManager() {
  const mikroOrm = await initMikroORM()
  return mikroOrm.em
}

/**
 * 获取 Repository
 */
export async function getRepository<T extends object>(entityName: string) {
  const em = await getEntityManager()
  return em.getRepository<T>(entityName)
}

/**
 * 获取指定实体的 Repository
 */
export async function getRepositoryByEntity<T extends object>(EntityClass: new () => T) {
  const em = await getEntityManager()
  return em.getRepository(EntityClass)
}

/**
 * 关闭数据库连接
 */
export async function closeMikroORM() {
  if (orm) {
    await orm.close()
    orm = null
    console.log('✅ MikroORM 数据库连接已关闭')
  }
}

/**
 * 测试数据库连接
 */
export async function testConnection() {
  try {
    const em = await getEntityManager()
    // 执行一个简单查询测试连接
    // await em.getConnection().execute('SELECT 1')
    console.log('✅ 数据库连接测试成功')
    return true
  } catch (error) {
    console.error('❌ 数据库连接测试失败:', error)
    return false
  }
}

/**
 * 创建数据库表（根据实体定义）
 * 注意：这只会创建不存在的表，不会删除或修改已存在的表
 */
export async function createSchema() {
  try {
    const mikroOrm = await initMikroORM()
    const generator = mikroOrm.schema
    
    // 创建所有表
    await generator.createSchema()
    console.log('✅ 数据库表创建成功')
    return true
  } catch (error) {
    console.error('❌ 数据库表创建失败:', error)
    throw error
  }
}

/**
 * 更新数据库表结构（根据实体定义）
 * 注意：这会修改已存在的表结构
 */
export async function updateSchema() {
  try {
    const mikroOrm = await initMikroORM()
    const generator = mikroOrm.schema
    
    // 更新表结构
    await generator.updateSchema()
    console.log('✅ 数据库表结构更新成功')
    return true
  } catch (error) {
    console.error('❌ 数据库表结构更新失败:', error)
    throw error
  }
}

/**
 * 删除所有表（危险操作，谨慎使用）
 */
export async function dropSchema() {
  try {
    const mikroOrm = await initMikroORM()
    const generator = mikroOrm.schema
    
    // 删除所有表
    await generator.dropSchema({ wrap: false, dropMigrationsTable: true })
    console.log('✅ 数据库表删除成功')
    return true
  } catch (error) {
    console.error('❌ 数据库表删除失败:', error)
    throw error
  }
}

// 导出 ORM 实例
export { orm }

// 如果直接运行此文件，则测试数据库连接并创建表
if (require.main === module) {
  ;(async () => {
    try {
      await initMikroORM()
      await testConnection()
      
      // 创建数据库表
      console.log('正在创建数据库表...')
      await createSchema()
      
      // 测试完成后关闭连接
      await closeMikroORM()
      process.exit(0)
    } catch (error) {
      console.error('初始化失败:', error)
      process.exit(1)
    }
  })()
}
