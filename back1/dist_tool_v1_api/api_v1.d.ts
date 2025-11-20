import type { login } from '@src/v1/auth/dto/login';
export declare let api_v1: {
    auth: {
        login: (form: InstanceType<typeof login>) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    };
};
