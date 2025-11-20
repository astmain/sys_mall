import { Module, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { APP_GUARD } from '@nestjs/core'
import { SetMetadata } from '@nestjs/common'

export const IS_PUBLIC_KEY = 'Api_public'

process.env.VITE_jwt_secret = 'xzz2021'
process.env.VITE_jwt_time_exp = '1000d'

/**
 * @description 跳过全局身份验证
 * @param 无
 * @returns 无
 * @视频教程      https://www.bilibili.com/video/BV1JViRYJEGH?p=33
 * @官方文档      https://docs.nestjs.cn/9/security?id=认证（authentication）
 */
export const Api_public = () => SetMetadata(IS_PUBLIC_KEY, true)

import { CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class AppAuthorized implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwt_service: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 得到网络求对象request
    const request = context.switchToHttp().getRequest()
    const token = request.headers?.token?.replace(/\s/g, '').replace('Bearer', '')
    // console.log(`111---token:`, token)

    // console.log(`111---context:`, context)
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()])
    // 开发即可注解
    if (isPublic) {
      // console.log(`111---isPublic:`, isPublic)
      return true
    }

    // console.log(`App_Auth---request:`, request)
    // console.log(`App_Auth---111---token:`, token)
    // 判断token是否存在
    if (!token) {
      // console.log(`验证失败:App_Auth---222---token---空:`, token)
      throw new UnauthorizedException('验证失败:token空')
    } else {
      // console.log(`App_Auth---333---token---存在:`, token)
    }

    // 解析token得到user信息
    try {
      // console.log(`111---process.env.VITE_jwt_secret:`, process.env.VITE_jwt_secret)
      let payload = await this.jwt_service.verifyAsync(token, { secret: process.env.VITE_jwt_secret })
      // console.log(`App_Auth---444---payload:`, payload)
      // 请求全局参数   @Req() request   调用   request["user"]
      request['user'] = payload
      request['user_id'] = payload.id
    } catch (error) {
      console.log(`App_Auth---555---error:`, error)
      throw new UnauthorizedException('验证失败:token无效')
    }

    //放行
    return true
  }
}

/**
 * 全局身份验证模块
 * 功能1:全局校验jwt的身份token
 * 功能2:Controller接口通过 @Req.user得到用户的详细数据 , @Req.user_id得到用户id
 */
@Module({
  imports: [
    // @ts-ignore
    JwtModule.register({ global: true, secret: process.env.VITE_jwt_secret, signOptions: { expiresIn: process.env.VITE_jwt_time_exp } }), //jwt//私钥//24小时*30天
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AppAuthorized,
    },
  ],
})
export class App_Auth_Module {}
