import * as THREE from "three"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js"

export async function canvas_three_parse({ canvas, file }: { canvas: any, file: any }) {
  const blobURL = URL.createObjectURL(file)
  const loader_stl = new STLLoader()

  loader_stl.load(blobURL, (geometry) => {
    let my_geometry = geometry//几何
    console.log(`canvas_three_parse---blobURL:`, blobURL)
    URL.revokeObjectURL(blobURL)//用来释放通过 URL.createObjectURL临时创建的所占用的内存,防止内存泄漏


    // 渲染器
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    const device_pixel_ratio = Math.min(window.devicePixelRatio || 1, 1)//设备刷新率
    const w = canvas.clientWidth//渲染器宽度
    const h = canvas.clientHeight //渲染器高度
    renderer.setPixelRatio(device_pixel_ratio)//以提升画质同时控制性能开销
    renderer.setSize(w, h, false)
    renderer.setClearColor(0x8f8aff)

    // 🟩场景
    const scene = new THREE.Scene()

    // 🟩材质
    //color基底颜色(灰色) //metalness0.2：金属度，范围 0~1。0 接近非金属（塑料/陶瓷），1 接近金属。0.2 表示略带金属感 //roughness粗糙度，范围 0~1。0 非常光滑镜面反射，1 非常粗糙漫反射。0.7 比较哑光。
    const material_option = { color: 0x888888, metalness: 0.2, roughness: 0.7 }
    const material = new THREE.MeshStandardMaterial(material_option)

    // 🟩网格
    const mesh = new THREE.Mesh(my_geometry, material)
    scene.add(mesh)//场景-添加-网格

    // 🟩灯光
    const light_ambient = new THREE.AmbientLight(0xffffff, 0.5)//    (环境光)白色光，强度为0.5
    const light_direct = new THREE.DirectionalLight(0xffffff, 0.8)// (方向光)白色光，强度为0.8
    light_direct.position.set(105, 105, 105)//   方向光-光源位置
    light_direct.castShadow = true //            方向光-启用阴影
    light_direct.shadow.bias = -0.0001 //        方向光-解决阴影条纹问题
    light_direct.shadow.mapSize.width = 2048
    light_direct.shadow.mapSize.height = 2048
    light_direct.shadow.camera.near = 0.5
    light_direct.shadow.camera.far = 50
    scene.add(light_ambient)//场景-添加-环境光
    scene.add(light_direct)// 场景-添加-方向光

    // 🟩盒子,居中并获取尺寸
    my_geometry.computeBoundingBox()
    const box = my_geometry.boundingBox!
    const size = new THREE.Vector3()//尺寸
    box.getSize(size)
    const center = new THREE.Vector3()//中心点
    box.getCenter(center)
    mesh.position.sub(center) // 网格-位置-减去-中心点
    const size_max = Math.max(size.x, size.y, size.z) || 1

    // 🟩相机-根据画布比例自适配-目前正交角度
    const aspect = w / h
    const half_h = size_max * 0.8
    const half_w = half_h * aspect
    const camera = new THREE.OrthographicCamera(-half_w, half_w, half_h, -half_h, 0.1, size_max * 10)
    camera.position.set(size_max * 2, size_max * 2, size_max * 2)
    camera.lookAt(0, 0, 0)

    // 渲染循环
    function animate() {
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    animate()

    // // 处理窗口/容器尺寸变化
    // const on_resize = () => {
    //   const nw = canvas.clientWidth || w
    //   const nh = canvas.clientHeight || h
    //   renderer.setSize(nw, nh, false)
    //   const aspect2 = nw / nh
    //   const half_h2 = size_max * 0.8
    //   const half_w2 = half_h2 * aspect2
    //   camera.left = -half_w2
    //   camera.right = half_w2
    //   camera.top = half_h2
    //   camera.bottom = -half_h2
    //   camera.updateProjectionMatrix()//改相机投影参数后，重新计算投影矩阵
    //   console.log(`111---222:`, 1111)
    // }
    // window.addEventListener("resize", on_resize)
  })
}