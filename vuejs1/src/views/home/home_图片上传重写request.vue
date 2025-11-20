<template>
  <div><el-button @click="test1()">test1</el-button></div>

  <el-upload size="mini" v-model:file-list="fileList" style="width: 1000px; height: 50px" drag multiple :http-request="uploadFile" list-type="picture-card" :on-preview="handlePictureCardPreview">
    <div style="height: 64px">拖拽上传或者点击上传</div>
  </el-upload>
  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script setup lang="tsx">
import { ref } from "vue"
import { ElMessage } from "element-plus"

const dialogImageUrl = ref("")
const dialogVisible = ref(false)
const fileList = ref([])

async function test1() {
  ElMessage.success("test1")
  console.log(`111---fileList:`, JSON.parse(JSON.stringify(fileList.value)))
}

async function uploadFile(eee: any) {
  ElMessage.success("test1")
  console.log(`111---eee:`, eee)
}

async function handlePictureCardPreview(uploadFile: any) {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}
</script>
