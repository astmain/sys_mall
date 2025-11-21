<template>
  <h1>home_文件网络并发</h1>
  <div><el-button @click="test1()">test1</el-button></div>
  <div><el-button @click="test2()">test2</el-button></div>
</template>

<script setup lang="tsx">
import { ref } from "vue"
import { ElMessage } from "element-plus"
import { axios_api } from "@/plugins/axios_api"
import axios from "axios"
import { BUS } from "@/BUS"

const axios_instance = axios.create({})

axios_instance.interceptors.request.use((config) => {
  // config.url = (window as any).BUS.url_api_curr.url + config.url
  // config.url = "http://127.0.0.1:3002" + config.url
  config.url = BUS.url_api_curr.url + config.url
  config.headers["token"] = localStorage.getItem("token")
  // config.headers['token'] = import.meta.env.VITE_jwt_token_swagger
  // config.headers['token'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjE1MTYwMzE1MTEwIiwicGhvbmUiOiIxNTE2MDMxNTExMCIsImlkIjoxLCJyb2xlSWRzIjpbXSwiaWF0IjoxNzU3OTIyODkxLCJleHAiOjE3NTgwMDkyOTF9.FWURZZuZE8ziD7fDc4nB-5KMgvbixUVP5DtTOj9axls'
  // config.headers['Authorization'] = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjE1MTYwMzE1MTEwIiwicGhvbmUiOiIxNTE2MDMxNTExMCIsImlkIjoxLCJyb2xlSWRzIjpbXSwiaWF0IjoxNzU2ODEzODM5LCJleHAiOjI2MjA3Mjc0MzksImlhdF90aW1lIjoiMjAyNS0wOS0wMiAxOTo1MDozOSIsImV4cF90aW1lIjoiMjA1My0wMS0xNyAxOTo1MDozOSJ9.ms6AOMGE_UYaAS3ilcdEdK6R2FGKGUVKVDBzAB_XP40'
  return config
})

// config.url = BUS.url_api_curr.url + config.url
// config.headers["token"] = localStorage.getItem("token")

// 重试请求函数
async function request_with_retry(max_retries: number = 2, request_fn: () => Promise<any>): Promise<any> {
  let last_error: any
  for (let attempt = 0; attempt <= max_retries; attempt++) {
    try {
      return await request_fn()
    } catch (error: any) {
      last_error = error
      if (attempt < max_retries) {
        console.log(`请求失败，第${attempt + 1}次重试...`)
        await new Promise((resolve) => setTimeout(resolve, 1000)) // 延迟1秒后重试
      }
    }
  }
  throw last_error
}

async function test1() {
  ElMessage.success("test1")
  console.log(`111---test1:`, 1111)
}

async function test2() {
  return new Promise(async (resolve, reject) => {
    const list_form = [
      { id: 1, name: "" },
      { id: 2, name: "" },
      { id: 3, name: "11" },
    ]
    let completed = 0
    const list_ajax = list_form.map((item: any, index: number) => {
      return request_with_retry(2, () => {
        return axios_api.get(`/test/ajax/test_oss${item.name}`, {
          // 监听进度（仅对支持的请求有效，如GET/POST）
          onDownloadProgress: (progressEvent) => {
            const percent = progressEvent.total ? Math.round((progressEvent.loaded / progressEvent.total) * 100) : 0
            console.log(`请求${index + 1}进度：`, progressEvent)
          },
        })
      })
        .then((response: any) => {
          completed++
          console.log(`请求${index + 1}完成，总进度：${completed}/${list_form.length}`)
          console.log(`111---response:`, response)
          // return response

          //我希望通过code: 200 来判断请求是否成功
          if (response.code === 200) {
            return response
          } else {
            throw new Error(response.msg || response.message)
          }
        })
        .catch((error) => {
          completed++
          console.log(`请求${index + 1}失败（已重试2次），总进度：${completed}/${list_form.length}，错误：${error.message}`)
          throw error
        })
    })

    // 并发执行所有请求
    // Promise.all(list_ajax)
    //   .then((results) => {
    //     console.log("111所有请求完成！")
    //     console.log("结果：", results)
    //   })
    //   .catch((error: any) => {
    //     console.log("222部分请求失败！", error)
    //   })

    let res = await Promise.all(list_ajax)
    console.log("结果---res:", res)

    let res_success = res.filter((item: any) => item.code === 200)
    if (res_success.length == list_form.length) {
      const res_menrg = await axios_api.get(`/test/ajax/test_oss`)
      resolve(res_menrg)
    } else {
      reject(new Error("部分请求失败"))
    }
  })
}
</script>
