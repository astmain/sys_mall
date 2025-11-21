<template>
  <input ref="ref_file_input" class="file_input" type="file" @change="get_input_file" accept=".stl,.obj,.gltf" />

  <!-- <canvas id="canvas_three_parse" ref="ref_canvas" style="width: 1000px; height: 500px; border: 1px solid red; box-sizing: border-box" /> -->

  <el-button @click="() => (cube.visible = !cube.visible)">显示/隐藏</el-button>

  <div id="id_canvas"></div>
</template>
<script setup lang="tsx">
import { onMounted, ref, markRaw } from "vue"
import { ElMessage } from "element-plus"

// three.js 中文文档  http://www.yanhuangxueyuan.com/threejs/docs/index.html?q=color#api/zh/math/Color
// three.js 英文文档  https://threejs.org/docs/?q=STLLoader#STLLoader
import * as THREE from "three"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
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
  let /*渲染器*/ renderer = make_renderer1()
  let /*相机*/ camera = make_camera1()
  let /*场景*/ scene = make_scene1()
  // /*场景-添加-物体1*/ scene.add(make_cube1())

  /*渲染器-添加-场景-相机*/ renderer.render(scene, camera)

  // 环境光 - 提供基础照明
  const ambient = new THREE.AmbientLight(0xffffff, 1)

  // 聚光灯 - 提供定向照明
  const spotLight = new THREE.SpotLight(0xffffff, 1.0)
  spotLight.position.set(0, 0, -200)

  // 点光源 - 提供局部照明
  const pointLight = new THREE.PointLight(0xffffff, 10)
  pointLight.position.set(400, 0, 0)

  // 方向光 - 模拟太阳光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
  directionalLight.position.set(200, 200, 200)

  // scene.add(ambient) // 场景-添加-环境光
  // scene.add(spotLight) // 场景-添加-聚光灯
  // scene.add(pointLight) // 场景-添加-点光源
  // scene.add(directionalLight) // 场景-添加-方向光

  const loader_stl = new STLLoader() //stl加载器
  loader_stl.load(blobURL, (geometry) => {
    console.log(`three_view---geometry:`, geometry)
    const material = new THREE.MeshPhongMaterial({
      color: "#918b84",
      side: THREE.DoubleSide,
      specular: "#918b84",
      shininess: 12,
    })

    const mesh = new THREE.Mesh(geometry, material)
    // 可选：调整模型大小
    mesh.scale.set(0.1, 0.1, 0.1) //我如何根据 渲染器的大小和geometry的大小 自动设置mesh.scale.set

    // 添加到场景
    scene.add(mesh)
  })

  animate()
  function animate(cube_rotation_y = 0.01) {
    requestAnimationFrame(animate)
    // cube.rotation.x += 0.01
    // cube.rotation.y += cube_rotation_y //旋转
    // cube.rotation.y += 0.01 //旋转
    renderer.render(scene, camera)
  }
}

function make_renderer1() {
  let renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(1000, 500) //设置宽高
  document.getElementById("id_canvas")?.appendChild(renderer.domElement) //添加到dom上
  return renderer
}

// 🟩相机-透视相机1
function make_camera1() {
  let camera = new THREE.PerspectiveCamera(45, 1000 / 500, 0.1, 1000)
  camera.position.z = 3
  camera.position.x = 2
  camera.position.y = 0
  camera.lookAt(0, 0, 0)
  return camera
}

// 🟩场景1
function make_scene1() {
  let scene = new THREE.Scene()
  scene.background = new THREE.Color(colorHex.blue0)
  return scene
}

// 🟩材质1
function make_material1() {
  //color基底颜色(灰色) //metalness0.2：金属度，范围 0~1。0 接近非金属（塑料/陶瓷），1 接近金属。0.2 表示略带金属感 //roughness粗糙度，范围 0~1。0 非常光滑镜面反射，1 非常粗糙漫反射。0.7 比较哑光。
  const material_option = { color: 0x888888, metalness: 0.2, roughness: 0.7 }
  const material = new THREE.MeshStandardMaterial(material_option)
  return material
}

// 🟩材质1
function make_material2() {
  const material_option = { color: colorHex.red }
  let material = new THREE.MeshBasicMaterial(material_option)
  return material
}

// 🟩物体1
function make_cube1() {
  let cube1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), make_material2())
  return cube1
}

// 🟩网格辅助器1
function make_grid_helper1() {
  let grid_helper = new THREE.GridHelper(100, 3, colorHex.紫色1, colorHex.紫色1)
  return grid_helper
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
  // three_view({ canvas: ref_canvas, blobURL: blobURL.value })
})
</script>
