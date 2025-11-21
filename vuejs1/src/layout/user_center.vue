<template>
  <div class="flex gap-4">
    <div class="uno_card1 min-w-120px h-500px p-4">
      <el-radio-group v-model="active" class="flex-col">
        <el-radio value="个人信息" class="!m-0">个人信息</el-radio>
        <el-radio value="收货地址" class="!m-0">收货地址</el-radio>
      </el-radio-group>
    </div>
    <component :is="map_component[active]" />
  </div>
</template>




<script setup lang="tsx">
import { ref, reactive, watch } from "vue"
import { api_v1} from "@/api_v1"
import { BUS } from "@/BUS"
import { ElMessage } from "element-plus"
import { useRouter, useRoute } from "vue-router"

// 组件
import user_info from "./user_info.vue"
import user_address_take from "./user_address_take.vue"

// 映射组件
const map_component: { [key: string]: any } = {
  个人信息: user_info,
  收货地址: user_address_take,
}
// 监听active参数并更新路由参数
const router = useRouter()
let active = ref((useRoute().query.active as string) || "个人信息")
watch(active, (new_value) => router.replace({ path: location.pathname, query: { active: new_value } }))
</script>
