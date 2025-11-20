import { axios_api } from './axios_api';
export let api_v1 = {
    auth: {
        login: (form) => axios_api.post('/v1/auth/login', form),
    },
};
//# sourceMappingURL=api_v1.js.map