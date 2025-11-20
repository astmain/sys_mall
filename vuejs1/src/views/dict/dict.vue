<template>
  <div class="flex gap-5">
    <!-- 左侧树形结构 -->
    <div class="uno_card1 min-w-200px p-4">
      <nav>
        <el-button size="small" type="primary" @click="find_list_dict"> 查询 </el-button>
        <el-button size="small" type="primary" @click="save_dict('新增字典父级')"> 新增 </el-button>
      </nav>
      <!-- 父级字典列表 -->
      <el-radio-group v-model="active" class="flex-col !items-start">
        <el-dropdown v-for="item in list_dict_parent" placement="bottom-start" trigger="contextmenu" @visible-change="(visible) => handle_click_parent(item.id)">
          <el-radio :value="item.id" @click="handle_click_parent(item.id)">
            {{ item.name }}
          </el-radio>
          <template #dropdown>
            <el-dropdown-menu>
              <div class="flex gap-4 p-2">
                <el-button plain type="primary" @click="save_dict('编辑字典父级')">编辑</el-button>
                <el-button plain type="" @click="() => remove_dict_ids([item.id])">删除</el-button>
              </div>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-radio-group>
    </div>
    <!-- 子级字典列表 -->
    <div class="uno_card1 flex-1 p-4">
      <nav class="flex flex-col gap-2">
        <div class="flex gap-2">
          <el-input v-model="curr_parent.name" disabled>
            <template #prepend>名称</template>
          </el-input>

          <el-input v-model="curr_parent.code" disabled>
            <template #prepend>编码</template>
          </el-input>

          <el-button type="primary" @click="save_dict('新增字典子级')">新增</el-button>
        </div>

        <el-table :data="curr_parent.children" border show-overflow-tooltip stripe>
          <el-table-column prop="name" label="名称" width="150" />
          <el-table-column prop="code" label="编码" width="150" />
          <el-table-column prop="remark" label="备注" />
          <el-table-column prop="status" label="状态" />
          <el-table-column prop="css" label="样式" width="200px" />
          <el-table-column prop="sort" label="排序" width="60px" />
          <el-table-column prop="sort" label="操作" fixed="right" width="110">
            <template #default="scope">
              <el-button link type="primary" @click="() => ((curr_child = scope.row), save_dict('编辑字典子级'))">编辑</el-button>
              <el-button link type="info" @click="remove_dict_ids([scope.row.id])">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </nav>
    </div>

    <com_dialog_dict ref="ref_com_dialog_dict" />
  </div>
</template>

<script setup lang="tsx">
import { ref, onMounted } from "vue"
import { api_v1} from "@/api_v1"
import { ElMessage } from "element-plus"
import { plugin_confirm } from "@/plugins/plugin_confirm"
import com_dialog_dict from "./com_dialog_dict.vue"
let ref_com_dialog_dict = ref()

// 🟩 参数变量
let active = ref(null as any)
let list_dict_parent = $ref([] as any[])
let curr_parent = $ref({ name: "", code: "", remark: "", status: true, sort: 0, children: [] as any } as any)
let curr_child = $ref({} as any)

// 🟩查询字典列表
async function find_list_dict() {
  const res: any = await api_v1.dict.find_list_dict({ parent_id: undefined })
  console.log(`find_list_dict---res:`, res)
  if (res.code !== 200) return ElMessage.error(res.msg)
  list_dict_parent = res.result.dict_list
}

// 🟩 删除字典
async function remove_dict_ids(ids: string[]) {
  if (!(await plugin_confirm())) return
  let res: any = await api_v1.dict.remove_dict_ids({ ids })
  if (res.code !== 200) return ElMessage.error("失败:删除")
  ElMessage.success("成功:删除")
  await find_list_dict()
}

// 🟩保存字典
async function save_dict(title: string) {
  let ctx = ref_com_dialog_dict.value
  // debugger
  console.log(`save_dict---ctx:`, ctx)
  ctx.open({ title })

  if (title === "新增字典父级") {
  }
  if (title === "新增字典子级") {
    ctx.form.parent_id = curr_parent.id
  }

  if (title === "编辑字典父级") {
    ctx.form = {
      parent_id: null, //
      id: curr_parent.id, //
      name: curr_parent.name,
      code: curr_parent.code,
      status: curr_parent.status,
      remark: curr_parent.remark,
      css: curr_parent.css,
      sort: curr_parent.sort,
    }
  }

  if (title === "编辑字典子级") {
    ctx.form = {
      parent_id: curr_parent.id, //
      id: curr_child.id, //
      name: curr_child.name,
      code: curr_child.code,
      status: curr_child.status,
      remark: curr_child.remark,
      css: curr_child.css,
      sort: curr_child.sort,
    }
  }

  ctx.callback = async () => {
    let form = ctx.form
    console.log(`111---save_dict---callback---form:`, form)
    // debugger
    let res: any = await api_v1.dict.save_dict(form)
    if (res.code !== 200) return ElMessage.error(res.msg)
    ElMessage.success(res.msg)
    await find_list_dict()
    handle_click_parent(curr_parent.id)
  }
}

// 🟩 点击父级节点
async function handle_click_parent(id: string) {
  console.log(`111---handle_click_parent---id:`, id)
  active.value = id
  curr_parent = list_dict_parent.find((item: any) => item.id === id)
}

onMounted(async () => {
  await find_list_dict() //初始化时,先查询字典列表 ,赋值list_dict_parent
  curr_parent = list_dict_parent.at(0) //然后取第一个父级节点
  active.value = curr_parent.id //然后赋值active
})
</script>

<style>
.el-radio__inner {
  display: none !important; /* 使圆点消失 */
}
</style>
