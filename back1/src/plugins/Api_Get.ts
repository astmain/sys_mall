import { /*文档*/ ApiTags, ApiOperation, ApiOkResponse, ApiProperty, ApiHideProperty } from '@nestjs/swagger'
import { /*接口*/ Controller, Body, Post, Get, UseInterceptors, ClassSerializerInterceptor, applyDecorators } from '@nestjs/common'

// 创建装饰器工厂，返回一个装饰器函数
export function Api_Get(label: string, description?: string, Res_type?: any) {
  return function (target: object, propertyKey: string, descriptor: PropertyDescriptor) {
    // 使用 applyDecorators 组合多个装饰器
    const decorators = applyDecorators(
      ApiOkResponse({ description: '操作成功', type: Res_type }),
      Get(propertyKey), // 使用方法名作为路由路径
      ApiOperation({
        summary: label,
        description: `<h3 style="color: rgb(73, 204, 144) ;">[${label}]</h3>${description || ''}`,
      }),
    )

    // 应用装饰器到目标方法
    return decorators(target, propertyKey, descriptor)
  }
}

// 示例代码Api_Get.ts
let list = [{ aaa: 111, bbb: 111 }]
for (let i = 0; i < list.length; i++) {
  let item = list[i]
  console.log(item.aaa)
}
