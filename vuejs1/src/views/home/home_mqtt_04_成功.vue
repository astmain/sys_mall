<template>
  <div class="mqtt_container">
    <el-button type="primary" @click="client_init()">client_init</el-button>

    <div class="flex">
      <el-button type="primary" @click="client_send()">client_send</el-button>
      <el-input v-model="msg" placeholder="请输入消息" />
    </div>

    <iframe src="http://192.168.0.250:18083/#/websocket" frameborder="0" width="100%" height="500px"></iframe>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted } from "vue"
import { ElMessage } from "element-plus"
import mqtt from "mqtt"
let client: any = null

let msg = ref<string>("")

function client_init() {
  const host = "192.168.0.250"
  const port = "8083"
  const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
  console.log(`clientId:'${clientId}'`)

  // const connectUrl = `ws://192.168.0.250:8083/mqtt`
  const connectUrl = `ws://103.119.2.223:8083/mqtt`

  // const connectUrl = `ws://192.168.0.250:8083/mqtt`
  client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: "emqx",
    password: "public",
    reconnectPeriod: 1000,
  })

  // const topic = '/nodejs/mqtt'
  const topic = "testtopic/1"
  client.on("connect", () => {
    console.log("连接到服务端")
    client.subscribe([topic], () => {
      console.log(`订阅频道 '${topic}'`)
    })
    // client.publish(topic, "nodejs mqtt test", { qos: 0, retain: false }, (error: any) => {
    //   if (error) {
    //     console.error(error)
    //   }
    // })
  })
  client.on("error", (err: any) => {
    console.error("MQTT 客户端错误:", err)
  })
  client.on("offline", () => {
    console.log("客户端离线")
  })
  client.on("message", (topic: any, payload: any, arg: any) => {
    console.log("🟩收到消息")
    console.log("topic:", topic)
    console.log("payload:", payload.toString())
    console.log("arg:", arg)
  })
}

// 客户端发送消息
function client_send() {
  let msg_str = JSON.stringify(msg.value)
  client.publish("testtopic/1", msg_str, { qos: 0, retain: false }, (error: any) => {
    if (error) {
      console.error(error)
    } else {
      console.error("🟦发送成功", msg_str)
    }
  })
}

onMounted(() => {
  client_init()
})
</script>

<style scoped></style>
