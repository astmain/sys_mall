import { Module, Body } from '@nestjs/common'
import { Api_group } from '@src/plugins/Api_group'
import { Api_public } from '@src/App_Auth'
import { Api_Post } from '@src/plugins/Api_Post'
// ================================== 数据库 ==================================
import { db } from '@src/orm_prisma/db'
// ================================== dto ==================================
import { login } from './dto/login'

// ================================== 服务工具 ==================================
import { util_uuid9 } from '@src/plugins/util_uuid9'
import { JwtService } from '@nestjs/jwt'

@Api_group('v1', '认证')
export class auth {
  @Api_public()
  @Api_Post('登陆')
  async login(@Body() body: login) {
    let one = await db.sys_user.findFirst({ where: { phone: body.phone, password: body.password } })
    if (!one) return { code: 400, msg: '失败:用户不存在', result: { token: '123456' } }
    const payload = { id: one?.id, user: one.phone }
    const my_jwt_service = new JwtService()
    const token = my_jwt_service.sign(payload, { secret: process.env.VITE_jwt_secret })
    return { code: 200, msg: '登录成功', result: { token: token, id: one.id, user: one.phone } }
  }

  @Api_public()
  @Api_Post('初始化数据-菜单-部门-用户')
  async init_data_sys_menu_depart_user() {
    try {
      // 清空现有数据
      await db.sys_menu.deleteMany()
      await db.sys_depart.deleteMany()
      await db.sys_user.deleteMany()

      // ================================== 部门表 ==================================
      await db.sys_depart.createMany({
        data: [
          // 总公司
          { id: 'depart_0', name: '总公司', type: 'company', remark: '' },
          // 部门
          { id: 'depart_1', name: '客户部', type: 'depart', parent_id: 'depart_0', remark: '' },
          { id: 'depart_2', name: '技术部', type: 'depart', parent_id: 'depart_0', remark: '' },
          { id: 'depart_3', name: '财务部', type: 'depart', parent_id: 'depart_0', remark: '' },
          //角色-客户
          { id: 'role_1001', name: '客户普通', type: 'role', parent_id: 'depart_1', remark: '' },
          { id: 'role_1002', name: '客户高级', type: 'role', parent_id: 'depart_1', remark: '' },
          // 角色-技术部
          { id: 'role_2001', name: '技术职员', type: 'role', parent_id: 'depart_2', remark: '' },
          { id: 'role_2002', name: '技术主管', type: 'role', parent_id: 'depart_2', remark: '' },
          // 角色-财务部
          { id: 'role_3001', name: '财务职员', type: 'role', parent_id: 'depart_3', remark: '' },
          { id: 'role_3002', name: '财务主管', type: 'role', parent_id: 'depart_3', remark: '' },
        ],
      })

      // ================================== 菜单表 ==================================
      await db.sys_menu.createMany({
        data: [
          // 一级菜单
          { id: 'menu_1', name: '首页', path: '/home' },
          { id: 'menu_2', name: '商城管理', path: '/shop' },
          { id: 'menu_3', name: '用户管理', path: '/system/user' },
          { id: 'menu_4', name: '菜单管理', path: '/system/menu' },
          { id: 'menu_5', name: '字典管理', path: '/dict' },
          // 商城管理-子菜单
          { id: 'sub_2001', name: '订单管理', path: '/shop/order', parent_id: 'menu_2' },
          { id: 'sub_2002', name: '商品管理', path: '/shop/product', parent_id: 'menu_2' },
          { id: 'sub_2003', name: '财务管理', path: '/shop/finance', parent_id: 'menu_2' },
        ],
      })

      // 按钮权限(首页)
      let 首页_查看 = { parent_id: 'menu_1', path: '/home:查看', id: '/home:查看', remark: '首页_查看', name: '查看', type: 'button' }
      let 首页_删除 = { parent_id: 'menu_1', path: '/home:删除', id: '/home:删除', remark: '首页_删除', name: '删除', type: 'button' }
      let 首页_新增 = { parent_id: 'menu_1', path: '/home:新增', id: '/home:新增', remark: '首页_新增', name: '新增', type: 'button' }
      let 首页_修改 = { parent_id: 'menu_1', path: '/home:修改', id: '/home:修改', remark: '首页_修改', name: '修改', type: 'button' }
      await db.sys_menu.createMany({ data: [首页_查看, 首页_删除, 首页_新增, 首页_修改] })

      // 按钮权限(用户管理)
      let 用户管理_查看 = { parent_id: 'menu_3', path: '/system/user:查看', id: '/system/user:查看', remark: '用户管理_查看', name: '查看', type: 'button' }
      let 用户管理_删除 = { parent_id: 'menu_3', path: '/system/user:删除', id: '/system/user:删除', remark: '用户管理_删除', name: '删除', type: 'button' }
      let 用户管理_新增 = { parent_id: 'menu_3', path: '/system/user:新增', id: '/system/user:新增', remark: '用户管理_新增', name: '新增', type: 'button' }
      let 用户管理_修改 = { parent_id: 'menu_3', path: '/system/user:修改', id: '/system/user:修改', remark: '用户管理_修改', name: '修改', type: 'button' }
      await db.sys_menu.createMany({ data: [用户管理_查看, 用户管理_删除, 用户管理_新增, 用户管理_修改] })

      // 按钮权限(字典)
      let 字典_查看 = { parent_id: 'menu_5', path: '/dict:查看', id: '/dict:查看', remark: '字典_查看', name: '查看', type: 'button' }
      let 字典_删除 = { parent_id: 'menu_5', path: '/dict:删除', id: '/dict:删除', remark: '字典_删除', name: '删除', type: 'button' }
      let 字典_新增 = { parent_id: 'menu_5', path: '/dict:新增', id: '/dict:新增', remark: '字典_新增', name: '新增', type: 'button' }
      let 字典_修改 = { parent_id: 'menu_5', path: '/dict:修改', id: '/dict:修改', remark: '字典_修改', name: '修改', type: 'button' }
      await db.sys_menu.createMany({ data: [字典_查看, 字典_删除, 字典_新增, 字典_修改] })

      // 按钮权限(订单管理)
      let 订单管理_查看 = { parent_id: 'sub_2001', path: '/order:查看', id: '/order:查看', remark: '订单管理_查看', name: '查看', type: 'button' }
      let 订单管理_删除 = { parent_id: 'sub_2001', path: '/order:删除', id: '/order:删除', remark: '订单管理_删除', name: '删除', type: 'button' }
      let 订单管理_新增 = { parent_id: 'sub_2001', path: '/order:新增', id: '/order:新增', remark: '订单管理_新增', name: '新增', type: 'button' }
      let 订单管理_修改 = { parent_id: 'sub_2001', path: '/order:修改', id: '/order:修改', remark: '订单管理_修改', name: '修改', type: 'button' }
      let 订单管理_修改价格 = { parent_id: 'sub_2001', path: '/order:修改价格', id: '/order:修改价格', remark: '订单管理_修改价格', name: '修改价格', type: 'button' }
      await db.sys_menu.createMany({ data: [订单管理_查看, 订单管理_删除, 订单管理_新增, 订单管理_修改, 订单管理_修改价格] })

      // 按钮权限(商品管理)
      let 商品管理_查看 = { parent_id: 'sub_2002', path: '/product:查看', id: '/product:查看', remark: '商品管理_查看', name: '查看', type: 'button' }
      let 商品管理_删除 = { parent_id: 'sub_2002', path: '/product:删除', id: '/product:删除', remark: '商品管理_删除', name: '删除', type: 'button' }
      let 商品管理_新增 = { parent_id: 'sub_2002', path: '/product:新增', id: '/product:新增', remark: '商品管理_新增', name: '新增', type: 'button' }
      let 商品管理_修改 = { parent_id: 'sub_2002', path: '/product:修改', id: '/product:修改', remark: '商品管理_修改', name: '修改', type: 'button' }
      await db.sys_menu.createMany({ data: [商品管理_查看, 商品管理_删除, 商品管理_新增, 商品管理_修改] })

      // 按钮权限(财务管理)
      let 财务管理_查看 = { parent_id: 'sub_2003', path: '/finance:查看', id: '/finance:查看', remark: '财务管理_查看', name: '查看', type: 'button' }
      let 财务管理_删除 = { parent_id: 'sub_2003', path: '/finance:删除', id: '/finance:删除', remark: '财务管理_删除', name: '删除', type: 'button' }
      let 财务管理_新增 = { parent_id: 'sub_2003', path: '/finance:新增', id: '/finance:新增', remark: '财务管理_新增', name: '新增', type: 'button' }
      let 财务管理_修改 = { parent_id: 'sub_2003', path: '/finance:修改', id: '/finance:修改', remark: '财务管理_修改', name: '修改', type: 'button' }
      await db.sys_menu.createMany({ data: [财务管理_查看, 财务管理_删除, 财务管理_新增, 财务管理_修改] })

      // ================================== 部门-菜单 ==================================
      //设置 role_2001 关联多个 订单管理_查看 订单管理_删除 订单管理_新增
      // await db.sys_depart.update({ where: { id: '订单管理_查看' }, data: { sys_menu: { connect: { id: 'role_2001' } } } })

      // 客户部
      await db.sys_depart.update({ where: { id: 'role_1001' }, data: { sys_menu: { connect: [首页_查看].map((o) => ({ id: o.id })) } } })
      await db.sys_depart.update({ where: { id: 'role_2001' }, data: { sys_menu: { connect: [首页_查看, 首页_删除, 首页_新增, 首页_修改].map((o) => ({ id: o.id })) } } })

      // 财务部
      await db.sys_depart.update({ where: { id: 'role_3001' }, data: { sys_menu: { connect: [财务管理_查看].map((o) => ({ id: o.id })) } } })
      await db.sys_depart.update({ where: { id: 'role_3002' }, data: { sys_menu: { connect: [财务管理_查看, 财务管理_删除, 财务管理_新增, 财务管理_修改, 商品管理_查看].map((o) => ({ id: o.id })) } } })

      // 技术部
      let 技术部_菜单1 = [
        首页_查看, //首页
        首页_删除,
        首页_新增,
        首页_修改,
        用户管理_查看, //用户管理
        用户管理_删除,
        用户管理_新增,
        用户管理_修改,
      ].map((o) => ({ id: o.id }))

      // 技术部
      let 技术部_菜单2 = [
        首页_查看, //首页
        首页_删除,
        首页_新增,
        首页_修改,
        字典_查看, //字典
        字典_删除,
        字典_新增,
        字典_修改,
        用户管理_查看, //用户管理
        用户管理_删除,
        用户管理_新增,
        用户管理_修改,
        订单管理_查看, //订单管理
        订单管理_删除,
        订单管理_新增,
        订单管理_修改,
        订单管理_修改价格,
        商品管理_查看, //商品管理
        商品管理_删除,
        商品管理_新增,
        商品管理_修改,
        财务管理_查看, //财务管理
        财务管理_删除,
        财务管理_新增,
        财务管理_修改,
      ].map((o) => ({ id: o.id }))

      await db.sys_depart.update({ where: { id: 'role_2001' }, data: { sys_menu: { connect: 技术部_菜单1 } } })
      await db.sys_depart.update({ where: { id: 'role_2002' }, data: { sys_menu: { connect: 技术部_菜单2 } } })

      // ================================== 用户表 ==================================
      //                //客户高级    // 技术主管   // 财务职员   // 财务主管
      let 全部权限 = ['role_1002', 'role_2002', 'role_3001', 'role_3002'].map((id) => ({ id }))
      /*许鹏-最高权限*/
      await db.sys_user.create({ data: { id: 'user_1', name: '许鹏', phone: '15160315110', password: '123456', sys_depart: { connect: 全部权限 } } })
      /*二狗-客户普通-技术主管*/
      await db.sys_user.create({ data: { id: 'user_2', name: '二狗', phone: '15160315002', password: '123456', sys_depart: { connect: ['role_1001'].map((id) => ({ id })) } } })
      /*张三-客户普通-财务职员*/
      await db.sys_user.create({ data: { id: 'user_3', name: '张三', phone: '15160315003', password: '123456', sys_depart: { connect: ['role_1001', 'role_3001'].map((id) => ({ id })) } } })
      /*李四-客户普通-财务主管*/
      await db.sys_user.create({ data: { id: 'user_4', name: '李四', phone: '15160315004', password: '123456', sys_depart: { connect: ['role_1001', 'role_3002'].map((id) => ({ id })) } } })
      /*王五-客户普通-财务主管*/
      await db.sys_user.create({ data: { id: 'user_5', name: '王五', phone: '15160315005', password: '123456', sys_depart: { connect: ['role_1001', 'role_3002'].map((id) => ({ id })) } } })

      return { code: 200, msg: '成功:数据库初始化完成', result: {} }
    } catch (error) {
      return { code: 400, msg: '失败:初始化', result: { error } }
    } finally {
      await db.$disconnect()
    }
  }
}

@Module({
  controllers: [auth],
  providers: [],
})
export class auth_module {}
