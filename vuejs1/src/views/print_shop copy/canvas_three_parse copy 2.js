import * as THREE from "three"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
export async function canvas_three_parse({ canvas, file }) {
  // console.log("canvas.clientWidth", canvas.clientWidth)
  // console.log("canvas.clientHeight", canvas.clientHeight)

  // 渲染器
  let renderer = (window.renderer = new THREE.WebGLRenderer({ canvas, antialias: true })) //antialias是否执行抗锯齿。默认为false
  renderer.setSize(canvas.clientWidth, canvas.clientHeight)
  renderer.setClearColor(0xeeeeee)
  // console.log("渲染器-renderer", renderer)

  // 场景
  let scene = new THREE.Scene()
  scene.background = new THREE.Color(0x8f8aff) //  设置场景的背景色0x8c8aff  #c3d3ef
  // 光照
  // let ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
  // scene.add(ambientLight)
  // let directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  // directionalLight.position.set(1, 1, 1).normalize()
  // scene.add(directionalLight)

  // 相机
  let camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 10000)
  camera.position.set(0, 0, 100) // 临时初始位置

  // 控制器
  let controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.2
  // controls.addEventListener('change', () => console.log("控制器改变时查看相机位置", camera.position))

  // 材料-外观
  const my_material = new THREE.MeshStandardMaterial({ color: 0xbabcbd })

  let blobURL = URL.createObjectURL(file) //得到blobURL
  // 结构-几何
  let my_geometry = await parse_STLLoader_by_blobURL(blobURL)

  // 动态-自动居中 & 缩放场景
  my_geometry.computeBoundingBox()
  const boundingBox = my_geometry.boundingBox
  const center = new THREE.Vector3()
  boundingBox.getCenter(center)
  const size = new THREE.Vector3()
  boundingBox.getSize(size)

  // 动态-设置结构居中
  // my_geometry.translate(-center.x, -center.y, -center.z);
  my_geometry.translate(-center.x, -center.y, -center.z)

  // 动态-设置相机位置：距离 = 模型最大尺寸的倍数
  const maxDim = Math.max(size.x, size.y, size.z)
  const fov = camera.fov * (Math.PI / 180) // 转为弧度
  const distance = maxDim / (2 * Math.tan(fov / 2))
  // camera.position.set(0, 0, distance * 1.5);  // 加点距离避免太近
  camera.position.set(0, 0, distance * 5) // 加点距离避免太近
  camera.lookAt(0, 0, 0)

  // 网状物
  const mesh = new THREE.Mesh(my_geometry, my_material)
  scene.add(mesh)
  scene.add(new THREE.AxesHelper(maxDim * 1.5)) //xyz坐标

  // 渲染循环
  animate()

  function animate() {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }

  return { blobURL }
}

// 解析stl根据blobURL
async function parse_STLLoader_by_blobURL(blobURL) {
  return new Promise(async (resolve, reject) => {
    const loader = new STLLoader()
    loader.load(blobURL, (geometry) => {
      resolve(geometry)
    })
  })
}
