var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Module, Body } from '@nestjs/common';
import { Api_group } from '@src/plugins/Api_group';
import { Api_public } from '@src/App_Auth';
import { Api_Post } from '@src/plugins/Api_Post';
import { db } from '@src/orm_prisma/db';
import { login } from './dto/login';
import { JwtService } from '@nestjs/jwt';
let auth = class auth {
    async login(body) {
        let one = await db.sys_user.findFirst({ where: { phone: body.phone, password: body.password } });
        if (!one)
            return { code: 400, msg: '失败:用户不存在', result: { token: '123456' } };
        const payload = { id: one?.id, user: one.phone };
        const my_jwt_service = new JwtService();
        const token = my_jwt_service.sign(payload, { secret: process.env.VITE_jwt_secret });
        return { code: 200, msg: '登录成功', result: { token: token, id: one.id, user: one.phone } };
    }
    async init_data_sys_menu_depart_user() {
        try {
            await db.sys_menu.deleteMany();
            await db.sys_depart.deleteMany();
            await db.sys_user.deleteMany();
            await db.sys_depart.createMany({
                data: [
                    { id: 'depart_0', name: '总公司', type: 'company', remark: '' },
                    { id: 'depart_1', name: '客户部', type: 'depart', parent_id: 'depart_0', remark: '' },
                    { id: 'depart_2', name: '技术部', type: 'depart', parent_id: 'depart_0', remark: '' },
                    { id: 'depart_3', name: '财务部', type: 'depart', parent_id: 'depart_0', remark: '' },
                    { id: 'role_1001', name: '客户普通', type: 'role', parent_id: 'depart_1', remark: '' },
                    { id: 'role_1002', name: '客户高级', type: 'role', parent_id: 'depart_1', remark: '' },
                    { id: 'role_2001', name: '技术职员', type: 'role', parent_id: 'depart_2', remark: '' },
                    { id: 'role_2002', name: '技术主管', type: 'role', parent_id: 'depart_2', remark: '' },
                    { id: 'role_3001', name: '财务职员', type: 'role', parent_id: 'depart_3', remark: '' },
                    { id: 'role_3002', name: '财务主管', type: 'role', parent_id: 'depart_3', remark: '' },
                ],
            });
            await db.sys_menu.createMany({
                data: [
                    { id: 'menu_1', name: '首页', path: '/home' },
                    { id: 'menu_2', name: '商城管理', path: '/shop' },
                    { id: 'menu_3', name: '用户管理', path: '/system/user' },
                    { id: 'menu_4', name: '菜单管理', path: '/system/menu' },
                    { id: 'menu_5', name: '字典管理', path: '/dict' },
                    { id: 'sub_2001', name: '订单管理', path: '/shop/order', parent_id: 'menu_2' },
                    { id: 'sub_2002', name: '商品管理', path: '/shop/product', parent_id: 'menu_2' },
                    { id: 'sub_2003', name: '财务管理', path: '/shop/finance', parent_id: 'menu_2' },
                ],
            });
            let 首页_查看 = { parent_id: 'menu_1', path: '/home:查看', id: '/home:查看', remark: '首页_查看', name: '查看', type: 'button' };
            let 首页_删除 = { parent_id: 'menu_1', path: '/home:删除', id: '/home:删除', remark: '首页_删除', name: '删除', type: 'button' };
            let 首页_新增 = { parent_id: 'menu_1', path: '/home:新增', id: '/home:新增', remark: '首页_新增', name: '新增', type: 'button' };
            let 首页_修改 = { parent_id: 'menu_1', path: '/home:修改', id: '/home:修改', remark: '首页_修改', name: '修改', type: 'button' };
            await db.sys_menu.createMany({ data: [首页_查看, 首页_删除, 首页_新增, 首页_修改] });
            let 用户管理_查看 = { parent_id: 'menu_3', path: '/system/user:查看', id: '/system/user:查看', remark: '用户管理_查看', name: '查看', type: 'button' };
            let 用户管理_删除 = { parent_id: 'menu_3', path: '/system/user:删除', id: '/system/user:删除', remark: '用户管理_删除', name: '删除', type: 'button' };
            let 用户管理_新增 = { parent_id: 'menu_3', path: '/system/user:新增', id: '/system/user:新增', remark: '用户管理_新增', name: '新增', type: 'button' };
            let 用户管理_修改 = { parent_id: 'menu_3', path: '/system/user:修改', id: '/system/user:修改', remark: '用户管理_修改', name: '修改', type: 'button' };
            await db.sys_menu.createMany({ data: [用户管理_查看, 用户管理_删除, 用户管理_新增, 用户管理_修改] });
            let 字典_查看 = { parent_id: 'menu_5', path: '/dict:查看', id: '/dict:查看', remark: '字典_查看', name: '查看', type: 'button' };
            let 字典_删除 = { parent_id: 'menu_5', path: '/dict:删除', id: '/dict:删除', remark: '字典_删除', name: '删除', type: 'button' };
            let 字典_新增 = { parent_id: 'menu_5', path: '/dict:新增', id: '/dict:新增', remark: '字典_新增', name: '新增', type: 'button' };
            let 字典_修改 = { parent_id: 'menu_5', path: '/dict:修改', id: '/dict:修改', remark: '字典_修改', name: '修改', type: 'button' };
            await db.sys_menu.createMany({ data: [字典_查看, 字典_删除, 字典_新增, 字典_修改] });
            let 订单管理_查看 = { parent_id: 'sub_2001', path: '/order:查看', id: '/order:查看', remark: '订单管理_查看', name: '查看', type: 'button' };
            let 订单管理_删除 = { parent_id: 'sub_2001', path: '/order:删除', id: '/order:删除', remark: '订单管理_删除', name: '删除', type: 'button' };
            let 订单管理_新增 = { parent_id: 'sub_2001', path: '/order:新增', id: '/order:新增', remark: '订单管理_新增', name: '新增', type: 'button' };
            let 订单管理_修改 = { parent_id: 'sub_2001', path: '/order:修改', id: '/order:修改', remark: '订单管理_修改', name: '修改', type: 'button' };
            let 订单管理_修改价格 = { parent_id: 'sub_2001', path: '/order:修改价格', id: '/order:修改价格', remark: '订单管理_修改价格', name: '修改价格', type: 'button' };
            await db.sys_menu.createMany({ data: [订单管理_查看, 订单管理_删除, 订单管理_新增, 订单管理_修改, 订单管理_修改价格] });
            let 商品管理_查看 = { parent_id: 'sub_2002', path: '/product:查看', id: '/product:查看', remark: '商品管理_查看', name: '查看', type: 'button' };
            let 商品管理_删除 = { parent_id: 'sub_2002', path: '/product:删除', id: '/product:删除', remark: '商品管理_删除', name: '删除', type: 'button' };
            let 商品管理_新增 = { parent_id: 'sub_2002', path: '/product:新增', id: '/product:新增', remark: '商品管理_新增', name: '新增', type: 'button' };
            let 商品管理_修改 = { parent_id: 'sub_2002', path: '/product:修改', id: '/product:修改', remark: '商品管理_修改', name: '修改', type: 'button' };
            await db.sys_menu.createMany({ data: [商品管理_查看, 商品管理_删除, 商品管理_新增, 商品管理_修改] });
            let 财务管理_查看 = { parent_id: 'sub_2003', path: '/finance:查看', id: '/finance:查看', remark: '财务管理_查看', name: '查看', type: 'button' };
            let 财务管理_删除 = { parent_id: 'sub_2003', path: '/finance:删除', id: '/finance:删除', remark: '财务管理_删除', name: '删除', type: 'button' };
            let 财务管理_新增 = { parent_id: 'sub_2003', path: '/finance:新增', id: '/finance:新增', remark: '财务管理_新增', name: '新增', type: 'button' };
            let 财务管理_修改 = { parent_id: 'sub_2003', path: '/finance:修改', id: '/finance:修改', remark: '财务管理_修改', name: '修改', type: 'button' };
            await db.sys_menu.createMany({ data: [财务管理_查看, 财务管理_删除, 财务管理_新增, 财务管理_修改] });
            await db.sys_depart.update({ where: { id: 'role_1001' }, data: { sys_menu: { connect: [首页_查看].map((o) => ({ id: o.id })) } } });
            await db.sys_depart.update({ where: { id: 'role_2001' }, data: { sys_menu: { connect: [首页_查看, 首页_删除, 首页_新增, 首页_修改].map((o) => ({ id: o.id })) } } });
            await db.sys_depart.update({ where: { id: 'role_3001' }, data: { sys_menu: { connect: [财务管理_查看].map((o) => ({ id: o.id })) } } });
            await db.sys_depart.update({ where: { id: 'role_3002' }, data: { sys_menu: { connect: [财务管理_查看, 财务管理_删除, 财务管理_新增, 财务管理_修改, 商品管理_查看].map((o) => ({ id: o.id })) } } });
            let 技术部_菜单1 = [
                首页_查看,
                首页_删除,
                首页_新增,
                首页_修改,
                用户管理_查看,
                用户管理_删除,
                用户管理_新增,
                用户管理_修改,
            ].map((o) => ({ id: o.id }));
            let 技术部_菜单2 = [
                首页_查看,
                首页_删除,
                首页_新增,
                首页_修改,
                字典_查看,
                字典_删除,
                字典_新增,
                字典_修改,
                用户管理_查看,
                用户管理_删除,
                用户管理_新增,
                用户管理_修改,
                订单管理_查看,
                订单管理_删除,
                订单管理_新增,
                订单管理_修改,
                订单管理_修改价格,
                商品管理_查看,
                商品管理_删除,
                商品管理_新增,
                商品管理_修改,
                财务管理_查看,
                财务管理_删除,
                财务管理_新增,
                财务管理_修改,
            ].map((o) => ({ id: o.id }));
            await db.sys_depart.update({ where: { id: 'role_2001' }, data: { sys_menu: { connect: 技术部_菜单1 } } });
            await db.sys_depart.update({ where: { id: 'role_2002' }, data: { sys_menu: { connect: 技术部_菜单2 } } });
            let 全部权限 = ['role_1002', 'role_2002', 'role_3001', 'role_3002'].map((id) => ({ id }));
            await db.sys_user.create({ data: { id: 'user_1', name: '许鹏', phone: '15160315110', password: '123456', sys_depart: { connect: 全部权限 } } });
            await db.sys_user.create({ data: { id: 'user_2', name: '二狗', phone: '15160315002', password: '123456', sys_depart: { connect: ['role_1001'].map((id) => ({ id })) } } });
            await db.sys_user.create({ data: { id: 'user_3', name: '张三', phone: '15160315003', password: '123456', sys_depart: { connect: ['role_1001', 'role_3001'].map((id) => ({ id })) } } });
            await db.sys_user.create({ data: { id: 'user_4', name: '李四', phone: '15160315004', password: '123456', sys_depart: { connect: ['role_1001', 'role_3002'].map((id) => ({ id })) } } });
            await db.sys_user.create({ data: { id: 'user_5', name: '王五', phone: '15160315005', password: '123456', sys_depart: { connect: ['role_1001', 'role_3002'].map((id) => ({ id })) } } });
            return { code: 200, msg: '成功:数据库初始化完成', result: {} };
        }
        catch (error) {
            return { code: 400, msg: '失败:初始化', result: { error } };
        }
        finally {
            await db.$disconnect();
        }
    }
};
__decorate([
    Api_public(),
    Api_Post('登陆'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login]),
    __metadata("design:returntype", Promise)
], auth.prototype, "login", null);
__decorate([
    Api_public(),
    Api_Post('初始化数据-菜单-部门-用户'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], auth.prototype, "init_data_sys_menu_depart_user", null);
auth = __decorate([
    Api_group('v1', '认证')
], auth);
export { auth };
let auth_module = class auth_module {
};
auth_module = __decorate([
    Module({
        controllers: [auth],
        providers: [],
    })
], auth_module);
export { auth_module };
//# sourceMappingURL=auth.js.map