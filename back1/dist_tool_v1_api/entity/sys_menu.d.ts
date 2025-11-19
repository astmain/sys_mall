import { at_timestamp } from './common';
import { sys_depart } from './sys_depart';
export declare class sys_menu extends at_timestamp {
    constructor(user_data?: Partial<sys_menu>);
    id: string;
    name: string;
    path: string;
    type: string;
    remark: string;
    status: boolean;
    parent_id: string | null;
    parent: sys_menu | null;
    children: sys_menu[];
    sys_depart: sys_depart[];
}
declare const find_tree_menu_base: import("@nestjs/common").Type<Pick<sys_menu, "type" | "path">>;
export declare class find_tree_menu extends find_tree_menu_base {
}
export type find_tree_menu_type = InstanceType<typeof find_tree_menu>;
export {};
