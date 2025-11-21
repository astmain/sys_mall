<template>
  <nav class="flex gap-4">
    <nav class="uno_card1 w-250px">
      <el-tree class="user_tree_left" ref="ref_tree_depart" style="width: 250px; height: auto; overflow: auto"
        :data="tree_depart.data" :props="{ label: 'name' }" node-key="id" :current-node-key="tree_depart.currentNodeKey"
        :expand-on-click-node="false" highlight-current default-expand-all @node-click="tree_left_click"
        @node-contextmenu="tree_ritht_click">
      </el-tree>
    </nav>


    <nav class="uno_card1 flex-1">
      <el-table :data="list_user" style="width: 100%; height: 100%" show-overflow-tooltip stripe
        :header-cell-style="{ background: '#f4f4f5', color: '#606266' }">
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="phone" label="手机号" width="200" />
        <el-table-column prop="gender" label="性别" width="100" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="primary" link @click="user_drawer_ref.open(scope.row.user_id)">修改</el-button>
            <el-button link @click="remove_ids_user([scope.row.user_id])">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </nav>
  </nav>
  <user_drawer ref="user_drawer_ref" />
  <Menu1 ref="Menu1Ref" :menu_list="menu_curr_list" />
  <com_dialog_depart_create ref="ref_com_dialog_depart_create" />
  <com_dialog_depart_update ref="ref_com_dialog_depart_update" />



</template>

<script setup lang="tsx">
import { onMounted, ref } from "vue"
import { ElMessage } from "element-plus"
import { api_v1 } from "@/api_v1"
import { BUS } from "@/BUS"
import user_drawer from "./user_drawer.vue"
import { plugin_confirm } from "@/plugins/plugin_confirm"
import com_dialog_depart_create from "./com_dialog_depart_create.vue"
import com_dialog_depart_update from "./com_dialog_depart_update.vue"
import Menu1 from "./Menu1.vue"
const ref_tree_depart = ref()
const Menu1Ref = ref()
const curr_depart_node = ref()
const list_user = ref([] as any[])
const tree_depart = ref({
  data: [] as any[],
  currentNodeKey: undefined,
})

const user_drawer_ref = ref()
const ref_com_dialog_depart_create = ref()
const ref_com_dialog_depart_update = ref()


// 右键菜单当前列表
const menu_curr_list = ref([] as any[])
// 右键菜单部门角色列表
const menu_depart_role_list = ref([
  {
    label: "新增部门",
    click: async (item: any) => {
      // ref_com_dialog_depart_create.value.title = item.label
      // ref_com_dialog_depart_create.value.open()
      ref_com_dialog_depart_create.value.title = item.label
      ref_com_dialog_depart_create.value.open({ parent_id: curr_depart_node.value.id })
    },
  },

  {
    label: "修改部门",
    click: async (item: any) => {
      ref_com_dialog_depart_update.value.title = item.label
      ref_com_dialog_depart_update.value.open({ tree_node_curr: curr_depart_node.value })
    },
  },
  {
    label: "删除",
    click: async (item: any) => {

    },
  },
])



async function find_depart_by_user_id() {
  const res: any = await api_v1.auth.find_depart_by_user_id()
  console.log(`111---res:`, res)
  tree_depart.value.data = res.result.depart_tree
}


async function remove_ids_user(ids: string[]) {
  const res: any = await api_v1.user.remove_ids_user({ ids: ids })
  if (res.code === 200) {
    ElMessage.success(res.msg)
    await find_depart_by_user_id()
    await tree_left_click()
  } else {
    ElMessage.error(res.msg)
  }


}



// ✅用户管理树点击事件查询用户列表
async function tree_left_click() {
  Menu1Ref.value.hide_menu()
  curr_depart_node.value = ref_tree_depart.value.getCurrentNode()
  console.log(`111---curr_depart_node.value:`, curr_depart_node.value)
  const res: any = await api_v1.auth.find_list_user({ depart_id: curr_depart_node.value.id })
  console.log(`111---res:`, res)
  list_user.value = res.result.list_user

}
BUS.func.tree_left_click = tree_left_click //全局BUS函数

// ✅右键点击事件
function tree_ritht_click(event: Event, item: any, node: any, nodeInstance: any) {
  event.preventDefault()
  Menu1Ref.value.show_menu(event)
  curr_depart_node.value = item
  if (item.type === "company") {
    menu_curr_list.value = menu_depart_role_list.value.filter((item: any) => item.label == "新增部门")
  } else if (item.type === "depart") {
    menu_curr_list.value = menu_depart_role_list.value.filter((item: any) => item.label == "删除" || item.label == "修改部门")
  } else if (item.type === "role") {
    menu_curr_list.value = menu_depart_role_list.value.filter((item: any) => item.label == "删除")
  } else {
    ElMessage.error("没有找到类型")
    console.log("没有找到类型", item)
  }
}



onMounted(async () => {
  await find_depart_by_user_id()
})
</script>
