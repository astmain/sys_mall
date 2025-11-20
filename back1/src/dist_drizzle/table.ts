import { pgTable, serial, text, varchar, boolean, timestamp, integer } from 'drizzle-orm/pg-core'

export const sys_user = pgTable('sys_user', {
  user_id: serial().primaryKey(),
  phone: text().notNull(),
  password: text().notNull().notNull(),
  name: text().notNull().notNull(),
  remark: text().notNull().default(''),
  status: boolean().notNull().default(true),
  gender: text().notNull().default('未知'),
  avatar: text().notNull().default('https://cdn.jsdelivr.net/gh/astmain/filestore@master/avatar_default.png'),
  created_at: timestamp('created_at').defaultNow().notNull(),
})

export const sys_depart = pgTable('sys_depart', {
  user_id: serial().primaryKey(),
  phone: text().notNull(),
  type: text().notNull().default('depart'),
  name: text().notNull(),
  remark: text().notNull().default(''),
  sort: integer().default(0),
  parent_id: text(),
})

/**
 * 注意：Drizzle ORM 0.44.7 不支持链式调用 .comment() 方法
 * 添加数据库注释需要在迁移 SQL 文件中手动添加，例如：
 *
 * -- 表注释
 * COMMENT ON TABLE sys_user IS '用户表';
 * COMMENT ON TABLE sys_depart IS '部门表';
 *
 * -- 列注释
 * COMMENT ON COLUMN sys_user.id IS '用户ID，自增主键';
 * COMMENT ON COLUMN sys_user.name IS '用户名';
 * COMMENT ON COLUMN sys_user.email IS '用户邮箱，唯一';
 * COMMENT ON COLUMN sys_user.created_at IS '创建时间';
 * COMMENT ON COLUMN sys_depart.name IS '部门名称';
 * COMMENT ON COLUMN sys_depart.created_at IS '创建时间';
 * COMMENT ON COLUMN sys_depart.author_id IS '作者ID，外键关联用户表';
 */
