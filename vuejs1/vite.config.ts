import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx' //支持jsx语法
import VueDevTools from 'vite-plugin-vue-devtools' //vue工具

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), VueDevTools({ launchEditor: 'cursor' })],

  //服务
  server: {
    host: '127.0.0.1',
    port: 5001,
    open: true,
  },
})
