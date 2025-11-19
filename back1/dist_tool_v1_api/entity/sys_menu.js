var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, JoinColumn, ManyToMany } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsIn, IsBoolean } from 'class-validator';
import { at_timestamp } from './common';
import { sys_depart } from './sys_depart';
let sys_menu = class sys_menu extends at_timestamp {
    constructor(user_data) {
        super();
        Object.assign(this, user_data);
    }
    id = uuidv4();
    name;
    path;
    type = 'menu';
    remark = "";
    status = true;
    parent_id;
    parent;
    children;
    sys_depart;
};
__decorate([
    PrimaryColumn({ type: 'varchar', comment: '主键ID' }),
    ApiProperty({ description: '主键ID', example: 'uuid' }),
    IsString(),
    __metadata("design:type", String)
], sys_menu.prototype, "id", void 0);
__decorate([
    Column(),
    ApiProperty({ description: '菜单名称', example: '首页' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], sys_menu.prototype, "name", void 0);
__decorate([
    Column(),
    ApiProperty({ description: '路径', example: '/user/list' }),
    IsString(),
    __metadata("design:type", String)
], sys_menu.prototype, "path", void 0);
__decorate([
    Column({ default: "menu" }),
    ApiProperty({ description: '类型', example: 'menu' }),
    IsString(),
    IsNotEmpty(),
    IsIn(['menu', 'button']),
    __metadata("design:type", String)
], sys_menu.prototype, "type", void 0);
__decorate([
    Column({ default: "" }),
    ApiProperty({ description: '备注', example: "" }),
    IsString(),
    __metadata("design:type", String)
], sys_menu.prototype, "remark", void 0);
__decorate([
    Column({ default: true }),
    ApiProperty({ description: '状态', example: "1" }),
    IsBoolean(),
    __metadata("design:type", Boolean)
], sys_menu.prototype, "status", void 0);
__decorate([
    Column({ type: 'varchar', nullable: true }),
    ApiProperty({ description: '父菜单ID', example: 'uuid' }),
    IsString(),
    __metadata("design:type", Object)
], sys_menu.prototype, "parent_id", void 0);
__decorate([
    ManyToOne(() => sys_menu, (menu) => menu.children, { nullable: true, onDelete: 'CASCADE' }),
    JoinColumn({ name: 'parent_id' }),
    __metadata("design:type", Object)
], sys_menu.prototype, "parent", void 0);
__decorate([
    OneToMany(() => sys_menu, (menu) => menu.parent),
    __metadata("design:type", Array)
], sys_menu.prototype, "children", void 0);
__decorate([
    ManyToMany(() => sys_depart, (depart) => depart.sys_menu),
    __metadata("design:type", Array)
], sys_menu.prototype, "sys_depart", void 0);
sys_menu = __decorate([
    Entity('sys_menu'),
    __metadata("design:paramtypes", [Object])
], sys_menu);
export { sys_menu };
export class find_tree_menu extends PickType(sys_menu, ['path', 'type']) {
}
//# sourceMappingURL=sys_menu.js.map