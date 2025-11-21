import { defineConfig } from 'drizzle-kit'

export const db_url = 'postgresql://root:123456@103.119.2.223:2007/back?schema=public'

export default defineConfig({
  out: './drizzle',
  schema: './src/orm_drizzle/users.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: db_url,
  },
})
