import { Module, Body } from '@nestjs/common'
import { Api_group } from '@src/plugins/Api_group'
import { Api_public } from '@src/App_Auth'
import { Api_Post } from '@src/plugins/Api_Post'
// ================================== 数据库 ==================================
import { db_typeorm } from '@src/dist_tool_v1_api/db1'
import { sys_user } from '@src/dist_tool_v1_api/entity/sys_user'
import { sys_menu } from '@src/dist_tool_v1_api/entity/sys_menu'
import { sys_depart } from '@src/dist_tool_v1_api/entity/sys_depart'
// ================================== dto ==================================
import { login } from '@src/dist_tool_v1_api/entity/sys_user'

// ================================== 服务工具 ==================================
import { util_uuid9 } from '@src/plugins/util_uuid9'
import { JwtService } from '@nestjs/jwt'

@Api_group('v1', '认证')
export class auth {
  @Api_public()
  @Api_Post('登陆')
  async login(@Body() body: login) {
    console.log('auth---login', body)
    const one = await db_typeorm.findOneBy(sys_user, { phone: body.phone, password: body.password })
    if (!one) return { code: 400, msg: '失败:用户不存在', result: { token: '123456' } }
    const payload = { id: one?.user_id, user: one.phone }
    const my_jwt_service = new JwtService()
    const token = my_jwt_service.sign(payload, { secret: process.env.VITE_jwt_secret })
    return { code: 200, msg: '成功', result: { token } }
  }

