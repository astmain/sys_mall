<template>
  <div class="flex">
    <el-dropdown trigger="click" @command="handle_dropdown">
      <div class="flex">
        <img :src="BUS.user.avatar" style="width: 24px" />
        <div style="width: 100px; text-align: center">{{ BUS?.user?.phone || "无" }}</div>
      </div>

      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="user_center"> 个人中心</el-dropdown-item>
          <el-dropdown-item command="my_order"> 我的订单</el-dropdown-item>
          <el-dropdown-item command="model_save"> 模型上传</el-dropdown-item>
          <el-dropdown-item command="model_manage"> 模型管理</el-dropdown-item>
          <el-dropdown-item command="markdown"> markdown</el-dropdown-item>
          <el-dropdown-item command="logout"> 退出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { api_v1} from "@/api_v1"
import { BUS } from "@/BUS"
import { ref, reactive } from "vue"
import { ElMessage } from "element-plus"
import { useRouter, useRoute } from "vue-router"
// 路由
const router = useRouter()
const route = useRoute()

function handle_dropdown(command: any) {
  console.log("command---:", command)
  // ✅退出
  if (command === "logout") {
    BUS.token = ""
    localStorage.removeItem("current_layout")
    ElMessage.success("已退出登录")
    router.push("/login")
  }
  // 个人中心
  else if (command === "user_center") {
    // router.push("/user_center")
    console.log("route.path---:", route.path)
    console.log("route.path---:", route.fullPath)
    console.log("route.path---:", location.host)
    // const url = `${location.host}/user_center`
    // window.open("user_center")
    router.push("/user_center")
  } else if (command === "model_save") {
    router.push("/model_save")
  } else if (command === "model_manage") {
    router.push("/model_manage")
  } else if (command === "my_order") {
    router.push("/my_order")
  } else if (command === "markdown") {
    // router.push("/markdown")
    window.open("/markdown", "_blank")
  }
}
</script>

<style scoped></style>
