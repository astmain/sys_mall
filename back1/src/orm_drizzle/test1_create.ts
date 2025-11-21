import { and, type AnyColumn, type SQL, ilike, like, asc, eq, lte } from 'drizzle-orm'
import { db_where } from './db_where'
import { db } from './db_connect'
import { users } from './table_all'

main()
async function main() {
  const insert111 = await db.insert(users).values({ name: '测试12', age: 25 })
  console.log('insert111', insert111)

  //   const update111 = await db.update(users).set({ name: '测试13', age: 26 }).where()
  const update111 = await db.update(users).set({ name: '测试13', age: 26 }).where(eq(users.id, 1))
  console.log('update111', update111)

  //   const delete111 = await db.delete(users).where(eq(users.id, 1))
  //   console.log('delete111', delete111)

  const select111 = await db.select({ id: users.id, name: users.name }).from(users)
  console.log('select111', select111)

  // const findMany111 = await db.query.users.findMany({ where: eq(users.id, 1), columns: { id: true, name: true }, orderBy: [asc(users.id)], limit: 10 })
  // const findMany111 = await db.query.users.findMany({ where: { age: lte(users.age, 25) }, columns: { id: true, name: true }, orderBy: [asc(users.id)], limit: 10 })
  // const findMany111 = await db.query.users.findMany({ with: { age: eq(users.age, 25) }, columns: { id: true, name: true }, orderBy: [asc(users.id)], limit: 10 })
  // const findMany111 = await db.query.users.findMany({ with: { posts: true }, columns: { id: true, name: true }, orderBy: [asc(users.id)], limit: 10 })
  const findMany111 = await db.query.users.findMany({ where: db_where(users, { name: { like: '%3%' } }) })
  console.log('findMany111', findMany111)
}
