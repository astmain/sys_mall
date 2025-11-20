<script setup>
import { Handle, Position, useVueFlow } from "@vue-flow/core"

const props = defineProps(["id", "data"])
</script>

<template>
  <div style="width: 200px; height: 50px; border: 1px solid #000; border-radius: 10px">{{ data.name }}</div>
  <Handle type="target" id="Left" :position="Position.Left" />
  <Handle type="source" id="Right" :position="Position.Right" />
  <!-- <Handle type="target" id="Bottom" :position="Position.Bottom" /> -->
  <!-- <Handle type="target" id="Top" :position="Position.Top" /> -->
</template>




