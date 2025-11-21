<template>
  <el-select v-model="select_value" placeholder="Select" multiple value-key="value">
    <template #label="item">
      <span>{{ item.value.label }}</span>
    </template>
    <el-option v-for="item in options" :label="item.label" :value="item" />
  </el-select>

  <el-button @click="test_print">打印</el-button>
</template>

<script lang="tsx" setup>
import { ref } from "vue"

const select_value = ref<{ value: string; label: string }[]>([
  {
    value: "Option1",
    label: "Label1",
  },
])

const options = [
  {
    value: "Option1",
    label: "Label1",
  },
  {
    value: "Option2",
    label: "Label2",
  },
  {
    value: "Option3",
    label: "Label3",
  },
  {
    value: "Option4",
    label: "Label4",
  },
  {
    value: "Option5",
    label: "Label5",
  },
]

function test_print() {
  console.log(select_value.value)
}
</script>

<style scoped></style>
