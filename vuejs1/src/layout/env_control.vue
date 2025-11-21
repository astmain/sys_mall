<template>
  <div class="env_control">
    <VueDragResize  style="z-index: 999999;" :isActive="isActive" :x="BUS.control_button.left" :y="BUS.control_button.top" w="auto" h="auto" :sticks="[]" :isResizable="false" @dragging="dragging" @dragstop="dragstop" @activated="clickMessageBoard">
      <el-button type="primary">打开</el-button>
    </VueDragResize>

    <!-- el-dialog 可以拖拽 -->
    <el-dialog v-model="dialogVisible" title="环境切换" width="650" :before-close="handleClose" draggable>
      <el-button type="primary" @click="clearEnvironmentVariable">清除环境变量</el-button>

      <el-table :data="BUS.url_api_list" style="width: 100%" highlight-current-row>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-button v-if="!(BUS.url_api_curr.url && row.name === BUS.url_api_curr.name)" size="small" @click="selectApi(row)"> 选择 </el-button>
            <el-button v-else type="primary" size="small">当前 </el-button>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="名称" width="200" />
        <el-table-column prop="url" label="url" width="300" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx">
import { ref } from "vue"
import { BUS } from "@/BUS"
import VueDragResize from "vue-drag-resize/src"

const clickMessageBoard = () => {
  setTimeout(() => {
    if (isActive.value) return
    dialogVisible.value = true
  }, 100)
}

const isActive = ref(false)

const dragstop = () => {
  isActive.value = false
}

const dragging = (opt: any) => {
  isActive.value = true
  BUS.control_button.top = opt.top
  BUS.control_button.left = opt.left
}

const dialogVisible = ref(false)
const handleClose = () => {
  dialogVisible.value = false
}

// 判断是否为当前API
const isCurrentApi = (row: any) => {
  return row.url === BUS.url_api_curr.url && row.name === BUS.url_api_curr.name
}

// 选择API
const selectApi = (row: any) => {
  BUS.url_api_curr = { ...row }
}

function clearEnvironmentVariable() {
  // localStorage 清除全部
  localStorage.clear()
}
</script>

<style></style>
