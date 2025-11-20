<template>
  <div>
    <el-tree class="tree_menu" ref="TreeMenuRef" style="width: 100%; height: auto; overflow: auto" :data="tree_menu" :props="{ label: 'name' }" node-key="id" highlight-current :expand-on-click-node="false" :default-expand-all="true">
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
      {
        id: "home_buttons",
        type: "button_group",
        name: "操作按钮",
        remark: "",
        buttons: [
          { id: "home_1", type: "button", name: "查看", remark: "" },
          { id: "home_2", type: "button", name: "删除", remark: "" },
        ],
      },
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
          {
            id: "order_buttons",
            type: "button_group",
            name: "操作按钮",
            remark: "",
            buttons: [
              { id: "order_1", type: "button", name: "查看", remark: "" },
              { id: "order_2", type: "button", name: "删除", remark: "" },
            ],
          },
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
          {
            id: "product_buttons",
            type: "button_group",
            name: "操作按钮",
            remark: "",
            buttons: [
              { id: "product_1", type: "button", name: "查看", remark: "" },
              { id: "product_2", type: "button", name: "删除", remark: "" },
            ],
          },
        ],
      },
    ],
  },
])
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
