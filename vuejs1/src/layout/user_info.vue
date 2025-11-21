<template>
  <div class="uno_card1 flex-col gap-4 p-4 w-500px h-500px" id="user_info">
    <nav class="flex gap-4">
      <img :src="user_info.avatar" alt="头像" class="w-20 h-20" />
      <input ref="ref_input_file" type="file" @change="get_input_file" hidden />
      <el-button type="primary" link @click="ref_input_file.click()">修改头像</el-button>
    </nav>

    <nav class="flex items-center">
      <span class="w-20">ID</span>
      <el-input class="flex-1" v-model="user_info.id" disabled />
    </nav>

    <nav class="flex items-center">
      <span class="w-20">手机号</span>
      <el-input class="flex-1" v-model="user_info.phone" disabled />
    </nav>

    <nav class="flex items-center">
      <div class="w-20">用户名</div>
      <el-input class="flex-1" v-model="BUS.user.name" placeholder="请输入用户名" />
    </nav>

    <nav class="flex items-center">
      <span class="w-20">性别</span>
      <el-radio-group v-model="user_info.gender">
        <el-radio label="男" value="男" border />
        <el-radio label="女" value="女" border />
        <el-radio label="未知" value="未知" border />
      </el-radio-group>
    </nav>

    <nav class="flex justify-end">
      <el-button type="primary" @click="update_user_info">更新个人信息</el-button>
    </nav>

    <com_dialog_avatar ref="ref_com_dialog_avatar" />
  </div>
</template>

<script setup lang="tsx">
import { ref, reactive, onMounted } from "vue"
import { api_v1} from "@/api_v1"
import { BUS } from "@/BUS"
import { ElMessage } from "element-plus"
import { useRouter, useRoute } from "vue-router"
// 组件
import com_dialog_avatar from "./com_dialog_avatar.vue"
const ref_com_dialog_avatar = ref()
const ref_input_file = ref()
// 参数
const user_info = ref({ id: "", phone: "", name: "", gender: "", avatar: "" })

// 🟩 更新个人信息
async function update_user_info() {
  const { phone, ...form } = user_info.value
  const res: any = await api_v1.user.update_user_info({ ...form })
  if (res.code !== 200) ElMessage.error("失败:更新个人信息-接口异常")
  ElMessage.success("成功:更新个人信息")
  // 退出登录
  BUS.token = ""
  location.replace("/login")
}

// 🟩 input文件获取数据时.打开弹窗
async function get_input_file(event: any) {
  const file = event.target.files[0]
  const img = URL.createObjectURL(file)
  console.log("get_input_file", img)
  ref_com_dialog_avatar.value.open({ img })
  ref_com_dialog_avatar.value.callback = (img_upload_url: any) => {
    console.log("get_input_file---img_upload_url", img_upload_url)
    // debugger
    user_info.value.avatar = img_upload_url
  }
  event.target.value = "" // 清空input的值
}

onMounted(() => {
  user_info.value.id = BUS.user.id
  user_info.value.phone = BUS.user.phone
  user_info.value.name = BUS.user.name
  user_info.value.gender = BUS.user.gender
  user_info.value.avatar = BUS.user.avatar
})
</script>
