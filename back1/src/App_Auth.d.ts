import { JwtService } from '@nestjs/jwt';
export declare const IS_PUBLIC_KEY = "Api_public";
export declare const Api_public: () => import("@nestjs/common").CustomDecorator<string>;
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
export declare class AppAuthorized implements CanActivate {
    private reflector;
    private jwt_service;
    constructor(reflector: Reflector, jwt_service: JwtService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export declare class App_Auth_Module {
}
