<template>
  <el-dialog v-model="show" :title="title || '未设置标题'" width="900" height="900" top="20px" draggable
    :close-on-click-modal="false">
    <div style="height: 500px; overflow: auto; padding-right: 20px">
      <el-form label-width="120px">
        <el-form-item label="父级id" prop="name">
          <el-input v-model="form.parent_id" />
        </el-form-item>

        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form.depart_name" />
        </el-form-item>

        <el-form-item v-for="(item, i) in form.role_list" :key="i" :label="`${i + 1}角色名称`">
          <el-input v-model="item.name" />
          <el-tree show-checkbox :data="tree_menu" :class="item.id" style="width: 100%; height: 200px; overflow: auto"
            :default-checked-keys="item.button_ids" :props="{ label: 'name' }" node-key="id" highlight-current
            default-expand-all>
            <template #default="{ node, data }">
              <div v-if="data.type === 'button'" class="ok_button">{{ data.name }}</div>
              <div v-else class="no_button font-bold text-base">{{ data.name }}</div>
            </template>
          </el-tree>
        </el-form-item>
      </el-form>

      <el-button type="primary" @click="add_role">新增角色</el-button>
    </div>

    <template #footer>
      <el-button type="primary" @click="submit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="tsx">
import { ref } from "vue"
import { BUS } from "@/BUS"
import { ElMessage } from "element-plus"
import { util_uuid9 } from "@/plugins/util_uuid9"
import { api_v1 } from "@/api_v1"


let show = ref(false) //显示隐藏
let tree_menu = ref([]) //树状菜单

let title = ref("") //标题
let form = $ref({ parent_id: "", depart_name: "", role_list: [{ name: "", id: "", button_ids: [""] }] })
let callback = $ref(async () => { }) //回调函数


// 新增角色
async function add_role() {
  form.role_list.push({ name: `职员${new Date().getTime()}`, id: `temp_role_${util_uuid9()}`, button_ids: [] })
}

// 打开窗口
async function open({ parent_id }: { parent_id: string }) {
  show.value = true
  let res: any = await api_v1.menu.find_tree_menu()
  tree_menu.value = res.result.tree_menu
  form.parent_id = parent_id
  form.depart_name = "新的部门"
  form.role_list = [{ name: `职员${new Date().getTime()}`, id: `temp_role_${util_uuid9()}`, button_ids: [] }]
}




// 提交保存
async function submit() {
  for (let item of form.role_list) {
    //@ts-ignore
    let ctx = document.querySelector(`.${item.id}`).__vueParentComponent.ctx
    item.button_ids = ctx.getCheckedKeys()
    const nodes = ctx.getCheckedNodes() //获取选中节点
    item.button_ids = nodes.map(o => o.id.includes(':') ? o.id : undefined).filter(o => o !== undefined)
  }
  console.log("form---", JSON.parse(JSON.stringify(form)))

  let data = { parent_id: form.parent_id, depart_name: form.depart_name, role_list: form.role_list.map((o: any) => ({ ...o, id: o.id.includes('temp_role_') ? "" : o.id })) }
  if (form.depart_name.length < 1) return ElMessage.error("部门名称-必须要有")
  for (let item of form.role_list) {
    if (item.name.length < 1) return ElMessage.error("角色名称-必须要有")
    if (item.button_ids.length < 1) return ElMessage.error("菜单按钮-必须要有")
  }
  console.log("data---", JSON.parse(JSON.stringify(data)))
  let res: any = await api_v1.depart.create_depart_role_menu(data)
  if (res.code != 200) return ElMessage.error(res.msg) //前置判断
  ElMessage.success(res.msg)
  show.value = false
  // BUS.func.find_tree_depart()
}

// 暴露方法给父组件调用
defineExpose({ show, title, open, submit, callback })
</script>

<style>
.el-tree-node__children:has(.ok_button) {
  display: flex !important;
}

.el-tree-node__children:has(.no_button) {
  display: block !important;
}
</style>
