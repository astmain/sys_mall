import { Module, Global, DynamicModule } from '@nestjs/common'
import { PrismaClient, Prisma } from '@prisma/client'
import { PrismaPg as adapter_prisma_pg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import _ from 'lodash'

const pool = new Pool({ connectionString: 'postgresql://root:123456@103.119.2.223:2006/back?schema=public' })
const adapter = new adapter_prisma_pg(pool)

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

// Prisma 7+ 需要使用 adapter 创建 PrismaClient
export const prisma_instance = new PrismaClient({ adapter }).$extends(virtual_field_extension)
export const db = prisma_instance

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
