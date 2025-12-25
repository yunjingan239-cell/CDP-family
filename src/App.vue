<script setup lang="ts">
import { onMounted } from 'vue';
import { Local } from '@/utils/storage';
import { useLayoutConfigStore } from '@/stores/layoutConfig';

const layoutConfigStore = useLayoutConfigStore();

onMounted(() => {
  // 获取localStorage中的布局配置，进行pinia状态更新
  const layoutConfigState = Local.get('layoutConfig');
  if (layoutConfigState) layoutConfigStore.updateState(layoutConfigState);
});
</script>

<template>
  <!-- 不要少了 class="h100" 高度100%, 不然布局的高度无法占满 -->
  <div class="h100">
    <!-- 路由组件渲染出品 -->
    <router-view></router-view>
  </div>
</template>

<style scoped>
</style>