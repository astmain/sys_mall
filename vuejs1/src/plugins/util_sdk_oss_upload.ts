// 安装包   pnpm i  spark-md5  ;   pnpm i -D @types/spark-md5   ;pnpm i axios
// 请求拦截器   token 替换成自己的token
// 头像上传     /user/我的资源/1       ---      /1替换成用户id
// 网站设置     /web_set/0/网站设置

// SparkMD5 开始----------------------------------------
// @ts-ignore
import SparkMD5 from 'spark-md5'
// 计算文件md5的函数
export function get_file_md5(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = function (e: any) {
      const md5 = SparkMD5.hashBinary(e.target.result)
      resolve(md5)
    }
    reader.onerror = function (e) {
      reject(e)
    }
    reader.readAsBinaryString(file)
  })
}

// SparkMD5 结束----------------------------------------

// axios_oss 开始----------------------------------------
import axios from 'axios'

const axios_instance = axios.create({
  // baseURL: 'http://192.168.0.250:60001',
  // baseURL: 'https://server.oss.yun3d.com',//域名访问必须用https
  // baseURL: import.meta.env.VITE_url_app_run ,
  timeout: 1000 * 11,
  // baseURL: BUS.VITE_url_app_run
})
// 请求拦截器
axios_instance.interceptors.request.use(
  (config) => {
    //替换自己的token
    config.headers.token = localStorage.getItem('token')
    //封装时可以注释掉
    config.url = 'http://103.119.2.223:3000' + config.url
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
axios_instance.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const axios_oss = axios_instance

// axios_oss 结束----------------------------------------

let chunk_list_uploaded = [] as any[] //已经上传的分片数组

// ✅上传文件                                                          callback 回调函数自己写
export async function util_sdk_oss_upload({ file, path_static, oss_type = 'oss_parse', callback = async (res: any) => {} }: { file: any; path_static: string; oss_type?: 'oss' | 'oss_parse' | 'oss_parse_back'; callback?: (res: any) => Promise<void> }) {
  // console.log("util_sdk_oss_upload---typeof---file", typeof file)
  callback({ msg: '开始上传-计算文件大小1', progress: 0 })

  file = await check_file(file)
  // console.log("util_sdk_oss_upload---file:", file)

  const chunk_size = 1024 * 1024 * 10
  const total_chunks = Math.ceil((file as any).size / chunk_size)
  // 简单md5: 文件名+大小+lastModified
  console.time('get_file_md5')
  const file_md5: any = await get_file_md5(file)
  console.timeEnd('get_file_md5')
  debugger

  // return
  //   const file_md5 = `${file.name}_${file.size}_${file.lastModified}`
  //   console.log(`file_md5:`, file_md5)
  let uploaded = [] as any[] // 查询已上传分片
  callback({ msg: '开始上传-计算文件大小1', progress: 0 })

  // ✅接口查询已上传分片
  try {
    const res: any = await axios_oss.post('/oss_api/upload_chunk_progress', { fileMD5: file_md5 })
    console.log(`res:`, res)
    uploaded = res.result || []
    console.log(`uploaded:`, uploaded)
    chunk_list_uploaded = uploaded
    console.log(`已经上传的分片数量:---uploaded.length:`, uploaded.length)
    console.log(`已经上传的分片数组:---uploaded:`, uploaded)
    callback({ msg: '开始上传-✅接口查询已上传分片', progress: 0 })
  } catch (e) {
    console.log(`接口_查询已上传分片失败---e:`, e)
    throw '接口_查询已上传分片失败'
  }

  // ✅分片上传
  let uploaded_count = uploaded.length
  for (let i: number = 0; i < total_chunks; i++) {
    // 示例代码util_sdk_oss_upload.ts
    if (uploaded.includes(i)) continue // (跳过)已经上传的分片不重复上传
    const start = i * chunk_size
    const end = Math.min((file as any).size, start + chunk_size)
    const chunk = (file as any).slice(start, end)
    const form = new FormData()
    form.append('chunkIndex', i.toString())
    form.append('fileMD5', file_md5)
    form.append('chunk', chunk)
    callback({ msg: '开始上传-分片上传中...', progress: i / total_chunks })
    let retry = 0 //重试次数
    let success = false
    //重试3次
    while (retry < 3 && !success) {
      try {
        // 接口_分片上传
        const res_file_upload_chunk: any = await axios_oss.post('/oss_api/upload_chunk_file', form)
        if (res_file_upload_chunk.code === 200) {
          console.log(`成功-分片上传:res_file_upload_chunk:`, res_file_upload_chunk)
          uploaded_count++ //已经上传的分片数量+1
          chunk_list_uploaded.push(i) //已经上传的分片数组+1
          success = true
        } else {
          console.error(`失败-分片上传:res_file_upload_chunk:`, res_file_upload_chunk)
        }
      } catch (e) {
        retry++ //重试次数+1
        if (retry >= 3) {
          //重试3次
          console.log(`分片${i}上传失败3次，终止上传`, e)
          alert(`分片${i}上传失败3次，终止上传`)
          return
        }
        await new Promise((res) => setTimeout(res, 1000 * retry))
      }
    }
    const uploaded_percent = Math.floor((uploaded_count / total_chunks) * 100) //上传进度
    console.log(`上传进度---uploaded_percent:`, uploaded_percent)
  }

  // ✅接口合并分片
  const body = {
    fileName: (file as any).name,
    fileMD5: file_md5,
    totalChunks: total_chunks,
    path_static: path_static,
    oss_type: oss_type,
  }
  const merge_res: any = await axios_oss.post('/oss_api/upload_chuck_merge', body)
  console.log(`merge_res:`, merge_res)
  if (callback) {
    callback(merge_res)
    callback({ msg: '成功:-上传完毕', progress: 100 })
  } else {
    // console.error(`没有---callback函数:`, callback)
  }
  return merge_res
}

// 判断file的类型并且返回file(file可是File和blob:http)
async function check_file(file: any) {
  if (Object.prototype.toString.call(file) === '[object File]') {
    return file
  } else if (String(file).startsWith('blob:http')) {
    return await url_to_file(file)
  } else {
    throw new Error('file类型错误1')
  }

  async function url_to_file(url: string, name = 'avatar.png') {
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      return new File([blob], name, { type: blob.type || 'image/png' })
    } catch (error) {
      throw new Error('file类型错误2')
    }
  }
}
