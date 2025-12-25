<script setup lang="ts">
import { useViewRoutesStore } from '@/stores/viewRoutes';
import { computed } from 'vue';

const viewRoutesStore = useViewRoutesStore();

// 获取要缓存的路由组件name
const cacheRouteNames = computed(() => viewRoutesStore.cacheRouteNames);
</script>

<template>
  <el-main class="layout-main">
    <!-- 右侧主区域 -->
    <el-scrollbar>
      <div class="layout-main-wrap">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <div class="transition-wrapper">
              <keep-alive :include="cacheRouteNames">
                <component :is="Component" :key="$route.fullPath"></component>
              </keep-alive>
            </div>
          </transition>
        </router-view>
      </div>
    </el-scrollbar>
  </el-main>
</template>

<style scoped lang="scss">
:deep(.el-scrollbar__view) {
  /* 铺满高度 */
  height: 100%;
}
</style>