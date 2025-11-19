var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, IsIn, IsBoolean, Min } from 'class-validator';
import { at_timestamp } from './common';
import { sys_user } from './sys_user';
import { sys_menu } from './sys_menu';
let sys_depart = class sys_depart extends at_timestamp {
    constructor(user_data) {
        super();
        Object.assign(this, user_data);
    }
    id = uuidv4();
    name;
    type = 'depart';
    remark = "";
    sort = 0;
    status = true;
    parent_id;
    parent;
    children;
    sys_user;
    sys_menu;
};
__decorate([
    PrimaryColumn({ type: 'varchar', comment: '主键ID' }),
    ApiProperty({ description: '主键ID', example: 'uuid' }),
    IsString(),
    __metadata("design:type", String)
], sys_depart.prototype, "id", void 0);
__decorate([
    Column(),
    ApiProperty({ description: '菜单名称', example: '首页' }),
    IsString(),
    __metadata("design:type", String)
], sys_depart.prototype, "name", void 0);
__decorate([
    Column({ default: "depart", select: false }),
    ApiProperty({ description: '类型', example: 'depart' }),
    IsString(),
    IsNotEmpty(),
    IsIn(['depart', 'company']),
    __metadata("design:type", String)
], sys_depart.prototype, "type", void 0);
__decorate([
    Column({ default: "", select: false }),
    ApiProperty({ description: '备注', example: "" }),
    IsString(),
    __metadata("design:type", String)
], sys_depart.prototype, "remark", void 0);
__decorate([
    Column({ default: 0, select: false }),
    ApiProperty({ description: '排序', example: 0 }),
    IsInt(),
    IsNotEmpty(),
    Min(0),
    __metadata("design:type", Number)
], sys_depart.prototype, "sort", void 0);
__decorate([
    Column({ default: true, select: false }),
    ApiProperty({ description: '状态', example: true }),
    IsBoolean(),
    __metadata("design:type", Boolean)
], sys_depart.prototype, "status", void 0);
__decorate([
    Column({ type: 'varchar', nullable: true }),
    ApiProperty({ description: '父部门ID', example: 'uuid' }),
    IsString(),
    __metadata("design:type", Object)
], sys_depart.prototype, "parent_id", void 0);
__decorate([
    ManyToOne(() => sys_depart, (o) => o.children, { nullable: true, onDelete: 'CASCADE' }),
    JoinColumn({ name: 'parent_id' }),
    __metadata("design:type", Object)
], sys_depart.prototype, "parent", void 0);
__decorate([
    OneToMany(() => sys_depart, (o) => o.parent),
    __metadata("design:type", Array)
], sys_depart.prototype, "children", void 0);
__decorate([
    ManyToMany(() => sys_user, (o) => o.sys_depart),
    JoinTable({
        name: 'ref_user_depart',
        joinColumn: { name: 'depart_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'user_id', referencedColumnName: 'user_id' },
    }),
    __metadata("design:type", Array)
], sys_depart.prototype, "sys_user", void 0);
__decorate([
    ManyToMany(() => sys_menu, (o) => o.sys_depart),
    JoinTable({
        name: 'ref_depart_menu',
        joinColumn: { name: 'depart_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'menu_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], sys_depart.prototype, "sys_menu", void 0);
sys_depart = __decorate([
    Entity('sys_depart'),
    __metadata("design:paramtypes", [Object])
], sys_depart);
export { sys_depart };
//# sourceMappingURL=sys_depart.js.map