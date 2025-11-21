import { axios_api } from './axios_api'
import { login } from '../v1/auth/dto/login'
import { z } from 'zod'

//从 login 类动态转成 interface 类型，并展开显示
const loginInstance = new login()
export type LoginForm = typeof loginInstance & {}

export let api_v1 = {
  auth: {
    login: (form: LoginForm) => axios_api.post('/v1/auth/login', form),
  },
}
