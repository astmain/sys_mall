import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common'
import { NestApplication } from '@nestjs/core'

// 拦截过滤器-dto验证
export async function filter_dto(app) {
  let config_dto = new ValidationPipe({
    whitelist: true, // 自动去掉 DTO 里没有声明的字段
    forbidNonWhitelisted: true, // 有未知字段会抛错
    transform: true, // 启用自动类型转换
    transformOptions: {
      // 保留默认值，不覆盖已存在的属性
      // strategy: 'excludeAll', // 只转换明确传递的属性
      // strategy: 'excludeAll', // 只转换明确传递的属性
      // enableImplicitConversion: false, // 禁用隐式转换
    },

    // exceptionFactory: (errors) => {
    //   let aaa = errors
    //   let errors_info = errors.flatMap((error) => {
    //     let values = Object.values(error.constraints || {})
    //     let result: any = []
    //     values.map((msg) => {
    //       // console.log(`222---msg:`, msg)
    //       // console.log(`222---error:`, error)
    //       result.push({ field: error.property, value: error.value, msg })
    //     })
    //     return result
    //   })

    //   // console.log(`333---err_arr:`, errors_info)
    //   let message = errors_info.map((o) => o.msg).join(';')
    //   // const response = { code: 422, message: `失败:参数错误>${message}`, errors_info }
    //   const response = { code: 422, msg: `失败111:dto参数错误>${message}`, errors_info }
    //   return new BadRequestException(response)
    // },
  })

  app.useGlobalPipes(config_dto)
}
