/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { info_file } from './info_file';
export type login = {
    /**
     * 手机号
     */
    phone: string;
    /**
     * 密码
     */
    password: string;
    /**
     * 验证码
     */
    code: string;
    /**
     * 列表-主图轮播图
     */
    list_img: Array<info_file>;
};

