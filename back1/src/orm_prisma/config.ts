import { defineConfig } from 'prisma/config'

/**
 * Prisma 7+ 配置文件
 * 数据库连接 URL 已从 schema.prisma 移到此文件
 * 用于 Prisma Migrate 命令
 */
export default defineConfig({
  // Schema 文件路径
  schema: './src/orm_prisma',
  migrations: {
    path: './src/orm_prisma/migrations',
  },
  datasource: {
    // 数据库连接地址（用于迁移）
    // 注意：运行时连接需要在 PrismaClient 实例化时传递 adapter
    url: 'postgresql://root:123456@103.119.2.223:2006/back?schema=public',
  },
})
