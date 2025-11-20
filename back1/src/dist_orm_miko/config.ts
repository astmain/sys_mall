import { Options } from '@mikro-orm/core'
import { PostgreSqlDriver } from '@mikro-orm/postgresql'
import { Migrator } from '@mikro-orm/migrations'
import { tb_user } from './entity/tb_user'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'

const config = {
  host: '103.119.2.223',
  port: 2006,
  dbName: 'back',
  user: 'root',
  password: '123456',

  driver: PostgreSqlDriver,
  metadataProvider: TsMorphMetadataProvider,
  entities: [tb_user],

  // 迁移配置
  migrations: {
    path: './dist/dist_orm_miko/migrations',
    pathTs: './src/dist_orm_miko/migrations',
    glob: '!(*.d).{js,ts}',
  },

  metadataCache: { enabled: false },
  allowGlobalContext: true,
  timezone: 'Asia/Shanghai',
  //   debug: true,
  logger: console.log.bind(console),
  highlighter: new SqlHighlighter(),
  extensions: [Migrator],
  autoFlush: true,
} as Options<PostgreSqlDriver>

export default config
