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
import { FontLoader, TextGeometry } from "three/examples/jsm/Addons.js"
import { colorHex } from "./colorHex"

// 变量
let ref_canvas = ref()
let cube: any = ref()
let camera: any = $ref()
let scene: any = $ref()
let renderer: any = $ref()
// let blobURL = ref("blob:http://127.0.0.1:8080/cf3e2121-3b4a-4e1e-b290-70f26fcf82e1")
let blobURL = ref("./6mb招财猫.stl")
// let blobURL = ref("./3mb钩子.stl")

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

  // 🟩创建坐标轴辅助场景
  const { helper_scene, helper_camera } = make_axes_helper_scene()

  const loader_stl = new STLLoader() //stl加载器
  loader_stl.load(
    blobURL,
    (geometry) => {
      // 几何_转_网状物
      const mesh = new THREE.Mesh(geometry, make_material4())
      // 盒子_包裹_网状物_可以得到数据(中心点,长宽高)
      const box = new THREE.Box3().setFromObject(mesh)
      const box_center = box.getCenter(new THREE.Vector3())
      const { x: box_x, y: box_y, z: box_z } = box.getSize(new THREE.Vector3())
      const box_x_y_z_max = Math.max(box_x, box_y, box_z)
      // (相机可见高度) 依据相机距离与 FOV 估算可见高度
      // const fov_rad = (camera.fov * Math.PI) / 180   //相机的视角角度弧度  乘以  是圆周率   角度转弧度公式：弧度 = 角度 × π / 180。
      const fov_rad = THREE.MathUtils.degToRad(camera.fov) //相机的视角角度弧度  乘以  是圆周率   角度转弧度公式：弧度 = 角度 × π / 180。
      const camera_visible_height = 2 * Math.tan(fov_rad / 2) * camera.position.length()
      // 盒子_在相机中的缩放比例
      const box_in_camera_scale = (camera_visible_height * 0.75) / box_x_y_z_max // 让模型高度约占 75% 视野
      // 网状物_设置_缩放比例
      mesh.scale.set(box_in_camera_scale, box_in_camera_scale, box_in_camera_scale)
      // 网状物_设置_位置(中心点_反向_缩放比例)
      mesh.position.set(-box_center.x * box_in_camera_scale, -box_center.y * box_in_camera_scale, -box_center.z * box_in_camera_scale)
      scene.add(mesh)
    },
    (xhr) => {
      // let num_raw = (xhr.loaded / xhr.total) * 100
      // let mun_2 = Number(num_raw.toFixed(2))
      // let percent_info = { num_raw: num_raw, percent_number: mun_2, percent_format: `${mun_2}%` }
      // console.log(`STLLoader---percent_info进度:`, percent_info)
    }
  )

  const axes_helper = new THREE.AxesHelper(999999) //红色x轴,绿色y轴,蓝色z轴
  scene.add(axes_helper)

  animate()
  function animate(cube_rotation_y = 0.01) {
    requestAnimationFrame(animate)
    renderer.render(scene, camera) /*渲染器-添加-场景-相机*/
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
  // 参数1:视角（field of view，FOV），单位是度。它定义了相机在垂直方向上能看到的角度，角度越大，视野越广，透视越明显。
  // 参数2:长宽比（aspect ratio），等于画布宽度除以高度。它让渲染出来的场景比例与显示区域一致，避免图像被拉伸或压缩
  // 参数3:近裁剪面（near clipping plane），从相机位置开始，距离小于这个值的对象都会被裁剪掉，不会显示。
  // 参数4:远裁剪面（far clipping plane），从相机位置开始，距离大于这个值的对象同样会被裁剪掉。Near 和 Far 一起定义了相机能看到的深度范围。
  let camera = new THREE.PerspectiveCamera(45, 1000 / 500, 1, 1000)
  camera.position.z = 20
  camera.position.x = 20
  camera.position.y = 20
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

// 🟩材质3
function make_material4() {
  const material_option = { color: 0xff9c7c, specular: 0x494949, shininess: 200 }
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

// 🟩创建坐标轴辅助场景
function make_axes_helper_scene() {
  // 创建辅助场景
  const helper_scene = new THREE.Scene()
  helper_scene.background = null

  // 定义相机的初始尺寸
  const aspect = 1 * 1.3
  const w = aspect
  const helper_camera = new THREE.OrthographicCamera(-w, w, w, -w, 0.1, 100)
  helper_camera.position.set(0, 0, 10)
  helper_camera.lookAt(0, 0, 0)

  // 坐标轴辅助工具
  // 创建一个组来包含坐标轴和文字
  const axes_group = new THREE.Group()

  const axes_helper = new THREE.AxesHelper(1)
  axes_group.add(axes_helper)

  // 创建字体加载器
  const font_loader = new FontLoader()

  font_loader.load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json", (font) => {
    // 创建文字几何体的函数
    function create_text(text: string, color: number) {
      const text_geometry = new TextGeometry(text, {
        font: font,
        size: 0.1, // 字体大小
        depth: 0.02, // 字体深度
      })
      const text_material = new THREE.MeshBasicMaterial({ color }) // 使用 MeshBasicMaterial 确保不受光照影响
      const text_mesh = new THREE.Mesh(text_geometry, text_material)
      text_geometry.computeBoundingBox() // 计算边界盒
      const bounding_box = text_geometry.boundingBox
      if (bounding_box) {
        const offset = bounding_box.getCenter(new THREE.Vector3()).negate() // 中心居中
        text_geometry.translate(offset.x, offset.y, offset.z) // 将文字几何体居中
      }
      return text_mesh
    }

    // 添加 X 轴标记
    const x_text = create_text("X", 0xff0000) // 红色
    x_text.position.set(1.1, 0, 0) // X 轴末端
    axes_group.add(x_text)

    // 添加 Y 轴标记
    const y_text = create_text("Y", 0x00ff00) // 绿色
    y_text.position.set(0, 1.1, 0) // Y 轴末端
    axes_group.add(y_text)

    // 添加 Z 轴标记
    const z_text = create_text("Z", 0x0000ff) // 蓝色
    z_text.position.set(0, 0, 1.1) // Z 轴末端
    axes_group.add(z_text)
  })

  // 将组添加到辅助场景
  helper_scene.add(axes_group)

  return { helper_scene, helper_camera, axes_group }
}

onMounted(() => {
  three_view({ canvas: ref_canvas, blobURL: blobURL.value })
})
</script>
