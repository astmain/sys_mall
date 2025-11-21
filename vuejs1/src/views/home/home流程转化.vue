<template>
  <VueFlow v-model:nodes="nodes" v-model:edges="edges">
    <template #node-type1="props">
      <Node_type1 :id="props.id" :data="props.data" />
    </template>
    <template #node-type2="props">
      <Node_type2 :id="props.id" :data="props.data" />
    </template>

    <template #node-type3="props">
      <Node_type3 :id="props.id" :data="props.data" />
    </template>
  </VueFlow>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue"
import { ElMessage } from "element-plus"
import { VueFlow, useVueFlow } from "@vue-flow/core"
import { Background } from "@vue-flow/background" //   pnpm i @vue-flow/background
import Node_type1 from "./Node_type1.vue"
import Node_type2 from "./Node_type2.vue"
import Node_type3 from "./Node_type3.vue"

// 基础数据
let tree_menu = ref([
  {
    id: "menu_1",
    name: "首页",
    path: "/home",
    remark: null,
    parent_id: null,
    is_all: false,
    type: "menu",
    children: [
      { id: "home_1", type: "button", name: "查看", remark: "" },
      { id: "home_2", type: "button", name: "删除", remark: "" },
    ],
  },
  {
    id: "menu_2",
    name: "商城管理",
    path: "/shop",
    remark: null,
    parent_id: null,
    is_all: false,
    type: "menu",
    children: [
      {
        id: "sub_2001",
        name: "订单管理",
        path: "/shop/order",
        remark: null,
        parent_id: "menu_2",
        is_all: false,
        type: "menu",
        children: [
          { id: "order_1", type: "button", name: "查看", remark: "" },
          { id: "order_2", type: "button", name: "删除", remark: "" },
        ],
      },
      {
        id: "sub_2002",
        name: "商品管理",
        path: "/shop/product",
        remark: null,
        parent_id: "menu_2",
        is_all: false,
        type: "menu",
        children: [
          { id: "product_1", type: "button", name: "查看", remark: "" },
          { id: "product_2", type: "button", name: "删除", remark: "" },
        ],
      },
    ],
  },
])

// 响应式数据
const nodes = ref<any[]>([])
const edges = ref<any[]>([])

// 监听tree_menu变化，自动更新nodes和edges
const updateFlow = () => {
  let node_list: any[] = []
  let edge_list: any[] = []
  let post_y = 0

  // 第一层
  for (let i = 0; i < tree_menu.value.length; i++) {
    const item = tree_menu.value[i]
    post_y = post_y + i * 80
    node_list.push({
      id: item.id,
      name: item.name,
      type: "type1",
      position: { x: 0, y: post_y },
      data: { name: item.name, type: item.type },
    })

    // 第二层
    if (item.children && item.children.length > 0) {
      for (let j = 0; j < item.children.length; j++) {
        const child = item.children[j]!
        post_y = post_y + j * 80
        node_list.push({
          id: child.id,
          name: child.name,
          type: "type1",
          position: { x: 300, y: post_y },
          data: { name: child.name, type: child.type },
        })

        // 第三层
        if ('children' in child && child.children && child.children.length > 0) {
          for (let k = 0; k < child.children.length; k++) {
            const grandchild = child.children[k]!
            console.log("grandchild", grandchild.id)
            post_y = post_y + k * 80
            node_list.push({
              id: grandchild.id,
              name: grandchild.name,
              type: "type1",
              position: { x: 600, y: post_y },
              data: { name: grandchild.name, type: grandchild.type },
            })
          }
        }
      }
    }
  }

  nodes.value = node_list
  edges.value = edge_list
}

// 组件挂载时初始化
onMounted(() => {
  updateFlow()
})
</script>

<style>
@import "@vue-flow/core/dist/style.css";
@import "@vue-flow/core/dist/theme-default.css";
@import "@vue-flow/controls/dist/style.css";
</style>

<style>
.vue-flow__handle {
  background-color: #2563eb;
  width: 8px;
  height: 18px;
  border-radius: 4px;
}
</style>
