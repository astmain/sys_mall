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
  migrations: {
    migrationsList: [],
  },
  metadataCache: { enabled: false },
  allowGlobalContext: true,
  timezone: 'Asia/Shanghai',
//   debug: true,
  logger: console.log.bind(console),
  highlighter: new SqlHighlighter(),
  extensions: [Migrator],
} as Options<PostgreSqlDriver>

export default config
