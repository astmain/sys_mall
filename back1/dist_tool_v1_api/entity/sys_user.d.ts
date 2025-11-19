import { at_timestamp } from './common'
import { sys_depart } from './sys_depart'
export declare class sys_user extends at_timestamp {
  constructor(user_data?: Partial<sys_user>)
  user_id: string
  phone: string
  password: string
  name: string
  avatar: string
  remark: string
  status: boolean
  gender: '男' | '女' | '未知'
  sys_depart: sys_depart[]
}
declare const login_base: import('@nestjs/common').Type<Pick<sys_user, 'phone' | 'password'>>
export declare class login extends login_base {}
export declare class remove_ids_user {
  ids: string[]
}
export {}
