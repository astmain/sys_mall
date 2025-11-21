
import { and, type AnyColumn, type SQL, ilike, like, asc, eq, lte } from 'drizzle-orm'
// =========================== 类型定义 ===========================

// 提取 table 上是列的那些 key（只要列，排除 relations 等）
type ColumnKeys<TTable> = {
    [K in keyof TTable]: TTable[K] extends AnyColumn ? K : never
  }[keyof TTable]
  
  // 单个字段支持的查询写法：
  // - 直接值：eq
  // - { eq: value }
  // - { like: 'xxx' }   // 会自动变成 '%xxx%'
  // - { ilike: 'xxx' }  // 会自动变成 '%xxx%'
  type FieldCondition<T = unknown> =
    | T
    | {
        eq?: T
        like?: string
        ilike?: string
      }
  
  // 对象式 where
  export type WhereInput<TTable> = Partial<Record<ColumnKeys<TTable>, FieldCondition>>
  
  // =========================== db_where 实现 ===========================
  
  // 自动补通配符：如果字符串里已经包含 % 或 _，就视为原生 pattern，不再包
  const toLikePattern = (raw: string) => (/[%_]/.test(raw) ? raw : `%${raw}%`)
  
  export function db_where<TTable>(table: TTable, where?: WhereInput<TTable>): SQL | undefined {
    if (!where) return undefined
  
    const conditions: SQL[] = []
  
    for (const key in where) {
      const value = where[key]
      if (value === undefined) continue
  
      const column = (table as any)[key] as AnyColumn
  
      // 对象形式：{ like / ilike / eq }
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const v = value as { eq?: unknown; like?: string; ilike?: string }
  
        if (v.like !== undefined) {
          conditions.push(like(column, toLikePattern(v.like)))
          continue
        }
  
        if (v.ilike !== undefined) {
          conditions.push(ilike(column, toLikePattern(v.ilike)))
          continue
        }
  
        if (v.eq !== undefined) {
          conditions.push(eq(column, v.eq as any))
          continue
        }
  
        // 没有操作符就当普通值处理（兜底）
        conditions.push(eq(column, value as any))
      } else {
        // 直接值形式：where: { id: 1 }
        conditions.push(eq(column, value as any))
      }
    }
  
    if (!conditions.length) return undefined
    return conditions.length === 1 ? conditions[0] : and(...conditions)
  }
  