<template>
  <h1>model_shop</h1>
  <div><el-button @click="test1()">test1</el-button></div>
</template>

<script setup lang="tsx">
import { ref } from "vue"
import { ElMessage } from "element-plus"
import * as tool_my from "tool_my"
import type { tb_test1 } from "tool_typeorm"

async function test1() {
  ElMessage.success("test1")
  console.log(`111---test1:`, 1111)
  let one: tb_test1 = { name: "1111" }
  console.log(`one---`, one)
}
</script>
