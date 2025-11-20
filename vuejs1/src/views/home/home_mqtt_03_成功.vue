<template>
  <div class="mqtt_container">
    <el-button type="primary" @click="test1()">test1</el-button>

    <iframe src="http://192.168.0.250:18083/#/websocket" frameborder="0" width="100%" height="500px"></iframe>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue"
import { ElMessage } from "element-plus"
import mqtt from "mqtt"

function test1() {
  const connectUrl = `ws://192.168.0.250:8083/mqtt`
  const clientId = `clientId_${Math.random().toString(16).slice(3)}`
  console.log(`clientId:'${clientId}'`)

  // 添加 WebSocket 端点路径，常见的有 /mqtt, /ws, /mqtt/ws

  const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000, // 可以增加到 10000 看看
    username: "emqx",
    password: "public",
    reconnectPeriod: 1000,
  })

  const topic = "testtopic/1"
  client.on("connect", () => {
    console.log("连接到服务端")
    client.subscribe([topic], () => {
      console.log(`订阅频道 '${topic}'`)
    })
    client.publish(topic, "nodejs mqtt test", { qos: 0, retain: false }, (error: any) => {
      if (error) {
        console.error(error)
      }
    })
  })
  client.on("error", (err: any) => {
    console.error("MQTT 客户端错误:", err)
    ElMessage.error(`连接失败: ${err.message}`)
  })
  client.on("offline", () => {
    console.log("客户端离线")
  })
  client.on("message", (topic: any, payload: any) => {
    console.log("收到消息:", topic, payload.toString())
  })
}
</script>

<style scoped></style>
