import axios from 'axios'

// 创建axios实例
const axios_instance = axios.create({
  // baseURL: import.meta.env.VITE_url_app_run || '/',
  // baseURL: BUS.url_api_curr.url,
  // @ts-ignore
  // baseURL: import('../BUS.ts').then((res) => res.useBUS().url_api_curr.url),
  // timeout: 10000,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
})

// 请求拦截器
axios_instance.interceptors.request.use(
  (config) => {
    // config.url = (window as any).BUS.url_api_curr.url + config.url
    config.url = 'http://127.0.0.1:3001' + config.url
    // config.url = 'http://127.0.0.1:3000'
    config.headers['token'] = localStorage.getItem('token')
    // config.headers['token'] = import.meta.env.VITE_jwt_token_swagger
    // config.headers['token'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjE1MTYwMzE1MTEwIiwicGhvbmUiOiIxNTE2MDMxNTExMCIsImlkIjoxLCJyb2xlSWRzIjpbXSwiaWF0IjoxNzU3OTIyODkxLCJleHAiOjE3NTgwMDkyOTF9.FWURZZuZE8ziD7fDc4nB-5KMgvbixUVP5DtTOj9axls'
    // config.headers['Authorization'] = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjE1MTYwMzE1MTEwIiwicGhvbmUiOiIxNTE2MDMxNTExMCIsImlkIjoxLCJyb2xlSWRzIjpbXSwiaWF0IjoxNzU2ODEzODM5LCJleHAiOjI2MjA3Mjc0MzksImlhdF90aW1lIjoiMjAyNS0wOS0wMiAxOTo1MDozOSIsImV4cF90aW1lIjoiMjA1My0wMS0xNyAxOTo1MDozOSJ9.ms6AOMGE_UYaAS3ilcdEdK6R2FGKGUVKVDBzAB_XP40'
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
axios_instance.interceptors.response.use(
  (response) => {
    // 可统一处理响应数据
    return response.data
  },
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      showNotification('失败:网络连接', 'error')
      console.error('失败:网络连接', error)
      return Promise.reject(error)
    }
    // return Promise.reject(error)

    // console.log('error.response.data:', error.response.data)

    // error.response.data.msg = error.response.data.msg || error.response.data.message

    // return error.response.data

    return error
  },
)

export const axios_api = axios_instance

// 让axios_api 支持全局使用
declare global {
  interface Window {
    axios_api: typeof axios_instance
  }
}

window.axios_api = axios_api

function showNotification(message: string, type = 'info', duration = 3000) {
  // 检查是否已添加样式
  if (!document.getElementById('showNotification')) {
    const style = document.createElement('style')
    style.id = 'showNotification'
    style.textContent = `
          /* 消息提示样式 */
          .notification {
              position: fixed;
              top: 20px;
              right: 20px;
              background-color: #333;
              color: white;
              padding: 12px 20px;
              border-radius: 4px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              z-index: 1000;
              opacity: 0;
              transform: translateY(-20px);
              transition: opacity 0.3s ease, transform 0.3s ease;
          }

          .notification.show {
              opacity: 1;
              transform: translateY(0);
          }

          .notification.success {
              background-color: #4CAF50;
          }

          .notification.error {
              background-color: #f44336;
          }

          .notification.info {
              background-color: #2196F3;
          }
      `
    document.head.appendChild(style)
  }

  // 创建提示元素
  const notification = document.createElement('div')
  notification.className = `notification ${type}`
  notification.textContent = message

  // 添加到页面
  document.body.appendChild(notification)

  // 触发显示动画
  setTimeout(() => {
    notification.classList.add('show')
  }, 100)

  // 设置自动消失
  setTimeout(() => {
    notification.classList.remove('show')
    // 动画结束后移除元素
    setTimeout(() => {
      if (notification.parentNode) document.body.removeChild(notification)
    }, 3000)
  }, duration)
}
