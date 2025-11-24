import { ApiProperty, PickType, OmitType, IntersectionType, PartialType } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsIn } from 'class-validator'
import { Prisma } from '@prisma/client'
import { sys_user } from '@src/orm_prisma/table/sys_user'
import { Matches } from 'class-validator'
import { ArrayMinSize } from 'class-validator'
import { ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { IsArray } from 'class-validator'
import { IsNumber } from 'class-validator'
import { Min } from 'class-validator'
import { MinLength } from 'class-validator'

export class arg_data {
  @ApiProperty({ description: '免费价格', example: 0 })
  @IsNumber()
  @IsIn([0], { message: 'price_free必须是0' })
  price_free: number

  @ApiProperty({ description: '个人价格', example: 100 })
  @IsNumber()
  @Type(() => Number) // 转换为数字
  @Min(0, { message: 'price_personal-必须大于等于 0' })
  price_personal: number

  @ApiProperty({ description: '(字典)面片数', example: 'area1' })
  @IsIn(['area1', 'area2', 'area3', 'area4', 'area5'], { message: "面片数-必须是['area1', 'area2', 'area3', 'area4', 'area5']" })
  type_area: string

  @ApiProperty({ description: '插件备注', example: '' })
  @IsString()
  is_plugin_remark: string
}

export class login_phone {
  @ApiProperty({ description: '验证码', example: '123456' })
  @IsIn(['个人', '企业', '国企', '私企'], { message: "分类:必须是-['个人', '企业','国企','私企']" })
  code: string

  @ApiProperty({ description: '(参数-商品模型)' })
  @ValidateNested()
  @Type(() => arg_data)
  arg_product_model: arg_data


  @ApiProperty({ description: '手机号', example: '13800138000' })
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { message: 'list_phone-至少需要一个元素' })
  list_phone: string[]
}
