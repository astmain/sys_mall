import { axios_api } from './axios_api'
// import type { type_login } from './entity/sys_user'
import { login } from './entity/sys_user'

type type_login = InstanceType<typeof login>

export let api_v1 = {
  auth: {
    login: (form: InstanceType<typeof login>) => axios_api.post('/v1/auth/login', form),
  },
}
