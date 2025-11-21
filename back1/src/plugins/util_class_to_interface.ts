export type class_keys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K
}[keyof T]

// 把这些字段 Pick 出来
export type util_class_to_interface<T> = Pick<T, class_keys<T>>
