<template>
  <div>11111111111</div>
</template>
<script setup lang="tsx">
import { onMounted } from 'vue'
// 使用 package.json exports 配置的简化导入方式
import { api_v1 } from 'back1/dist_tool_v1_api'
// 或者直接使用主入口
// import { api_v1 } from 'back1'

onMounted(async () => {
  const result = await api_v1.auth.login({ phone: '15160315110', password: '123456' })
  console.log(result)
})
// import { my_add } from 'back1/dist_tool_v1_api'
// import { login } from 'back1/dist_tool_v1_api'
// console.log(my_add(1, 2))

// import type { login_type } from 'tool_typeorm'
// import { my_add } from 'tool_typeorm'
// console.log(my_add(1, 2))
</script>
<style scoped></style>
