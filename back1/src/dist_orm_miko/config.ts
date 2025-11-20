import 'reflect-metadata'
import { Options } from '@mikro-orm/core'
import { PostgreSqlDriver } from '@mikro-orm/postgresql'
import { tb_user } from './entity/tb_user'

const config: Options<PostgreSqlDriver> = {
  // 指定数据库驱动
  driver: PostgreSqlDriver,
  
  // 数据库连接配置
  host: '103.119.2.223',
  port: 2006,
  user: 'root',
  password: '123456',
  dbName: 'back',

  // 直接指定实体类（确保 reflect-metadata 已导入）
  entities: [tb_user],

  // TypeScript 实体路径（用于 CLI 工具和自动发现）
  entitiesTs: ['./src/dist_orm_miko/entity'],

  // 开发配置
  debug: true, // 打印 SQL 日志
  logger: console.log.bind(console),

  // 迁移配置（如果使用）
  migrations: {
    path: './dist/dist_orm_miko/migrations',
    pathTs: './src/dist_orm_miko/migrations',
    glob: '!(*.d).{js,ts}',
  },

  // 其他配置
  allowGlobalContext: true, // 允许全局上下文（开发时）
  timezone: 'Asia/Shanghai',
}

export default config
