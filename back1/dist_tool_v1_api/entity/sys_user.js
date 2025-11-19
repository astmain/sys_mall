var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsIn, IsBoolean, IsMobilePhone, IsArray } from 'class-validator';
import { at_timestamp } from './common';
import { sys_depart } from './sys_depart';
let sys_user = class sys_user extends at_timestamp {
    constructor(user_data) {
        super();
        Object.assign(this, user_data);
    }
    user_id = uuidv4();
    phone;
    password;
    name = '';
    avatar = 'https://cdn.jsdelivr.net/gh/astmain/filestore@master/avatar_default.png';
    remark = '';
    status = true;
    gender = '未知';
    sys_depart;
};
__decorate([
    PrimaryColumn({ type: 'varchar', comment: '主键ID' }),
    ApiProperty({ description: '主键ID', example: 'uuid' }),
    IsString(),
    __metadata("design:type", String)
], sys_user.prototype, "user_id", void 0);
__decorate([
    Column(),
    ApiProperty({ description: '手机号', example: '15160315110' }),
    IsString(),
    IsNotEmpty(),
    IsMobilePhone('zh-CN', {}, { message: '手机号格式不正确' }),
    __metadata("design:type", String)
], sys_user.prototype, "phone", void 0);
__decorate([
    Column(),
    ApiProperty({ description: '密码', example: '123456' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], sys_user.prototype, "password", void 0);
__decorate([
    Column(),
    ApiProperty({ description: '姓名', example: '姓名' }),
    IsString(),
    __metadata("design:type", String)
], sys_user.prototype, "name", void 0);
__decorate([
    Column(),
    ApiProperty({ description: '头像', example: 'https://cdn.jsdelivr.net/gh/astmain/filestore@master/avatar_default.png' }),
    IsString(),
    __metadata("design:type", String)
], sys_user.prototype, "avatar", void 0);
__decorate([
    Column(),
    ApiProperty({ description: '备注', example: '' }),
    IsString(),
    __metadata("design:type", String)
], sys_user.prototype, "remark", void 0);
__decorate([
    Column(),
    ApiProperty({ description: '状态', example: '1' }),
    IsBoolean(),
    __metadata("design:type", Boolean)
], sys_user.prototype, "status", void 0);
__decorate([
    Column(),
    ApiProperty({ description: '性别', example: '男' }),
    IsString(),
    IsNotEmpty(),
    IsIn(['男', '女', '未知'], { message: '性别格式不正确' }),
    __metadata("design:type", String)
], sys_user.prototype, "gender", void 0);
__decorate([
    ManyToMany(() => sys_depart, (o) => o.sys_user),
    JoinTable({
        name: 'ref_user_depart',
        joinColumn: { name: 'user_id', referencedColumnName: 'user_id' },
        inverseJoinColumn: { name: 'depart_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], sys_user.prototype, "sys_depart", void 0);
sys_user = __decorate([
    Entity('sys_user'),
    __metadata("design:paramtypes", [Object])
], sys_user);
export { sys_user };
export class login extends PickType(sys_user, ['phone', 'password']) {
}
export class remove_ids_user {
    ids;
}
__decorate([
    ApiProperty({ description: 'ids', example: ['1', '2'], isArray: true }),
    IsArray(),
    IsString({ each: true }),
    __metadata("design:type", Array)
], remove_ids_user.prototype, "ids", void 0);
//# sourceMappingURL=sys_user.js.map