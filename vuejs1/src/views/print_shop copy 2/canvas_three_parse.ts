import * as THREE from "three"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js"

export async function canvas_three_parse({ canvas, file }: { canvas: any, file: any }) {
  const blobURL = URL.createObjectURL(file)
  const loader_stl = new STLLoader()

  loader_stl.load(blobURL, (geometry) => {
    console.log(`canvas_three_parse---blobURL:`, blobURL)
    URL.revokeObjectURL(blobURL)//用来释放通过 URL.createObjectURL临时创建的所占用的内存,防止内存泄漏

    // 确保法线
    geometry.computeVertexNormals()

    // 渲染器
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = canvas.clientWidth || 800
    const h = canvas.clientHeight || 600
    renderer.setPixelRatio(dpr)
    renderer.setSize(w, h, false)
    renderer.setClearColor(0xeeeeee)

    // 场景
    const scene = new THREE.Scene()

    // 材质 + 网格
    const material = new THREE.MeshStandardMaterial({
      color: 0x888888,
      metalness: 0.2,
      roughness: 0.7
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // 灯光
    scene.add(new THREE.AmbientLight(0xffffff, 0.6))
    const dir = new THREE.DirectionalLight(0xffffff, 0.8)
    dir.position.set(1, 1, 1)
    scene.add(dir)

    // 计算包围盒，居中并获取尺寸
    geometry.computeBoundingBox()
    const box = geometry.boundingBox!
    const size = new THREE.Vector3()
    box.getSize(size)
    const center = new THREE.Vector3()
    box.getCenter(center)
    mesh.position.sub(center) // 把模型移到原点

    const size_max = Math.max(size.x, size.y, size.z) || 1

    // 相机（正交）根据画布比例自适配
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

    // 处理窗口/容器尺寸变化
    const on_resize = () => {
      const nw = canvas.clientWidth || w
      const nh = canvas.clientHeight || h
      renderer.setSize(nw, nh, false)
      const aspect2 = nw / nh
      const half_h2 = size_max * 0.8
      const half_w2 = half_h2 * aspect2
      camera.left = -half_w2
      camera.right = half_w2
      camera.top = half_h2
      camera.bottom = -half_h2
      camera.updateProjectionMatrix()
    }
    window.addEventListener("resize", on_resize)
  })
}