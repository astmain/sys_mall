<template>
  <input ref="ref_file_input" class="file_input" type="file" @change="get_input_file" accept=".stl,.obj,.gltf" />
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
// let blobURL = ref("blob:http://127.0.0.1:8080/cf3e2121-3b4a-4e1e-b290-70f26fcf82e1")
// let blobURL = ref("./6mb招财猫.stl")
let blobURL = ref("./3mb钩子.stl")

function light_make(scene: THREE.Scene) {
  light_ambient_1(scene) //环境光
  light_spot_1(scene) //聚光灯
  light_directional_1(scene) //方向光
  light_point_1(scene) //点光源
}

async function three_view({ canvas, blobURL }: { canvas: any; blobURL?: string }) {
  if (!blobURL) return ElMessage.error("没有-blobURL")
  console.log(`three_view---blobURL:`, blobURL)
  let /*渲染器*/ renderer = make_renderer1()
  let /*相机*/ camera = make_camera1()
  let /*场景*/ scene = make_scene1()
  let /*控制器*/ controls = make_controls_1_arcball({ camera, renderer, scene })
  // /*场景-添加-物体1*/ scene.add(make_cube1())
  light_make(scene) /*场景-添加-光源*/

  const loader_stl = new STLLoader() //stl加载器
  loader_stl.load(
    blobURL,
    (geometry) => {
      const mesh = new THREE.Mesh(geometry, make_material3())
      //自动计算并设置scale
      auto_scale_mesh_simple(mesh, camera, renderer)
      // 添加到场景
      scene.add(mesh)
    },
    (xhr) => {
      let num_raw = (xhr.loaded / xhr.total) * 100
      let mun_2 = Number(num_raw.toFixed(2))
      let percent_info = { num_raw: num_raw, percent_number: mun_2, percent_format: `${mun_2}%` }
      console.log(`STLLoader---percent_info进度:`, percent_info)
    }
  )

  /*渲染器-添加-场景-相机*/
  renderer.render(scene, camera)
  animate()
  function animate(cube_rotation_y = 0.01) {
    requestAnimationFrame(animate)

    controls?.update()
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

// 🟩控制器controls_arcball(托球式)
function make_controls_1_arcball({ camera, renderer, scene }: { camera: THREE.PerspectiveCamera; renderer: THREE.WebGLRenderer; scene: THREE.Scene }) {
  let controls = new ArcballControls(camera, renderer.domElement, scene)
  controls.enableAnimations = false //动画阻尼
  controls.dampingFactor = 0.01 //阻尼系数0-1  越大越不灵敏
  controls.enableZoom = true //启用缩放,滚轮缩放
  controls.setGizmosVisible(false) // 隐藏坐标轴控件

  // controls.setMouseAction("ROTATE", THREE.MOUSE.RIGHT) //启用右键旋转
  // controls.setMouseAction("PAN", THREE.MOUSE.MIDDLE) //启用中键平移
  // controls.unsetMouseAction(THREE.MOUSE.LEFT) //禁用左键旋转
  // controls.enablePan = true //启用平移,鼠标中键平移
  // controls.rotateSpeed = 2.0 //旋转速度
  // controls.minDistance = 0.1 //最小距离
  // controls.maxDistance = 1000 //最大距离

  return controls
}

// 🟩场景1
function make_scene1() {
  let scene = new THREE.Scene()
  scene.background = new THREE.Color(colorHex.blue0)
  return scene
}

// 🟩环境光1
function light_ambient_1(scene: THREE.Scene) {
  const light = new THREE.AmbientLight(0xffffff, 1) //环境光 - 提供基础照明
  scene.add(light)
  return light
}

// 🟩聚光灯1
function light_spot_1(scene: THREE.Scene) {
  const light = new THREE.SpotLight(0xffffff, 1.0) //聚光灯 - 提供定向照明
  light.position.set(0, 0, -200)
  scene.add(light)
  return light
}
// 🟩方向光1
function light_directional_1(scene: THREE.Scene) {
  const light = new THREE.DirectionalLight(0xffffff, 2) //方向光 - 提供定向照明
  light.position.set(200, 200, 200)
  scene.add(light)
  return light
}
// 🟩点光源1
function light_point_1(scene: THREE.Scene) {
  const light = new THREE.PointLight(0xffffff, 10) //点光源 - 提供局部照明
  light.position.set(400, 0, 0)
  scene.add(light)
  return light
}

// 🟩简化版本（如果只需要简单适配）
function auto_scale_mesh_simple(mesh: THREE.Mesh, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) {
  const box = new THREE.Box3().setFromObject(mesh)
  const size = box.getSize(new THREE.Vector3())
  const max_dimension = Math.max(size.x, size.y, size.z)
  if (max_dimension === 0) return
  // 根据相机距离和FOV计算视野大小
  const camera_distance = camera.position.length()
  const fov_rad = (camera.fov * Math.PI) / 180
  const visible_height = 2 * Math.tan(fov_rad / 2) * camera_distance
  // 使模型占据视野的70-80%
  const scale = (visible_height * 0.75) / max_dimension
  mesh.scale.set(scale, scale, scale)
  // 居中模型
  const center = box.getCenter(new THREE.Vector3())
  mesh.position.sub(center.multiplyScalar(scale))
}

// 🟩材质1
function make_material1() {
  //color基底颜色(灰色) //metalness0.2：金属度，范围 0~1。0 接近非金属（塑料/陶瓷），1 接近金属。0.2 表示略带金属感 //roughness粗糙度，范围 0~1。0 非常光滑镜面反射，1 非常粗糙漫反射。0.7 比较哑光。
  const material_option = { color: 0x888888, metalness: 0.2, roughness: 0.7 }
  const material = new THREE.MeshStandardMaterial(material_option)
  return material
}

// 🟩材质2
function make_material2() {
  const material_option = { color: colorHex.red }
  let material = new THREE.MeshBasicMaterial(material_option)
  return material
}

// 🟩材质3
function make_material3() {
  const material_option = { color: "#918b84", side: THREE.DoubleSide, specular: "#918b84", shininess: 12 }
  let material = new THREE.MeshPhongMaterial(material_option)
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
  three_view({ canvas: ref_canvas, blobURL: blobURL.value })
})
</script>
