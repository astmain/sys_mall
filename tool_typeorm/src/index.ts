// 只导出类型和纯函数，不导出包含后端依赖的类
// 如果需要使用实体类，请从对应的 entity 文件直接导入（仅在后端使用）

export function my_add(a: number, b: number): number {
  return a + b
}

// 只导出类型，不导出包含后端依赖的类
export type { login_type, remove_ids_user_type } from './types'

// 注意：以下代码包含后端依赖，已注释，仅在后端使用时取消注释
// import 'reflect-metadata'
// import { db1, db1_connect } from './db1'
// import { tb_user } from './entity/tb_user'
// export { Like, In } from 'typeorm'
// export const db_typeorm = db1
// export { tb_user } from './entity/tb_user'
// export { sys_user } from './entity/sys_user'
// export { sys_menu } from './entity/sys_menu'
// export { sys_depart } from './entity/sys_depart'
// tool_typeorm_init_entity()
// export async function tool_typeorm_init_entity() {
//   try {
//     if (!db1_connect.isInitialized) {
//       await db1_connect.initialize()
//       await db1_connect.query("SET TIME ZONE 'Asia/Shanghai'")
//       console.log('数据库连接成功')
//     }
//   } catch (error) {
//     console.error('数据库连接失败:', error)
//     throw error
//   }
// }
