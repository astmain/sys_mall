<template>
  <div>
    <el-tree show-checkbox class="tree_menu" ref="TreeMenuRef" style="width: 100%; height: auto; overflow: auto" :data="tree_menu" :props="{ label: 'name' }" node-key="id" highlight-current :expand-on-click-node="false" :default-expand-all="true">
      <template #default="{ node, data }">
        <div :class="data.type === 'button' ? 'ok_button' : 'no_button'">
          {{ data.name }}
        </div>
      </template>
    </el-tree>
  </div>
</template>

<script setup>
import { ref } from "vue"

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
</script>
<style>
.el-tree-node__children:has(.ok_button) {
  display: flex !important;
}

.el-tree-node__children:has(.no_button) {
  display: block !important;
}
</style>
