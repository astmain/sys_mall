var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Module, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';
export const IS_PUBLIC_KEY = 'Api_public';
process.env.VITE_jwt_secret = 'xzz2021';
process.env.VITE_jwt_time_exp = '1000d';
export const Api_public = () => SetMetadata(IS_PUBLIC_KEY, true);
import { Reflector } from '@nestjs/core';
let AppAuthorized = class AppAuthorized {
    reflector;
    jwt_service;
    constructor(reflector, jwt_service) {
        this.reflector = reflector;
        this.jwt_service = jwt_service;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = request.headers?.token?.replace(/\s/g, '').replace('Bearer', '');
        const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
        if (isPublic) {
            return true;
        }
        if (!token) {
            throw new UnauthorizedException('验证失败:token空');
        }
        else {
        }
        try {
            let payload = await this.jwt_service.verifyAsync(token, { secret: process.env.VITE_jwt_secret });
            request['user'] = payload;
            request['user_id'] = payload.id;
        }
        catch (error) {
            console.log(`App_Auth---555---error:`, error);
            throw new UnauthorizedException('验证失败:token无效');
        }
        return true;
    }
};
AppAuthorized = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Reflector,
        JwtService])
], AppAuthorized);
export { AppAuthorized };
let App_Auth_Module = class App_Auth_Module {
};
App_Auth_Module = __decorate([
    Module({
        imports: [
            JwtModule.register({ global: true, secret: process.env.VITE_jwt_secret, signOptions: { expiresIn: process.env.VITE_jwt_time_exp } }),
        ],
        controllers: [],
        providers: [
            {
                provide: APP_GUARD,
                useClass: AppAuthorized,
            },
        ],
    })
], App_Auth_Module);
export { App_Auth_Module };
//# sourceMappingURL=App_Auth.js.map