/**
 * @name:工具-将类转成接口
 * @description:将一个类(Class)转换为其对应的纯数据接口类型(Interface)
 * @return:{ phone: string; password: string; }
 * @example:
 * ```ts
 * import { LoginDto } from './dto/login.dto'
 * import { util_class_to_interface } from './util_class_to_interface'
 * export type ILogin = util_class_to_interface<LoginDto>
 * ```
 */
export type util_class_to_interface<T> = Pick<T, class_keys<T>>

export type class_keys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K
}[keyof T]
