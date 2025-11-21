<template>
  <input ref="ref_file_input" class="file_input" type="file" @change="get_input_file" accept=".stl,.obj" />

  <!-- <canvas id="canvas_three_parse" ref="ref_canvas" style="width: 1000px; height: 500px; border: 1px solid red; box-sizing: border-box" /> -->

  <el-button @click="() => (cube.visible = !cube.visible)">显示/隐藏</el-button>

  <div id="id_canvas"></div>
</template>
<script setup lang="tsx">
import { onMounted, ref, markRaw } from "vue"
import { ElMessage } from "element-plus"

// three.js 文档 http://www.yanhuangxueyuan.com/threejs/docs/index.html?q=color#api/zh/math/Color
import * as THREE from "three"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { ArcballControls } from "three/examples/jsm/Addons.js"
import { colorHex } from "./colorHex"

// 变量
let ref_canvas = ref()
let cube: any = ref()
let camera: any = $ref()
let scene: any = $ref()
let renderer: any = $ref()
let blobURL = ref("blob:http://127.0.0.1:8080/a12b3d6d-a8ba-4ea3-b240-ad746ba69294")

async function three_view({ canvas, blobURL }: { canvas: any; blobURL?: string }) {
  if (!blobURL) return ElMessage.error("没有-blobURL")
  console.log(`three_view---blobURL:`, blobURL)

  // 场景
  // let scene = markRaw(new THREE.Scene())
  let scene = new THREE.Scene()
  scene.background = new THREE.Color(colorHex.blue0)

  // 相机-透视相机
  let camera = new THREE.PerspectiveCamera(45, 1000 / 500, 0.1, 1000)
  camera.position.z = 3
  camera.position.x = 2
  camera.position.y = 0
  camera.lookAt(0, 0, 0)

  // 物体
  cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: colorHex.red }))
  scene.add(cube)
  console.log(`111---cube:`, cube)

  // 网格辅助器
  let grid_helper = new THREE.GridHelper(100, 3, colorHex.紫色1, colorHex.紫色1)
  scene.add(grid_helper)

  // 渲染器
  let renderer = markRaw(new THREE.WebGLRenderer({ antialias: true }))
  renderer.setSize(1000, 500) //设置宽高
  document.getElementById("id_canvas")?.appendChild(renderer.domElement) //添加到dom上
  renderer.render(scene, camera) //渲染
  animate()
  function animate(cube_rotation_y = 0.01) {
    requestAnimationFrame(animate)
    // cube.rotation.x += 0.01
    // cube.rotation.y += cube_rotation_y //旋转
    // cube.rotation.y += 0.01 //旋转
    renderer.render(scene, camera)
  }
}
async function get_input_file(event: any) {
  const file = event.target.files[0]
  blobURL.value = URL.createObjectURL(file)
  // 绘制three解析
  const result = await three_view({ canvas: ref_canvas, blobURL: blobURL.value })
  console.log(`get_input_file---result:`, result)
  event.target.value = ""
  console.log("完成---get_input_file")
}

onMounted(() => {
  three_view({ canvas: ref_canvas, blobURL: blobURL.value })
})
</script>