  @Api_public()
  @Api_Post('初始化数据-菜单-部门-用户')
  async init_data_sys_menu_depart_user() {
    // 先删除中间表（多对多关系表）
    await db_typeorm.query('DELETE FROM ref_depart_menu')
    await db_typeorm.query('DELETE FROM ref_user_depart')
    // 再删除主表（按外键依赖顺序）
    await db_typeorm.query('DELETE FROM sys_menu')
    await db_typeorm.query('DELETE FROM sys_depart')
    await db_typeorm.query('DELETE FROM sys_user')
    // 插入新数据
    await db_typeorm.save(sys_user, [new sys_user({ user_id: '1', name: '许鹏', phone: '15160315110', password: '123456' }), new sys_user({ user_id: '2', name: '二狗', phone: '15160315112', password: '123456' })])
    await db_typeorm.save(sys_menu, [
      // 一级菜单
      { id: 'menu_1', name: '首页', path: '/home' },
      { id: 'menu_2', name: '商城管理1', path: '/shop' },
      { id: 'menu_3', name: '用户管理', path: '/user' },
      { id: 'menu_4', name: '菜单管理', path: '/menu' },
      { id: 'menu_5', name: '字典管理', path: '/dict' },
      // 商城管理-子菜单
      { id: 'sub_2001', name: '订单管理', path: '/shop/order', parent_id: 'menu_2' },
      { id: 'sub_2002', name: '商品管理', path: '/shop/product', parent_id: 'menu_2' },
      { id: 'sub_2003', name: '财务管理', path: '/shop/finance', parent_id: 'menu_2' },
    ])

    await db_typeorm.save(sys_depart, [
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
    ])

    // 按钮权限(首页)
    const 首页_查看 = { parent_id: 'menu_1', path: '/home:查看', id: '/home:查看', remark: '首页_查看', name: '查看', type: 'button' }
    const 首页_删除 = { parent_id: 'menu_1', path: '/home:删除', id: '/home:删除', remark: '首页_删除', name: '删除', type: 'button' }
    const 首页_新增 = { parent_id: 'menu_1', path: '/home:新增', id: '/home:新增', remark: '首页_新增', name: '新增', type: 'button' }
    const 首页_修改 = { parent_id: 'menu_1', path: '/home:修改', id: '/home:修改', remark: '首页_修改', name: '修改', type: 'button' }
    await db_typeorm.save(sys_menu, [首页_查看, 首页_删除, 首页_新增, 首页_修改])

    // 按钮权限(用户管理)
    const 用户管理_查看 = { parent_id: 'menu_3', path: '/system/user:查看', id: '/system/user:查看', remark: '用户管理_查看', name: '查看', type: 'button' }
    const 用户管理_删除 = { parent_id: 'menu_3', path: '/system/user:删除', id: '/system/user:删除', remark: '用户管理_删除', name: '删除', type: 'button' }
    const 用户管理_新增 = { parent_id: 'menu_3', path: '/system/user:新增', id: '/system/user:新增', remark: '用户管理_新增', name: '新增', type: 'button' }
    const 用户管理_修改 = { parent_id: 'menu_3', path: '/system/user:修改', id: '/system/user:修改', remark: '用户管理_修改', name: '修改', type: 'button' }
    await db_typeorm.save(sys_menu, [用户管理_查看, 用户管理_删除, 用户管理_新增, 用户管理_修改])

    // 按钮权限(字典)
    const 字典_查看 = { parent_id: 'menu_5', path: '/dict:查看', id: '/dict:查看', remark: '字典_查看', name: '查看', type: 'button' }
    const 字典_删除 = { parent_id: 'menu_5', path: '/dict:删除', id: '/dict:删除', remark: '字典_删除', name: '删除', type: 'button' }
    const 字典_新增 = { parent_id: 'menu_5', path: '/dict:新增', id: '/dict:新增', remark: '字典_新增', name: '新增', type: 'button' }
    const 字典_修改 = { parent_id: 'menu_5', path: '/dict:修改', id: '/dict:修改', remark: '字典_修改', name: '修改', type: 'button' }
    await db_typeorm.save(sys_menu, [字典_查看, 字典_删除, 字典_新增, 字典_修改])

    // 按钮权限(订单管理)
    const 订单管理_查看 = { parent_id: 'sub_2001', path: '/order:查看', id: '/order:查看', remark: '订单管理_查看', name: '查看', type: 'button' }
    const 订单管理_删除 = { parent_id: 'sub_2001', path: '/order:删除', id: '/order:删除', remark: '订单管理_删除', name: '删除', type: 'button' }
    const 订单管理_新增 = { parent_id: 'sub_2001', path: '/order:新增', id: '/order:新增', remark: '订单管理_新增', name: '新增', type: 'button' }
    const 订单管理_修改 = { parent_id: 'sub_2001', path: '/order:修改', id: '/order:修改', remark: '订单管理_修改', name: '修改', type: 'button' }
    const 订单管理_修改价格 = { parent_id: 'sub_2001', path: '/order:修改价格', id: '/order:修改价格', remark: '订单管理_修改价格', name: '修改价格', type: 'button' }
    await db_typeorm.save(sys_menu, [订单管理_查看, 订单管理_删除, 订单管理_新增, 订单管理_修改, 订单管理_修改价格])

    // 按钮权限(商品管理)
    const 商品管理_查看 = { parent_id: 'sub_2002', path: '/product:查看', id: '/product:查看', remark: '商品管理_查看', name: '查看', type: 'button' }
    const 商品管理_删除 = { parent_id: 'sub_2002', path: '/product:删除', id: '/product:删除', remark: '商品管理_删除', name: '删除', type: 'button' }
    const 商品管理_新增 = { parent_id: 'sub_2002', path: '/product:新增', id: '/product:新增', remark: '商品管理_新增', name: '新增', type: 'button' }
    const 商品管理_修改 = { parent_id: 'sub_2002', path: '/product:修改', id: '/product:修改', remark: '商品管理_修改', name: '修改', type: 'button' }
    await db_typeorm.save(sys_menu, [商品管理_查看, 商品管理_删除, 商品管理_新增, 商品管理_修改])

    // 按钮权限(财务管理)
    const 财务管理_查看 = { parent_id: 'sub_2003', path: '/finance:查看', id: '/finance:查看', remark: '财务管理_查看', name: '查看', type: 'button' }
    const 财务管理_删除 = { parent_id: 'sub_2003', path: '/finance:删除', id: '/finance:删除', remark: '财务管理_删除', name: '删除', type: 'button' }
    const 财务管理_新增 = { parent_id: 'sub_2003', path: '/finance:新增', id: '/finance:新增', remark: '财务管理_新增', name: '新增', type: 'button' }
    const 财务管理_修改 = { parent_id: 'sub_2003', path: '/finance:修改', id: '/finance:修改', remark: '财务管理_修改', name: '修改', type: 'button' }
    await db_typeorm.save(sys_menu, [财务管理_查看, 财务管理_删除, 财务管理_新增, 财务管理_修改])

    // ================================== 部门-用户 ==================================
    await db_typeorm.createQueryBuilder().relation(sys_depart, 'sys_user').of('role_1001').add(['1', '2'])
    await db_typeorm.createQueryBuilder().relation(sys_depart, 'sys_user').of('role_1002').add(['1'])
    await db_typeorm.createQueryBuilder().relation(sys_depart, 'sys_user').of('role_2001').add(['1'])
    await db_typeorm.createQueryBuilder().relation(sys_depart, 'sys_user').of('role_2002').add(['1'])
    await db_typeorm.createQueryBuilder().relation(sys_depart, 'sys_user').of('role_3001').add(['1'])
    await db_typeorm.createQueryBuilder().relation(sys_depart, 'sys_user').of('role_3002').add(['1'])

    // ================================== 部门-菜单 ==================================
    // 客户部
    await db_typeorm
      .createQueryBuilder()
      .relation(sys_depart, 'sys_menu')
      .of('role_1001')
      .add([首页_查看].map((item) => item.id))
    await db_typeorm
      .createQueryBuilder()
      .relation(sys_depart, 'sys_menu')
      .of('role_1002')
      .add([首页_查看, 首页_删除, 首页_新增, 首页_修改].map((item) => item.id))
    // 财务部
    await db_typeorm
      .createQueryBuilder()
      .relation(sys_depart, 'sys_menu')
      .of('role_3001')
      .add([财务管理_查看].map((item) => item.id))
    await db_typeorm
      .createQueryBuilder()
      .relation(sys_depart, 'sys_menu')
      .of('role_3002')
      .add([财务管理_查看, 财务管理_删除, 财务管理_新增, 财务管理_修改].map((item) => item.id))
    // 技术部
    await db_typeorm
      .createQueryBuilder()
      .relation(sys_depart, 'sys_menu')
      .of('role_2001')
      .add(
        [
          首页_查看, //首页
          首页_删除,
          首页_新增,
          首页_修改,
          用户管理_查看, //用户管理
          用户管理_删除,
          用户管理_新增,
          用户管理_修改,
        ].map((item) => item.id),
      )
    await db_typeorm
      .createQueryBuilder()
      .relation(sys_depart, 'sys_menu')
      .of('role_2002')
      .add(
        [
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
        ].map((item) => item.id),
      )

    return { code: 200, msg: '成功:初始化数据', result: {} }
  }
}

@Module({
  controllers: [auth],
  providers: [],
})
export class auth_module {}
