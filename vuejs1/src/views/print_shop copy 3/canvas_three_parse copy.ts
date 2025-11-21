import * as THREE from "three"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js"

export async function canvas_three_parse({ canvas, file }: { canvas: any, file: any }) {
  let blobURL = URL.createObjectURL(file) //得到blobURL
  const loader_stl = new STLLoader()//stl加载器
  loader_stl.load(blobURL, (geometry) => {
    console.log(`canvas_three_parse---blobURL:`, blobURL)

    // 🟩几何
    let my_geometry = geometry

    // 🟩渲染器
    let renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.setClearColor(0xeeeeee)


    // 🟩相机
    const camera = new THREE.OrthographicCamera(-1000, 1000, 1000, -1000, 1, 100000)

    // 🟩场景
    let scene = new THREE.Scene()

    // 🟩渲染循环
    animate()

    function animate() {
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
  })


}

// 解析stl根据blobURL
async function parse_STLLoader_by_blobURL(blobURL: any) {
  return new Promise(async (resolve, reject) => {

    try {
      const loader = new STLLoader()
      loader.load(blobURL, (geometry) => {
        resolve(geometry)
      })
    } catch (error) {
      reject(error)
    }



  })
}
