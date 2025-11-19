// 纯类型定义文件，不包含后端依赖
// 用于前端项目，避免导入包含后端依赖的类

// 从 entity/sys_user 导出的类型
export type login_type = {
  phone: string
  password: string
}

export type remove_ids_user_type = {
  ids: string[]
}

