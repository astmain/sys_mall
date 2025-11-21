import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { db_url } from './db_config'
import * as table_all from './table_all'

const pool = new Pool({ connectionString: db_url })

export const db = drizzle(db_url, { schema: table_all })
