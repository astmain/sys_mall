import { integer, pgTable, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  // email: varchar({ length: 255 }).notNull().unique(),
})

// cd D:\BBB\sys_mall\back1\src\orm_drizzle ; pnpm drizzle:generate
// cd D:\BBB\sys_mall\back1\src\orm_drizzle ; pnpm drizzle:migrate
// cd D:\BBB\sys_mall\back1\src\orm_drizzle ; pnpm drizzle:studio
