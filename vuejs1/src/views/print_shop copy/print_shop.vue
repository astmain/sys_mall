<template>
  <input ref="ref_file_input" class="file_input" type="file" @change="get_input_file" accept=".stl,.obj" />
  <!-- 画布three解析 -->
  <canvas id="canvas_three_parse" style="width: 100%; height: 300px; border: 1px solid red; box-sizing: border-box" />
</template>

<script setup lang="tsx">
import { ref } from "vue"
import { ElMessage } from "element-plus"

import { canvas_three_parse } from "./canvas_three_parse"
async function get_input_file(event: any) {
  try {
    const file = event.target.files[0]
    // 绘制three解析
    const result = await canvas_three_parse({ canvas: document.getElementById("canvas_three_parse"), file })
    console.log(`get_input_file---result:`, result)
  } catch (error) {
    console.error(`get_input_file---error:`, error)
    throw error
  } finally {
    event.target.value = ""
  }
}
</script>
