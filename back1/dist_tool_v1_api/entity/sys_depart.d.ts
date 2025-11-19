import { at_timestamp } from './common';
import { sys_user } from './sys_user';
import { sys_menu } from './sys_menu';
export declare class sys_depart extends at_timestamp {
    constructor(user_data?: Partial<sys_depart>);
    id: string;
    name: string;
    type: string;
    remark: string;
    sort: number;
    status: boolean;
    parent_id: string | null;
    parent: sys_depart | null;
    children: sys_depart[];
    sys_user: sys_user[];
    sys_menu: sys_menu[];
}
