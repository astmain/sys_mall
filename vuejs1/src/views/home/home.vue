<template>
  <div><el-button @click="test1()">test1</el-button></div>
</template>

<script setup lang="tsx">
import { ref } from "vue"
import { ElMessage } from "element-plus"

async function test1() {
  ElMessage.success("test1")
  console.log(`111---test1:`, 1111)
}
</script>
