import { login } from './entity/sys_user';
export declare let api_v1: {
    auth: {
        login: (form: InstanceType<typeof login>) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    };
};
