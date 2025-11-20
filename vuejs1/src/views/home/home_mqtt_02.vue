<template>
  <div class="mqtt_container">
    <h1>MQTT 客户端测试</h1>
    <div class="mqtt_info">服务器: http://192.168.0.250:18083/ admin/Dayu_1688</div>

    <el-card class="mqtt_card">
      <template #header>
        <div class="card_header">连接配置</div>
      </template>
      <el-form :model="connection" label-width="100px">
        <el-form-item label="协议">
          <el-select v-model="connection.protocol">
            <el-option label="ws" value="ws" />
            <el-option label="wss" value="wss" />
            <el-option label="mqtt" value="mqtt" />
            <el-option label="mqtts" value="mqtts" />
          </el-select>
        </el-form-item>
        <el-form-item label="主机">
          <el-input v-model="connection.host" />
        </el-form-item>
        <el-form-item label="端口">
          <el-input-number v-model="connection.port" :min="1" :max="65535" />
        </el-form-item>
        <el-form-item label="端点">
          <el-input v-model="connection.endpoint" />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="connection.username" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="connection.password" type="password" />
        </el-form-item>
        <el-form-item>
          <el-button v-if="!client_connected && !connecting" type="primary" @click="create_connection"> 连接 </el-button>
          <el-button v-if="client_connected" type="danger" @click="destroy_connection"> 断开连接 </el-button>
          <el-button v-if="connecting" disabled>连接中...</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="mqtt_card">
      <template #header>
        <div class="card_header">订阅配置</div>
      </template>
      <el-form :model="subscription" label-width="100px">
        <el-form-item label="主题">
          <el-input v-model="subscription.topic" />
        </el-form-item>
        <el-form-item label="QoS">
          <el-select v-model="subscription.qos">
            <el-option v-for="qos in qos_list" :key="qos" :label="qos" :value="qos" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="success" :disabled="!client_connected || subscribe_success" @click="do_subscribe"> 订阅 </el-button>
          <el-button type="warning" :disabled="!client_connected || !subscribe_success" @click="do_unsubscribe"> 取消订阅 </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="mqtt_card">
      <template #header>
        <div class="card_header">发布消息</div>
      </template>
      <el-form :model="publish" label-width="100px">
        <el-form-item label="主题">
          <el-input v-model="publish.topic" />
        </el-form-item>
        <el-form-item label="消息">
          <el-input v-model="publish.payload" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="QoS">
          <el-select v-model="publish.qos">
            <el-option v-for="qos in qos_list" :key="qos" :label="qos" :value="qos" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="!client_connected" @click="do_publish"> 发布 </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="mqtt_card">
      <template #header>
        <div class="card_header">接收消息</div>
      </template>
      <div class="receive_area">
        <div v-for="(msg, index) in receive_messages" :key="index" class="message_item">
          <div class="message_time">{{ msg.time }}</div>
          <div class="message_topic">主题: {{ msg.topic }}</div>
          <div class="message_content">{{ msg.content }}</div>
        </div>
        <div v-if="receive_messages.length === 0" class="empty_message">暂无消息</div>
      </div>
      <el-button style="margin-top: 10px" @click="clear_messages">清空消息</el-button>
    </el-card>

    <div class="status_info">
      <div>
        连接状态: <span :class="client_connected ? 'status_connected' : 'status_disconnected'">{{ client_connected ? "已连接" : "未连接" }}</span>
      </div>
      <div>
        订阅状态: <span :class="subscribe_success ? 'status_connected' : 'status_disconnected'">{{ subscribe_success ? "已订阅" : "未订阅" }}</span>
      </div>
      <div>重试次数: {{ retry_times }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue"
import { ElMessage } from "element-plus"
import mqtt from "mqtt"
import type { MqttClient } from "mqtt"

const connection = ref({
  protocol: "mqtt",
  host: "192.168.0.250",
  // port: 1883,
  port: 18083,
  endpoint: "",
  username: "emqx",
  password: "public",
  clean: true,
  connect_timeout: 30 * 1000,
  reconnect_period: 4000,
})

const subscription = ref({
  topic: "/nodejs/mqtt",
  qos: 0 as 0 | 1 | 2,
})

const publish = ref({
  topic: "/nodejs/mqtt",
  qos: 0 as 0 | 1 | 2,
  payload: '{ "msg": "Hello, I am browser." }',
})

const client = ref<MqttClient | null>(null)
const client_connected = ref(false)
const connecting = ref(false)
const subscribe_success = ref(false)
const retry_times = ref(0)
const receive_messages = ref<Array<{ topic: string; content: string; time: string }>>([])
const qos_list = [0, 1, 2]

function init_data() {
  client.value = null
  client_connected.value = false
  connecting.value = false
  subscribe_success.value = false
  retry_times.value = 0
}

function handle_reconnect() {
  retry_times.value += 1
  if (retry_times.value > 5) {
    try {
      if (client.value) {
        client.value.end()
      }
      init_data()
      ElMessage.error("重连次数超过限制，停止重试")
    } catch (error) {
      ElMessage.error(error?.toString() || "未知错误")
    }
  }
}

function create_connection() {
  try {
    connecting.value = true
    const { protocol, host, port, endpoint, username, password, clean, connect_timeout, reconnect_period } = connection.value

    let connect_url = ""
    if (protocol === "ws" || protocol === "wss") {
      connect_url = `${protocol}://${host}:${port}${endpoint}`
    } else {
      connect_url = `${protocol}://${host}:${port}`
    }

    const options = {
      clean,
      connectTimeout: connect_timeout,
      reconnectPeriod: reconnect_period,
      clientId: `emqx_vue_${Math.random().toString(16).substring(2, 8)}`,
      username,
      password,
    }

    client.value = mqtt.connect(connect_url, options)

    if (client.value && client.value.on) {
      client.value.on("connect", () => {
        connecting.value = false
        client_connected.value = true
        retry_times.value = 0
        ElMessage.success("连接成功!")
        console.log("连接成功!")
      })

      client.value.on("reconnect", () => {
        handle_reconnect()
        console.log("重连中...")
      })

      client.value.on("error", (error) => {
        connecting.value = false
        client_connected.value = false
        ElMessage.error(`连接失败: ${error}`)
        console.log("连接失败", error)
      })

      client.value.on("offline", () => {
        client_connected.value = false
        console.log("客户端离线")
      })

      client.value.on("message", (topic, message) => {
        const time_str = new Date().toLocaleString()
        receive_messages.value.push({
          topic: topic.toString(),
          content: message.toString(),
          time: time_str,
        })
        console.log(`收到消息 ${message} 来自主题 ${topic}`)
      })
    }
  } catch (error) {
    connecting.value = false
    ElMessage.error(`连接错误: ${error}`)
    console.log("mqtt.connect 错误", error)
  }
}

function do_subscribe() {
  if (!client.value || !client_connected.value) {
    ElMessage.warning("请先连接MQTT服务器")
    return
  }

  const { topic, qos } = subscription.value
  client.value.subscribe(topic, { qos }, (error, res) => {
    if (error) {
      ElMessage.error(`订阅失败: ${error}`)
      console.log("订阅主题错误", error)
      return
    }
    subscribe_success.value = true
    ElMessage.success("订阅成功!")
    console.log("订阅主题成功", res)
  })
}

function do_unsubscribe() {
  if (!client.value || !client_connected.value) {
    return
  }

  const { topic } = subscription.value
  client.value.unsubscribe(topic, (error) => {
    if (error) {
      ElMessage.error(`取消订阅失败: ${error}`)
      console.log("取消订阅错误", error)
      return
    }
    subscribe_success.value = false
    ElMessage.success("取消订阅成功!")
    console.log("取消订阅成功")
  })
}

function do_publish() {
  if (!client.value || !client_connected.value) {
    ElMessage.warning("请先连接MQTT服务器")
    return
  }

  const { topic, qos, payload } = publish.value
  client.value.publish(topic, payload, { qos }, (error) => {
    if (error) {
      ElMessage.error(`发布失败: ${error}`)
      console.log("发布错误", error)
      return
    }
    ElMessage.success("发布成功!")
    console.log("发布成功")
  })
}

function destroy_connection() {
  if (client.value && client_connected.value) {
    try {
      client.value.end(false, () => {
        init_data()
        ElMessage.success("断开连接成功!")
        console.log("断开连接成功!")
      })
    } catch (error) {
      ElMessage.error(`断开连接失败: ${error}`)
      console.log("断开连接失败", error?.toString())
    }
  }
}

function clear_messages() {
  receive_messages.value = []
}

onBeforeUnmount(() => {
  destroy_connection()
})
</script>

<style scoped>
.mqtt_container {
  padding: 20px;
}

.mqtt_info {
  margin-bottom: 20px;
  color: #666;
}

.mqtt_card {
  margin-bottom: 20px;
}

.card_header {
  font-weight: bold;
}

.receive_area {
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 10px;
  background-color: #f5f7fa;
}

.message_item {
  margin-bottom: 10px;
  padding: 10px;
  background-color: #fff;
  border-radius: 4px;
}

.message_time {
  font-size: 12px;
  color: #909399;
  margin-bottom: 5px;
}

.message_topic {
  font-size: 14px;
  color: #409eff;
  margin-bottom: 5px;
}

.message_content {
  font-size: 14px;
  color: #303133;
  word-break: break-all;
}

.empty_message {
  text-align: center;
  color: #909399;
  padding: 50px 0;
}

.status_info {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.status_info > div {
  margin-bottom: 5px;
}

.status_connected {
  color: #67c23a;
  font-weight: bold;
}

.status_disconnected {
  color: #f56c6c;
  font-weight: bold;
}
</style>
