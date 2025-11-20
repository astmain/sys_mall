<template>
  <div class="flex gap-2">
    <nav class="uno_card1 p-4 min-w-64">
      <div class="text-lg font-bold">文档列表</div>
      <el-radio-group v-model="active" class="flex-col !items-start gap-2">
        <el-radio class="!m-0 !font-bold" v-for="item in list_doc" :label="item.name" :value="item.path" @click="open(item.path)">
          <!-- <el-radio class="!m-0 !font-bold" v-for="item in list_doc"  :value="item.path" @click="open(item.path)"> -->
          <!-- <div class="text-left">{{ item.name }}</div> -->
        </el-radio>
      </el-radio-group>
    </nav>

    <div class="markdown" v-html="html_str"></div>
  </div>
</template>

<script setup lang="tsx">
import { ref, onMounted, watch } from "vue"
import { useRouter, useRoute } from "vue-router"
import { ElMessage } from "element-plus"
import { marked } from "marked"

// 文档列表
let list_doc = ref([
  { name: "doc1.md", path: "/doc1.md" },
  { name: "前端01_ui风格.md", path: "/前端01_ui风格.md" },
  { name: "后端02_dto模版.md", path: "/后端02_dto模版.md" },
])
// let active = ref(list_doc.value.at(0)?.path || "")
let html_str = ref()

// 打开文档
async function open(path: string) {
  try {
    const response = await fetch(path) // 注意：路径基于 public 目录，所以直接从根路径访问
    const str = await response.text()
    console.log("open---response", response)
    console.log("open---str", str)
    if (!response.ok || str.includes(`<div id="app"></div>`)) throw new Error(`HTTP error! status: ${response.status}`)
    html_str.value = marked.parse(str) // 使用 marked 将 Markdown 转为 HTML
    console.log("open---成功:html_str", html_str.value)
  } catch (error) {
    html_str.value = `<h1 style='color: red !important; font-size: 24px;'>加载文档失败,请检查文档路径是否正确</h1> <p>path:${path}</p>`
    // console.error("html_str", error)
    console.error("open---失败:html_str", html_str.value)
  }
}

// 监听active参数并更新路由参数
let active = ref((useRoute().query.active as string) || list_doc.value.at(0)?.path || "")
const router = useRouter()
watch(active, (new_value) => {
  router.replace({ path: location.pathname, query: { active: new_value } })
  open(new_value)
})

// 路由进入时
onMounted(() => {
  active.value = (useRoute().query.active as string) || list_doc.value.at(0)?.path || ""
  open(active.value)
})
defineExpose({ open })
</script>

<style>
@import "./md1.css";
</style>

<style scoped>
:deep(.el-radio__inner) {
  display: none !important; /* 消失圆点 */
}
:deep(.el-radio__label) {
  padding: 0 !important; /* 消失间距 */
}
</style>
