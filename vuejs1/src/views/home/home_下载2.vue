<template>
  <el-button @click="click_download">点击下载</el-button>
</template>

<script setup lang="tsx">
import { ref } from "vue"
import { ElButton } from "element-plus"
import JSZip from "jszip"

let zip_name = "我的下载.zip"

let list_img_name = "主图"
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

let list_video_name = "视频"
let list_video = [
  {
    url: "https://server.oss.yun3d.com/oss_api/static_stream?path_static=/public/3/视频2_2025-09_17_03_04_00_639001_new.mp4",
    name: "视频2.mp4",
    size: 638457,
    size_format: "623.49 KB",
  },
]

const click_download = async () => {
  // 需要先安装 jszip: pnpm add jszip
  const zip = new JSZip()


  // 调用main
  await tool_zip_dir_children(list_img_name, list_img)
  await tool_zip_dir_children(list_video_name, list_video)
  await tool_zip_download(zip)


  // 工具方法zip文件夹
  async function tool_zip_dir_children(dir_name: string, list_children: any[]) {
    const dir = zip.folder(dir_name)
    for (const item of list_children) {
      try {
        const response = await fetch(item.url)
        const blob = await response.blob()
        dir?.file(item.name, blob)
      } catch (error) {
        console.error(`下载 ${item.name} 失败:`, error)
      }
    }
    return dir
  }

  // 工具方法zip下载
  async function tool_zip_download(zip: JSZip) {
    try {
      const zip_blob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
          level: 6,
        },
      })

      const zip_url = URL.createObjectURL(zip_blob)

      const link = document.createElement("a")
      link.href = zip_url
      link.download = zip_name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(zip_url)

      console.log("下载完成!")
    } catch (error) {
      console.error("生成zip文件失败:", error)
    }
  }

  // 生成zip文件并下载
}
</script>
<style></style>
