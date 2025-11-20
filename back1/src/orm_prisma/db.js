var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var App_prisma_Module_1;
import { Module, Global } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaPg as adapter_prisma_pg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import _ from 'lodash';
const pool = new Pool({ connectionString: 'postgresql://root:123456@103.119.2.223:2006/back?schema=public' });
const adapter = new adapter_prisma_pg(pool);
const virtual_field_extension = Prisma.defineExtension({
    result: {
        sys_depart: {
            full_depart_name: {
                needs: { name: true, parent_id: true, id: true },
                compute(o) {
                    if (o.parent_id && o.id != 'role_1001') {
                        return `${o.parent?.name || '未知父级'}/${o.name}`;
                    }
                    else if (o.id == 'role_1001') {
                        return '';
                    }
                    else {
                        return o.name;
                    }
                },
            },
        },
        sys_user: {
            full_depart_name: {
                needs: { name: true },
                compute(o) {
                    let result = o.sys_depart?.map((depart) => depart.full_depart_name) || [];
                    result = _.filter(result, (o) => o != '');
                    return result;
                },
            },
        },
    },
});
export const prisma_instance = new PrismaClient({ adapter }).$extends(virtual_field_extension);
export const db = prisma_instance;
let App_prisma_Module = App_prisma_Module_1 = class App_prisma_Module {
    static make_path(opt) {
        const result = {
            module: App_prisma_Module_1,
            providers: [{ provide: 'App_Prisma', useValue: prisma_instance }],
        };
        return result;
    }
};
App_prisma_Module = App_prisma_Module_1 = __decorate([
    Global(),
    Module({
        imports: [],
        providers: [{ provide: 'App_prisma_Module', useValue: { App_prisma_Module: prisma_instance } }],
        exports: [{ provide: 'App_prisma_Module', useValue: { baseUrl: '/v1' } }],
    })
], App_prisma_Module);
export { App_prisma_Module };
//# sourceMappingURL=db.js.map