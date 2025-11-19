import { axios_api } from './axios_api'
import type { login_type } from './entity/sys_user'
export let api_v1 = {
  auth: {
    login: (form: login_type) => axios_api.post('/v1/auth/login', form),
  },
}
