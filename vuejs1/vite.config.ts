import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx' //支持jsx语法
import VueDevTools from 'vite-plugin-vue-devtools' //vue工具
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

import ReactivityTransform from '@vue-macros/reactivity-transform/vite' //响应式数据$ref省略点value   安装方式     pnpm install @vue-macros/reactivity-transform -D
import AutoImport from 'unplugin-auto-import/vite' //自动引入                                        安装方式     pnpm install -D unplugin-vue-components unplugin-auto-import
import Components from 'unplugin-vue-components/vite' //组件自动引入
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers' //元素plus自动引入
import UnoCss from 'unocss/vite' // unocss                                                            安装方式    pnpm install unocss -D
import presetUno from '@unocss/preset-uno' // unocss                                                  安装方式    pnpm install @unocss/preset-uno -D
import presetAttributify from '@unocss/preset-attributify' // unocss

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    VueDevTools({ launchEditor: 'cursor' }),
    ReactivityTransform(),
    AutoImport({ resolvers: [ElementPlusResolver()], dts: './node_modules/auto-imports.d.ts' }),
    Components({ resolvers: [ElementPlusResolver()], dts: './node_modules/components.d.ts' }),
    UnoCss({
      presets: [presetUno(), presetAttributify()],
      shortcuts: [
        ['flex-center', 'flex items-center justify-center'],
        ['flex-row-between', 'flex items-center justify-between'],
        ['flex-start', 'flex items-center justify-start'],
        ['flex-end', 'flex items-center justify-end'],
        ['flex-col', 'flex flex-col'],
        ['red', 'text-red-500'],
        ['uno_prefix1', "font-bold flex items-center before:content-[''] before:inline-block before:w-6px before:h-16px before:bg-[#1366F0] before:rounded-full before:mr-1 "],

        // base
        ['uno-btn0-base', 'box-border |   rounded-md px-4px py-2px   |   text-center cursor-pointer   |   border-0   '],
        // 按钮 2实体 1边框线  3文字
        // 蓝色
        ['uno-btn1-blue', 'text-13px bg-blue-600 text-gray-100  | uno-btn0-base'],
        ['uno-btn2-blue', 'text-13px bg-gray-100 text-blue-600  | uno-btn0-base  | border-solid border-1 border-blue-600  '],
        ['uno-btn3-blue', 'text-13px bg-gray-100 text-blue-600  | uno-btn0-base'],

        // 灰色
        ['uno-btn1-gray', 'text-14px bg-gray-100 text-gray-600  | uno-btn0-base  | border-solid border-1 border-gray-600  '],
        ['uno-btn2-gray', 'text-14px bg-gray-600 text-white-100 | uno-btn0-base'],
        ['uno-btn3-gray', 'text-14px bg-gray-100 text-gray-700  | uno-btn0-base'],
        ['uno-btn4-gray', 'text-14px bg-gray-100 text-gray-400  | uno-btn0-base'],
      ],
      rules: [
        ['uno_btn', { padding: '0.5rem 1rem', 'border-radius': '0.25rem', 'background-color': '#3490dc', color: '#fff' }],
        ['btn-primary', { 'background-color': '#1c3d5a' }],
        ['uno_card0', { overflow: 'hidden', border: '1px solid #e4e7ed', 'border-radius': '12px', 'box-sizing': 'border-box', 'box-shadow': '0px 0px 8px rgba(0,0,0,0.12)' }],
        ['uno_card1', { overflow: 'hidden', border: '1px solid #e4e7ed', 'border-radius': '12px', 'box-sizing': 'border-box', 'box-shadow': '0px 0px 8px rgba(0,0,0,0.12)' }],
        ['uno_card2', { overflow: 'hidden', border: '1px solid #e4e7ed', 'border-radius': '12px', 'box-sizing': 'border-box', 'box-shadow': '0px 0px 8px rgba(0,0,0,0.12)' }],

        // 添加图标规则 <span class="icon-love !bg-red-500"></span>
        // https://www.iconfont.cn/search/index?searchType=icon&q=爱心
        [
          /^icon-(.+)$/,
          ([, name]) => {
            return {
              display: 'inline-block',
              'vertical-align': 'middle',
              'min-width': '1.25rem',
              'min-height': '1.25rem',
              'mask-size': 'contain',
              'mask-repeat': 'no-repeat',
              'mask-position': 'center',
              'background-color': 'black',
              // "background-color": "transparent",
              'mask-image': `url("@/components/icon/${name}.svg")`,
              // "background-image": `url('/src/components/icon/${name}.svg')`,
            }
          },
        ],
      ],
    }),
  ],

  // optimizeDeps: {
  //   exclude: ['class-transformer', 'class-validator', '@nestjs/mapped-types', '@nestjs/common', '@nestjs/core', 'class-transformer/storage', 'tool_my', 'tool_orm_Drizzle1', 'validator'],
  //   include: ['vue', 'vue-router', 'element-plus', 'pinia'],
  // },

  // define: {
  //   global: 'globalThis',
  // },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      back1: path.resolve(__dirname, '../back1/src'),
    },
  },

  // build: {
  //   rollupOptions: {
  //     external: ['class-transformer', 'class-validator', '@nestjs/mapped-types', '@nestjs/common', '@nestjs/core', 'tool_my', 'tool_orm_Drizzle1', 'validator'],
  //   },
  // },

  server: {
    host: '127.0.0.1',
    port: 4001,
    open: true,
  },
})
