<template>
  <div>
    <h1>http://192.168.0.250:18083/ admin/Dayu_1688</h1>
    <el-button @click="test1()">test1</el-button>
  </div>
</template>

<script setup lang="tsx">
import { ref } from "vue"
import { ElMessage } from "element-plus"
import mqtt from "mqtt"

async function test1() {
  const host = "192.168.0.250"
  const port = "1883"
  const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
  console.log(`clientId:'${clientId}'`)

  const connectUrl = `mqtt://${host}:${port}`
  const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: "emqx",
    password: "public",
    reconnectPeriod: 1000,
  })

  const topic = "/nodejs/mqtt"
  client.on("connect", () => {
    console.log("连接到服务端")
    client.subscribe([topic], () => {
      console.log(`订阅频道 '${topic}'`)
    })
    client.publish(topic, "nodejs mqtt test", { qos: 0, retain: false }, (error) => {
      if (error) {
        console.error(error)
      }
    })
  })
  client.on("error", (err) => {
    console.error("MQTT 客户端错误:", err)
  })
  client.on("offline", () => {
    console.log("客户端离线")
  })
  client.on("message", (topic, payload) => {
    console.log("收到消息:", topic, payload.toString())
  })
}
</script>
