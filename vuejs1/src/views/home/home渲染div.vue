<template>
  <div>
    <div>
      <render />
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { ref, reactive } from "vue"
import { ElMessage } from "element-plus"

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

let render = () => {
  return (
    <>
      <div class="desc_item flex flex-col" style="dispaly:flex;flex-direction: column">
        {tree_menu.value.map((o1) => {
          return (
            <div style="display:flex">
              <div style="width:200px;height:50px"> {o1.name} </div>
              <div>
                {o1.children.map((o2: any) => {
                  return o2.type === "menu" ? (
                    <div style="height:50px ;" class="flex gap-2">
                      <div> {o2.name}</div>
                      <div class="flex gap-2">
                        {o2?.children.map((o3: any) => {
                          return <span style="">{o3.name}</span>
                        })}
                      </div>
                    </div>
                  ) : (
                    <span style="margin-right:10px">{o2.name}</span>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
</script>

<style>
.desc_item {
  border: 0.5px solid #e5e5e5;
  min-height: 40px;
  min-width: 100px;
}
</style>
