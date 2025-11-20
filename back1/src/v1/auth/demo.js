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
import { Module, Body, Req } from '@nestjs/common';
import { Api_Post } from '@src/plugins/Api_Post';
import { Api_group } from '@src/plugins/Api_group';
import { Api_public } from '@src/App_Auth';
let demo = class demo {
    async login(body, _req) {
        console.log(`login---body:`, body);
        return { code: 200, msg: '成功', result: {} };
    }
    async init_data_sys_menu_depart_user(body, _req) {
        return { code: 200, msg: '成功', result: {} };
    }
};
__decorate([
    Api_Post('111111'),
    __param(0, Body()),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], demo.prototype, "login", null);
__decorate([
    Api_Post('222222'),
    __param(0, Body()),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], demo.prototype, "init_data_sys_menu_depart_user", null);
demo = __decorate([
    Api_public(),
    Api_group('v1', '000000')
], demo);
export { demo };
let demo_module = class demo_module {
};
demo_module = __decorate([
    Module({
        controllers: [demo],
        providers: [],
    })
], demo_module);
export { demo_module };
//# sourceMappingURL=demo.js.map