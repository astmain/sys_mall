<template>
  <el-button @click="handle_click">点击</el-button>
</template>

<script setup lang="tsx">
import { ref } from "vue"
import { ElButton } from "element-plus"
import JSZip from "jszip"

let list_img = $ref([
  {
    url: "https://server.oss.yun3d.com/oss_api/static_stream?path_static=/public/3/粉牡丹_2025-09_16_08_43_29_240645_new.png",
    name: "粉牡丹.png",
    size: 80241,
    size_format: "78.36 KB",
  },
  {
    url: "https://server.oss.yun3d.com/oss_api/static_stream?path_static=/public/3/黄牡丹_2025-09_17_03_03_54_704278_new.png",
    name: "黄牡丹.png",
    size: 93921,
    size_format: "91.72 KB",
  },
])
const handle_click = async () => {
  console.log("list_img", list_img)
  const zip = new JSZip()
  // 下载所有图片并添加到zip
  for (const item of list_img) {
    try {
      const response = await fetch(item.url)
      const blob = await response.blob()
      zip.file(item.name, blob)
    } catch (error) {
      console.error(`下载 ${item.name} 失败:`, error)
    }
  }

  // 生成zip文件并下载
  const zip_blob = await zip.generateAsync({ type: "blob" })
  const zip_url = URL.createObjectURL(zip_blob)

  const link = document.createElement("a")
  link.href = zip_url
  link.download = "我的下载.zip"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(zip_url)
}
</script>
<style></style>
