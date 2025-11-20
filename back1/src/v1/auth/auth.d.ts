import { login } from './dto/login';
export declare class auth {
    login(body: login): Promise<{
        code: number;
        msg: string;
        result: {
            token: string;
            id?: undefined;
            user?: undefined;
        };
    } | {
        code: number;
        msg: string;
        result: {
            token: string;
            id: string;
            user: string;
        };
    }>;
    init_data_sys_menu_depart_user(): Promise<{
        code: number;
        msg: string;
        result: {
            error?: undefined;
        };
    } | {
        code: number;
        msg: string;
        result: {
            error: any;
        };
    }>;
}
export declare class auth_module {
}
