<script setup lang="ts">
import { provide, ref, watch } from "vue"
import { isEqual } from "lodash-es"

interface Props {
  modelValue?: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  "update:modelValue": [value: any]
  change: [value: any]
}>()

const current_value = ref(props.modelValue)

watch(
  () => props.modelValue,
  (new_val) => {
    current_value.value = new_val
  },
  { immediate: true, deep: true }
)

function set_value(value: any) {
  current_value.value = value
  emit("update:modelValue", value)
  emit("change", value)
}

function is_selected(value: any) {
  const cv = current_value.value
  return isEqual(cv, value)
}

provide("c_radio", {
  current_value,
  set_value,
  is_selected,
})

defineExpose({
  value: current_value,
})
</script>

<template>
  <div class="c_radio_group">
    <slot></slot>
  </div>
</template>

<style scoped>
.c_radio_group {
  display: inline-flex;
  gap: 8px;
}
</style>
