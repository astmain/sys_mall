<template>
  <div class="not-found">
    <div class="not-found-content">
      <h1>page404</h1>
      <h2>抱歉您访问的页面不存在</h2>
      <p>页面可能已被删除、移动或暂时不可用</p>
      <router-link to="/home" class="back-home">返回首页</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// 404页面组件
</script>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.not-found-content {
  text-align: center;
  padding: 2rem;
}

.not-found-content h1 {
  font-size: 8rem;
  margin: 0;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.not-found-content h2 {
  font-size: 2rem;
  margin: 1rem 0;
  font-weight: 300;
}

.not-found-content p {
  font-size: 1.1rem;
  margin: 1rem 0 2rem 0;
  opacity: 0.9;
}

.back-home {
  display: inline-block;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  text-decoration: none;
  border-radius: 25px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  font-weight: 500;
}

.back-home:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}
</style>
