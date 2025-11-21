import { axios_api } from './axios_api'

import type { login_interface } from '../v1/auth/dto/login'
export type { login_interface } from '../v1/auth/dto/login'

export let api_v1 = {
  auth: {
    login: (form: login_interface) => axios_api.post('/v1/auth/login', form),
  },
}
