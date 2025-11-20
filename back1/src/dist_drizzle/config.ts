import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/dist_drizzle/table.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://root:123456@103.119.2.223:2006/back',
  },
})
