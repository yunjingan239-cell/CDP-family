<script setup lang="ts">
// 同步加载组件
// import LayoutAside from './layoutAside/index.vue';
// import LayoutHeader from './layoutHeader/index.vue';
// import LayoutMain from './layoutMain/index.vue';

import { defineAsyncComponent } from "vue";

// 异步加载组件
const LayoutAside = defineAsyncComponent(() => import('./layoutAside/index.vue'));
const LayoutHeader = defineAsyncComponent(() => import('./layoutHeader/index.vue'));
const LayoutMain = defineAsyncComponent(() => import('./layoutMain/index.vue'));
</script>

<template>
  <el-container class="layout-container">
    <LayoutAside />
    <!-- 右侧区域 direction="vertical"垂直排列 -->
    <el-container direction="vertical">
      <LayoutHeader />
      <LayoutMain />
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
</style>