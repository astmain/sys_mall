<template>
  <div>
    <p>图片裁剪示例</p>
    <div style="width: 500px; height: 500px; margin: 16px auto">
      <vue-cropper
        ref="cropper_ref"
        :img="option.img"
        :output-size="option.size"
        :output-type="option.output_type"
        :info="true"
        :full="option.full"
        :fixed="fixed"
        :fixed-number="fixed_number"
        :can-move="option.can_move"
        :can-move-box="option.can_move_box"
        :fixed-box="option.fixed_box"
        :original="option.original"
        :auto-crop="option.auto_crop"
        :auto-crop-width="option.auto_crop_width"
        :auto-crop-height="option.auto_crop_height"
        :center-box="option.center_box"
        :high="option.high"
        :max-img-size="option.max_img_size"
        mode="contain"
        @real-time="on_real_time"
        @img-load="on_img_load"
        @crop-moving="on_crop_moving"
      />
    </div>

    <div :style="{ width: previews.w + 'px', height: previews.h + 'px', overflow: 'hidden', margin: '5px' }">
      <div :style="previews.div">
        <img :src="previews.url" :style="previews.img" />
      </div>
    </div>

    <div class="btn_row">
      <label class="btn" for="input_upload">上传图片</label>
      <input id="input_upload" type="file" accept="image/png, image/jpeg, image/gif, image/jpg" @change="on_upload_img" style="position: absolute; clip: rect(0 0 0 0)" />
      <el-button class="btn" @click="on_change_scale(1)">+</el-button>
      <el-button class="btn" @click="on_change_scale(-1)">-</el-button>
      <el-button class="btn" @click="on_rotate_left">左旋转</el-button>
      <el-button class="btn" @click="on_rotate_right">右旋转</el-button>
      <el-button class="btn" @click="on_finish_base64">预览(base64)</el-button>
      <el-button class="btn" @click="on_finish_blob">预览(blob)</el-button>
      <el-button class="btn" @click="on_clear_img">清除图片</el-button>
    </div>

    <div v-if="preview_result" class="preview_box">
      <p>裁剪结果预览：</p>
      <img v-if="result_type === 'base64'" :src="preview_result" alt="preview" />
      <img v-else :src="preview_result" alt="preview" />
    </div>
  </div>
</template>

<script setup lang="tsx">
import { ref, reactive } from "vue"

const default_img_url = "https://cdn.jsdelivr.net/gh/astmain/filestore@master/avatar_default.png"

const cropper_ref = ref<any>(null)
const previews = ref<any>({})
const preview_result = ref<string>("")
const result_type = ref<"base64" | "blob">("base64")

const option = reactive({
  img: default_img_url,
  size: 1,
  full: false,
  output_type: "png",
  can_move: true,
  fixed_box: false,
  original: false,
  can_move_box: true,
  auto_crop: true,
  auto_crop_width: 300,
  auto_crop_height: 300,
  center_box: true,
  high: true,
  max_img_size: 99999,
})

const fixed = ref<boolean>(false)
const fixed_number = ref<[number, number]>([1, 1])

function on_real_time(data: any) {
  previews.value = data
}
function on_img_load(msg: any) {
  // console.log("img load", msg)
}
function on_crop_moving(data: any) {
  console.log("crop moving", data)
}

function on_upload_img(e: Event) {
  const input_el = e.target as HTMLInputElement
  const file = input_el.files && input_el.files[0]
  if (!file) return
  if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/i.test(file.name)) {
    alert("图片类型必须是 gif/jpg/jpeg/png/bmp 之一")
    return
  }
  const reader = new FileReader()
  reader.onload = (ev: ProgressEvent<FileReader>) => {
    const result = ev.target?.result
    let data: any
    if (typeof result === "object") {
      data = window.URL.createObjectURL(new Blob([result as ArrayBuffer]))
    } else {
      data = result
    }
    option.img = data as string
  }
  reader.readAsArrayBuffer(file)
  input_el.value = ""
}

function on_change_scale(num: number) {
  cropper_ref.value?.changeScale(num || 1)
}
function on_rotate_left() {
  cropper_ref.value?.rotateLeft()
}
function on_rotate_right() {
  cropper_ref.value?.rotateRight()
}

function on_finish_base64() {
  result_type.value = "base64"
  cropper_ref.value?.getCropData((data: string) => {
    preview_result.value = data
  })
}
function on_finish_blob() {
  result_type.value = "blob"
  cropper_ref.value?.getCropBlob((blob: Blob) => {
    preview_result.value = URL.createObjectURL(blob)
  })
}

function on_clear_img() {
  option.img = ""
  preview_result.value = ""
}
</script>

<style scoped>
.preview_box {
  text-align: center;
  margin-top: 12px;
}
.preview_box img {
  max-width: 300px;
}
</style>
