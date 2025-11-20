import { DynamicModule } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaPg as adapter_prisma_pg } from '@prisma/adapter-pg';
export declare const prisma_instance: import("@prisma/client/runtime/client").DynamicClientExtensionThis<Prisma.TypeMap<import("@prisma/client/runtime/client").InternalArgs & {
    result: {
        sys_depart: {
            full_depart_name: () => {
                needs: {
                    name: true;
                    parent_id: true;
                    id: true;
                };
                compute(o: {
                    name: string;
                    id: string;
                    parent_id: string | null;
                }): string;
            };
        };
        sys_user: {
            full_depart_name: () => {
                needs: {
                    name: true;
                };
                compute(o: {
                    name: string;
                }): any;
            };
        };
    };
    model: {};
    query: {};
    client: {};
}, {}>, Prisma.TypeMapCb<{
    adapter: adapter_prisma_pg;
}>, {
    result: {
        sys_depart: {
            full_depart_name: () => {
                needs: {
                    name: true;
                    parent_id: true;
                    id: true;
                };
                compute(o: {
                    name: string;
                    id: string;
                    parent_id: string | null;
                }): string;
            };
        };
        sys_user: {
            full_depart_name: () => {
                needs: {
                    name: true;
                };
                compute(o: {
                    name: string;
                }): any;
            };
        };
    };
    model: {};
    query: {};
    client: {};
}>;
export declare const db: import("@prisma/client/runtime/client").DynamicClientExtensionThis<Prisma.TypeMap<import("@prisma/client/runtime/client").InternalArgs & {
    result: {
        sys_depart: {
            full_depart_name: () => {
                needs: {
                    name: true;
                    parent_id: true;
                    id: true;
                };
                compute(o: {
                    name: string;
                    id: string;
                    parent_id: string | null;
                }): string;
            };
        };
        sys_user: {
            full_depart_name: () => {
                needs: {
                    name: true;
                };
                compute(o: {
                    name: string;
                }): any;
            };
        };
    };
    model: {};
    query: {};
    client: {};
}, {}>, Prisma.TypeMapCb<{
    adapter: adapter_prisma_pg;
}>, {
    result: {
        sys_depart: {
            full_depart_name: () => {
                needs: {
                    name: true;
                    parent_id: true;
                    id: true;
                };
                compute(o: {
                    name: string;
                    id: string;
                    parent_id: string | null;
                }): string;
            };
        };
        sys_user: {
            full_depart_name: () => {
                needs: {
                    name: true;
                };
                compute(o: {
                    name: string;
                }): any;
            };
        };
    };
    model: {};
    query: {};
    client: {};
}>;
interface Opt {
    path: string;
}
export declare class App_prisma_Module {
    static make_path(opt: Opt): DynamicModule;
}
export {};
