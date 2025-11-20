<template>
  <ElDrawer ref="drawer" v-model="show" :title="title" size="500px" destroy-on-close>
    <el-form label-width="60px" label-position="left">
      <el-form-item label="头像">
        <img :src="user.avatar" alt="" class="w-20 h-20" />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="user.name" />
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="user.phone" />
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="user.gender" fill="#006eff">
          <el-radio-button label="男" value="男" />
          <el-radio-button label="女" value="女" />
          <el-radio-button label="未知" value="未知" />
        </el-radio-group>
      </el-form-item>

      <el-form-item label="备注">
        <el-input type="textarea" v-model="user.remark" :rows="3" />
      </el-form-item>

      <el-form-item label="部门树">
        <el-tree ref="ElTreeRef" :data="tree_depart" node-key="id" :props="{ label: 'name' }" :default-expand-all="true"
          show-checkbox :default-checked-keys="role_ids" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button type="primary" @click="submit">确定</el-button>
    </template>
  </ElDrawer>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { BUS } from "@/BUS"
import { api_v1 } from "@/api_v1"
import { ElMessage } from "element-plus"
let show = ref(false)
let title = ref("")
let user = ref({} as any)
let tree_depart = ref()
let role_ids = ref([])
let ElTreeRef = ref()

// 打开交互窗口
async function open(user_id: string) {
  show.value = true
  role_ids.value = [] //清空选中的树节点
  let res: any = await api_v1.user.find_one_user({ user_id })
  if (res.code != 200) return ElMessage.error(res.msg) //前置判断
  console.log("res", res)
  role_ids.value = res.result.role_ids
  user.value = res.result.user
  tree_depart.value = res.result.tree_depart

}

// 提交保存
async function submit() {
  console.log("ElTreeRef.value", JSON.parse(JSON.stringify(ElTreeRef.value.getCheckedNodes())))
  let ids = ElTreeRef.value.getCheckedNodes().filter((o: any) => o.type === 'role').map((o: any) => o.id)
  console.log("ids", ids)
  // // 表单数据
  let form = { user_id: user.value.user_id, name: user.value.name, phone: user.value.phone, gender: user.value.gender, remark: user.value.remark, role_ids: ids }

  let res: any = await api_v1.user.save_user(form)
  // if (res.code != 200) return ElMessage.error(res.msg)
  // ElMessage.success("保存成功")
  // show.value = false
  // BUS.func.tree_left_click() //调用全局BUS函数
}

// 暴露方法给父组件调用
defineExpose({ open })
</script>

<style scoped></style>
