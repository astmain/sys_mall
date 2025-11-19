import { applyDecorators, Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { knife4jSetup } from 'nest-knife4j'
import type { INestApplication } from '@nestjs/common'
import 'reflect-metadata'

const list_version = ['common', 'v1', 'v2', 'test']

// 装饰器：结合 Controller + ApiTags
// export function Api_group(branch: '' | 'v1' | 'v2', tagName: string) {
export function Api_group(version: 'common' | 'v1' | 'v2' | 'test', name: string) {
  return function <T extends { new (...args: any[]): {} }>(target: T) {
    // 生成控制器路径：branch/className (如: v1/user 或 user)

    const controller_path = version === 'common' ? target.name : `${version}/${target.name}`
    const v_name = `${version}${name}`

    // 使用applyDecorators组合多个装饰器
    const decorators = applyDecorators(
      Controller(controller_path), // 设置控制器路径
      ApiTags(v_name), // 设置Swagger API标签
    )

    // 应用装饰器到目标类
    return decorators(target)
  }
}
