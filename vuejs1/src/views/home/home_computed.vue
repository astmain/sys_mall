<template>
  <div>
    <el-tree class="tree_menu" ref="TreeMenuRef" style="width: 100%; height: auto; overflow: auto" :data="processed_tree_menu" :props="{ label: 'name' }" node-key="id" highlight-current :expand-on-click-node="false" :default-expand-all="true">
      <template #default="{ node, data }">
        <div v-if="data.type === 'button_group'" class="button-group">
          <el-button v-for="button in data.buttons" :key="button.id" size="small" type="primary" style="margin-right: 8px">
            {{ button.name }}
          </el-button>
        </div>
        <span v-else>{{ data.name }}</span>
      </template>
    </el-tree>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"

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

// 处理原始数据，将同一级的按钮合并为按钮组
const processed_tree_menu = computed(() => {
  const processNode = (node) => {
    if (!node.children) return node

    const processedChildren = []
    let buttonGroup = null

    for (const child of node.children) {
      if (child.type === "button") {
        if (!buttonGroup) {
          buttonGroup = {
            id: `${node.id}_buttons`,
            type: "button_group",
            name: "操作按钮",
            remark: "",
            buttons: [],
          }
        }
        buttonGroup.buttons.push(child)
      } else {
        // 如果之前有按钮组，先添加按钮组
        if (buttonGroup) {
          processedChildren.push(buttonGroup)
          buttonGroup = null
        }
        // 递归处理子节点
        processedChildren.push(processNode(child))
      }
    }

    // 如果最后还有按钮组，添加它
    if (buttonGroup) {
      processedChildren.push(buttonGroup)
    }

    return {
      ...node,
      children: processedChildren,
    }
  }

  return tree_menu.value.map(processNode)
})
</script>

<style>
.desc_item {
  border: 0.5px solid #e5e5e5;
  min-height: 40px;
  min-width: 100px;
}

.button-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.tree_menu .el-tree-node__content {
  height: auto;
  min-height: 32px;
}

.tree_menu .el-tree-node__label {
  width: 100%;
}
</style>
