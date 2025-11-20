// db.ts
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as table from './table'

const pool = new Pool({
  connectionString: 'postgresql://root:123456@103.119.2.223:2006/back?schema=public',
})

export const db = drizzle(pool, { schema: table })


// console.log('✅db---连接成功:', db)




async function test() {
  const allUsers =await db.select().from(table.sys_user)
  console.log('✅test---所有用户:', allUsers)
}

test()
