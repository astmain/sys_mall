<template>
  <env_control />
  <el-container style="height: 100vh">
    <el-header style="width: 100vw; height: 60px; background: #304156; color: #fff">
      <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 60px; justify-content: space-between">
        <!-- 切换网站类型 -->
        <span v-if="BUS.web_type === 'shop'" style="font-size: 24px; font-weight: bold">3D打印</span>
        <span v-if="BUS.web_type === 'admin'" style="font-size: 24px; font-weight: bold">后台管理</span>

        <el-menu style="flex: 1; width: 900px" v-show="BUS.web_type === 'shop'" mode="horizontal" :default-active="active_menu" router class="header_menu" color background-color="#304156" text-color="#bfcbd9" active-text-color="#409eff">
          <el-menu-item index="/print_shop">3D打印</el-menu-item>
          <el-menu-item index="/model_shop">3D模型</el-menu-item>
          <el-menu-item index="/home">首页</el-menu-item>
          <div style="position: absolute; right: 20px; top: 20px" class="ml-auto cursor-pointer flex-center flex gap-2" @click="() => router.push('/cart')"><span class="icon-cart !bg-red-500" /> 购物车</div>
        </el-menu>

        <div style="display: flex; align-items: center; gap: 10px; justify-content: center">
          <el-button :type="BUS.web_type === 'shop' ? 'primary' : ''" @click="handle_switch_shop"> shop</el-button>
          <el-button :type="BUS.web_type === 'admin' ? 'primary' : ''" @click="handle_switch_admin"> admin</el-button>
          <com_user_button/>
        </div>
      </div>
    </el-header>

    <el-container>
      <div v-show="BUS.web_type === 'admin'">
        <el-aside width="200px" style="background: #304156; height: 100%" class="admin_aside">
          <el-menu :default-active="active_menu" style="border: none" router background-color="#304156" text-color="#bfcbd9" active-text-color="#409eff">
            <!-- 动态渲染 view_admin 菜单 -->
            <template v-for="item in BUS.role_menu_tree" :key="item.path">
              <!-- 如果有子菜单 -->
              <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.path">
                <template #title>
                  <span>{{ item.name }}</span>
                </template>
                <el-menu-item v-for="child in item.children" :key="child.path" :index="child.path">
                  <span>{{ child.name }}</span>
                </el-menu-item>
              </el-sub-menu>
              <!-- 如果没有子菜单 -->
              <el-menu-item v-else :index="item.path">
                <span>{{ item.name }}</span>
              </el-menu-item>
            </template>

              <!-- 保留原有的文件系统菜单 -->
              <el-menu-item index="/view/admin/file_sys">
                <span>文件系统</span>
              </el-menu-item>
              <el-menu-item index="/test_mqtt">
                <span>测试MQTT</span>
              </el-menu-item>
          </el-menu>
        </el-aside>
      </div>

      <el-main class="layout_main" style="overflow-y: auto; height: calc(100vh - 60px - 50px)">
        <router-view />
      </el-main>
    </el-container>
    <div style="height: 50px; background: #304156; color: #fff">
      {{ BUS.url_api_curr }}
    </div>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useRouter, useRoute } from "vue-router"
import { ElMessage } from "element-plus"
import { BUS } from "@/BUS"

import /*组件*/ env_control from "./env_control.vue"
import /*组件*/ com_user_button from "./com_user_button.vue"

// 路由
const router = useRouter()
const route = useRoute()

// 计算属性
const active_menu = computed(() => route.path)

// ✅切换商城
const handle_switch_shop = (): void => {
  BUS.web_type = "shop"
  router.push("/model_shop")
}

// ✅切换admin
const handle_switch_admin = (): void => {
  BUS.web_type = "admin"
  router.push("/home")
}
</script>

<style scoped></style>
