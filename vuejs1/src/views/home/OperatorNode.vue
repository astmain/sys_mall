<script setup>
import { Handle, Position, useVueFlow } from "@vue-flow/core"

const props = defineProps(["id", "data"])

const operators = ["+", "-", "*", "/"]

const { updateNodeData } = useVueFlow()
</script>

<template>
  <div class="buttons nodrag"></div>

  <Handle type="source" :position="Position.Right" :connectable="false" />
  <Handle id="target-a" type="target" :position="Position.Left" :connectable="false" />
  <Handle id="target-b" type="target" :position="Position.Left" :connectable="false" />
</template>
