<template>
  <div>
    <el-tree
      show-checkbox
      class="tree_menu"
      ref="TreeMenuRef"
      style="width: 100%; height: auto; overflow: auto"
      :data="tree_menu"
      :props="{ label: 'name' }"
      node-key="id"
      highlight-current
      :expand-on-click-node="false"
      :default-expand-all="false"
      @node-expand="handle_node_expand"
      @node-collapse="handle_node_collapse"
    >
      <template #default="{ node, data }">
        <div :class="data.id + ' ' + data.type">{{ data.name }} + {{ node.expanded }}</div>
      </template>
    </el-tree>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"

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

// 树组件引用
const TreeMenuRef = ref()

// 监听节点展开/折叠事件
const handle_node_expand = (data, node, instance) => {
  console.log("节点展开:", data.name, "expanded:", node.expanded, "instance:", instance)
  if (data.type === "menu") {
    setTimeout(() => {
      document.querySelectorAll(" .el-tree-node__children:has(.button):not(.menu)").forEach((item) => {
        item.style.display = "flex"
      })
      document.querySelectorAll(" .el-tree-node__children:has(.menu)").forEach((item) => {
        item.style.display = ""
      })
    }, 100)
  }
}

const handle_node_collapse = (data, node, instance) => {
  console.log("节点折叠:", data.name, "expanded:", node.expanded, "instance:", instance)
}

// 组件挂载后设置初始状态
</script>
<style>
/* .el-tree-node__children:has(.ok_button) {
  display: flex !important;
}

.el-tree-node__children:has(.no_button) {
  display: block !important;
} */
</style>
