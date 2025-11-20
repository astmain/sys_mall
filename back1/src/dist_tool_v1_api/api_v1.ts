import { axios_api } from './axios_api'
import { login } from '@src/v1/auth/dto/login'

export let api_v1 = {
  auth: {
    login: (form: InstanceType<typeof login>) => axios_api.post('/v1/auth/login', form),
  },
}
