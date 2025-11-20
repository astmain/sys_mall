<template>
  <div>
    <el-dialog v-model="show" title="编辑头像" width="650" draggable :close-on-click-modal="false">
      <el-button class="btn" @click="on_rotate_left">左旋转</el-button>
      <el-button class="btn" @click="on_rotate_right">右旋转</el-button>
      <div class="flex justify-between">
        <nav style="width: 200px; height: 200px">
          <vue-cropper
            ref="cropper_ref"
            :img="cropper_opt.img"
            :output-size="cropper_opt.size"
            :output-type="cropper_opt.output_type"
            :info="true"
            :full="cropper_opt.full"
            :fixed="fixed"
            :fixed-number="fixed_number"
            :can-move="cropper_opt.can_move"
            :can-move-box="cropper_opt.can_move_box"
            :fixed-box="cropper_opt.fixed_box"
            :original="cropper_opt.original"
            :auto-crop="cropper_opt.auto_crop"
            :auto-crop-width="cropper_opt.auto_crop_width"
            :auto-crop-height="cropper_opt.auto_crop_height"
            :center-box="cropper_opt.center_box"
            :high="cropper_opt.high"
            :max-img-size="cropper_opt.max_img_size"
            mode="contain"
            @real-time="on_real_time"
            @img-load="on_img_load"
          />
        </nav>
        <nav>
          <div>图片编辑后的预览图</div>
          <div :style="{ width: previews.w + 'px', height: previews.h + 'px', overflow: 'hidden', margin: '5px' }">
            <div :style="previews.div">
              <img :src="previews.url" :style="previews.img" />
            </div>
          </div>
        </nav>
      </div>

      <template #footer>
        <el-button type="" plain @click="() => (show = false)">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx">
import { ref, reactive } from "vue"
import { BUS } from "@/BUS"
import { util_sdk_oss_upload } from "@/plugins/util_sdk_oss_upload"

let show = ref(false)
let callback = ref(async (res: any) => {}) //回调函数

// 预览
const cropper_ref = ref<any>(null)
const previews = ref<any>({}) //预览视图
const fixed = ref<boolean>(false) //固定
const fixed_number = ref<[number, number]>([1, 1]) //正方形比例
let img_upload_url = ref("") //图片上传后的url
const cropper_opt = reactive({
  img: "",
  auto_crop_width: 200,
  auto_crop_height: 200,
  size: 1,
  full: false,
  output_type: "png",
  can_move: true,
  fixed_box: false,
  original: false,
  can_move_box: true,
  auto_crop: true,
  center_box: true,
  high: true,
  max_img_size: 99999,
})

function on_real_time(data: any) {
  previews.value = data
}

function on_img_load(msg: any) {
  console.log("img load", msg)
}
function on_rotate_left() {
  cropper_ref.value?.rotateLeft()
}
function on_rotate_right() {
  cropper_ref.value?.rotateRight()
}
function open(arg: { img: string }) {
  cropper_opt.img = arg.img
  show.value = true
}
function close() {
  show.value = false
}

async function submit() {
  show.value = true

  //
  console.log(`111---previews:`, previews)
  console.log(`111---previews:`, previews.value.url) //blob:http://127.0.0.1:8080/e14fd2d2-0215-4488-a2c2-d4a4d0b86351"
  // 如何将 previews.value.url 转成 类似input 上传文件 event.target.files 中的file

  util_sdk_oss_upload({
    file: previews.value.url,
    path_static: "/public/0/我的头像",
    callback: async (res: any) => {
      console.log(res)
      if (res.code !== 200) alert("上传头像异常")
      img_upload_url.value = res.result.url
      callback.value(img_upload_url.value)
      console.log("")
      show.value = false
    },
  })
}

// 暴露方法给父组件调用
defineExpose({ show, open, submit, cropper_opt, img_upload_url, callback })
</script>

<style></style>
