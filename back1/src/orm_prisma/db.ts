import { Module, Global, DynamicModule } from '@nestjs/common'
import { PrismaClient, Prisma } from '@prisma/client'
import _ from 'lodash'

// 虚拟字段扩展
const virtual_field_extension = Prisma.defineExtension({
  result: {
    // 部门表的虚拟字段
    sys_depart: {
      full_depart_name: {
        needs: { name: true, parent_id: true, id: true },
        compute(o) {
          if (o.parent_id && o.id != 'role_1001') {
            return `${(o as any).parent?.name || '未知父级'}/${o.name}` // 这里需要查询时包含 parent 关系
          } else if (o.id == 'role_1001') {
            return ''
          } else {
            return o.name
          }
        },
      },
    },

    // 用户表的虚拟字段
    sys_user: {
      full_depart_name: {
        needs: { name: true },
        compute(o) {
          let result = (o as any).sys_depart?.map((depart: any) => depart.full_depart_name) || []
          result = _.filter(result, (o) => o != '')
          return result
        },
      },
    },
  },
})

export const prisma_instance = new PrismaClient().$extends(virtual_field_extension)
export const db = new PrismaClient().$extends(virtual_field_extension)

interface Opt {
  path: string
}

@Global()
@Module({
  imports: [],
  providers: [{ provide: 'App_prisma_Module', useValue: { App_prisma_Module: prisma_instance } }],
  exports: [{ provide: 'App_prisma_Module', useValue: { baseUrl: '/v1' } }],
})
export class App_prisma_Module {
  static make_path(opt: Opt): DynamicModule {
    // console.log('my_prisma---opt:', opt)
    const result = {
      module: App_prisma_Module,
      providers: [{ provide: 'App_Prisma', useValue: prisma_instance }],
    }
    return result
  }
}
