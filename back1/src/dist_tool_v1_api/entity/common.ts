import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeUpdate, AfterLoad } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'
import { Exclude, Expose } from 'class-transformer'
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiProperty, PickType } from '@nestjs/swagger'
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, IsNotEmptyObject, IsString, Min, ValidateNested, IsArray } from 'class-validator'

export class at_timestamp {
    @CreateDateColumn() // 自动记录创建时间
    at_created: Date

    @UpdateDateColumn() // 自动记录更新时间
    at_updated: Date
}



export class remove_ids_user {
    @ApiProperty({ description: 'id(用户id)', example: ['user_1', 'user_2'], isArray: true })
    @IsArray()
    @IsString({ each: true })
    ids: string[]
  }
  