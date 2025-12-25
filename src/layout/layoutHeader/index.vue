<script setup lang="ts">
import { defineAsyncComponent } from "vue";

const Breadcrumb = defineAsyncComponent(() => import('@/layout/layoutHeader/breadcrumb.vue'));
const UserDropdown = defineAsyncComponent(() => import('@/layout/layoutHeader/userDropdown.vue'));
</script>

<template>
  <!-- 右侧头部区域 -->
  <el-header class="layout-header">
    <div class="layout-header-index">
      <!-- 左侧面包屑 -->
      <Breadcrumb />
      <!-- 右侧下拉框 -->
      <UserDropdown />
    </div>
  </el-header>
</template>

<style scoped>
</style>