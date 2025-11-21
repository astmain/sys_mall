<script setup lang="ts">
import { computed, inject } from "vue"

interface Props {
  label?: string | number | boolean
  value?: any
}

const props = defineProps<Props>()

const radio_context = inject<{
  current_value: any
  set_value: (val: any) => void
  is_selected: (val: any) => boolean
}>("c_radio", null as any)

const radio_value = computed(() => {
  return props.value
})

// 关键修改：直接访问 current_value 来建立响应式依赖
const is_checked = computed(() => {
  if (!radio_context) return false
  const val = radio_value.value
  // 使用父组件提供的 is_selected 方法，它使用 lodash isEqual 进行深度比较
  // 比 JSON.stringify 更可靠，能正确处理属性顺序不同的对象
  return radio_context.is_selected(val)
})

function handle_click() {
  radio_context?.set_value(radio_value.value)
}
</script>

<template>
  <div :class="['c_radio_item', { is_checked: is_checked }]" @click="handle_click">
    <div class="c_radio_item__radio">
      <div v-if="is_checked" class="c_radio_item__radio_dot"></div>
    </div>
    <div class="c_radio_item__label">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.c_radio_item {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  gap: 6px;
}

.c_radio_item__radio {
  position: relative;
  width: 16px;
  height: 16px;
  border: 1px solid #dcdfe6;
  border-radius: 50%;
  background-color: #fff;
}

.c_radio_item__radio_dot {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background-color: #409eff;
  border-radius: 50%;
}

.c_radio_item__label {
  color: #606266;
  font-size: 14px;
}

.is_checked .c_radio_item__radio {
  border-color: #409eff;
}
</style>
