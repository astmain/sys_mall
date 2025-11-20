<template>
  <div v-show="visible" class="context-menu-container" :style="{ left: position.x + 'px', top: position.y + 'px' }" @contextmenu.prevent>
    <div class="context-menu">
      <div v-for="(item, idx) in menu_list" :key="idx" class="menu-item" @click="item.click(item)">
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { ref, defineProps, defineEmits, defineExpose, onMounted, onBeforeUnmount } from "vue"



const props = defineProps<{
  menu_list: any[]
}>()

const emit = defineEmits(["menu-click"])

const visible = ref(false)
const position = ref({ x: 0, y: 0 })

function show_menu(event: MouseEvent) {
  event.preventDefault()
  position.value = { x: event.clientX, y: event.clientY }
  visible.value = true
}

function hide_menu() {
  visible.value = false
}


onMounted(() => {
  window.addEventListener("click", () => {
    visible.value = false
  })
})
// onBeforeUnmount(() => {
//   window.removeEventListener('click', handle_global_click)
// })

defineExpose({
  show_menu,
  hide_menu,
})
</script>

<style scoped>
.context-menu-container {
  position: fixed;
  z-index: 1000;
  pointer-events: auto;
}
.context-menu {
  min-width: 120px;
  padding: 4px 0;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.menu-item {
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  color: #606266;
  transition: background-color 0.2s;
}
.menu-item:hover {
  background-color: #f5f7fa;
  color: #409eff;
}
</style>
