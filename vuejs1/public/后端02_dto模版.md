# markdown

# 对象嵌套的 dto 模版

```ts
import { Transform } from "class-transformer"

import { ApiProperty, OmitType, PickType } from "@nestjs/swagger"
import { Matches, IsNumber, IsString, IsNotEmpty, ArrayMinSize, IsOptional, IsBoolean, IsArray, ValidateIf, ValidateNested, IsIn, isNumber, IsPositive, Min } from "class-validator"
import { Type } from "class-transformer"
import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator"

import { i_format, IsFormatsArray } from "./IsFormatsArray"

export class info_file {
  @ApiProperty({ description: "url", example: "https://www.baidu.com/img/flexible/logo/pc/result.png" })
  @IsString()
  @Matches(/^https?:\/\//, { message: "url-必须以http或https开头" })
  url: string

  @ApiProperty({ description: "文件名称", example: "result.png" })
  @IsString()
  file_name: string
}

export class arg_product_model {
  @ApiProperty({ description: "免费价格", example: 0 })
  @IsNumber()
  @IsIn([0], { message: "price_free必须是0" })
  price_free: number

  @ApiProperty({ description: "个人价格", example: 100 })
  @IsNumber()
  @Type(() => Number) // 转换为数字
  @Min(0, { message: "price_personal-必须大于等于 0" })
  price_personal: number

  @ApiProperty({ description: "(列表-主图轮播图)", type: [info_file] })
  @ArrayMinSize(1, { message: "列表-主图轮播图-至少需要一个元素" })
  @ValidateNested({ each: true })
  @Type(() => info_file)
  @IsArray()
  list_main_img: info_file[]

  @ApiProperty({ description: "文件名称", example: "format1" })
  @IsFormatsArray({ message: "格式,必须是-" + i_format.join(",") }, i_format)
  @IsString()
  type_format: string

  @ApiProperty({ description: "(字典)面片数", example: "area1" })
  @IsIn(["area1", "area2", "area3", "area4", "area5"], { message: "面片数-必须是['area1', 'area2', 'area3', 'area4', 'area5']" })
  type_area: string

  @ApiProperty({ description: "插件备注", example: "" })
  @IsString()
  is_plugin_remark: string
}

export class save_product {
  @ApiProperty({ description: "商品id", example: "cuid_string" })
  @IsString({ message: "商品id-必须是字符串" })
  product_id: string

  @ApiProperty({ description: "用户id", example: "cuid_string" })
  @IsString({ message: "用户id-必须是字符串" })
  @IsNotEmpty({ message: "用户id-必须不能为空" })
  user_id: string

  @ApiProperty({ description: "(参数-商品模型)" })
  @ValidateNested()
  @Type(() => arg_product_model)
  arg_product_model: arg_product_model
}
```

# 删除 ids 字符

```ts
export class remove_product_ids {
  @ApiProperty({ description: "商品ids", example: ["111", "222"] })
  // @Transform(({ value }) => (Array.isArray(value) ? [...new Set(value)].map(String) : value))
  @IsArray({ message: "商品ids-必须是数组" })
  @IsString({ each: true, message: "商品ids-必须每个元素是字符串" })
  @IsNotEmpty({ message: "商品ids-必须不能为空" })
  ids: string[]
}
```
