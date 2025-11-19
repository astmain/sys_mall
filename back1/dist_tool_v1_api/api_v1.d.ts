import type { login_type } from './entity/sys_user';
export declare let api_v1: {
    auth: {
        login: (form: login_type) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    };
};
