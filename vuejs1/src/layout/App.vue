<template>
  <router-view />
</template>

<script setup lang="ts"></script>

<style>
.el-main {
  padding: 20px;
}

.el-footer {
  background: #f2f2f2;
  color: #333;
  line-height: 40px;
}

.el-aside {
  background: #f5f7fa;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-size: 14px;
}

html {
  height: 100vh !important;
  width: 100vw !important;
  padding: 0 !important;
  margin: 0 !important;
  overflow-x: hidden;
  overflow-y: hidden;
}

body {
  height: 100vh !important;
  width: 100vw !important;
  padding: 0 !important;
  margin: 0 !important;
  overflow-x: hidden;
  overflow-y: hidden;
}

h1,
h2,
h3,
h4,
h5 {
  padding: 0;
  margin: 0;
}

/* 清除 ul li 的样式 */
ul li {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
</style>
