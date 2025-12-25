import { defineStore } from 'pinia';
import { Local } from '@/utils/storage';
import { nextTick } from 'vue';

/**
 * 系统布局配置
 */
export const useLayoutConfigStore = defineStore('layoutConfig', {
  state: (): LayoutConfigState => {
    return {
      // ...
      // 是否全屏 +++
      isFullscreen: false,
      // 黑暗模式 +++
      isDark: false,
      isCollapse:false,
      globalTitle:"成职院-Vue3全家桶项目"
    }
  },
actions: {
    // 更新状态
    updateState(state: LayoutConfigState) {
      // 将传递的值更新到state状态中
      this.$patch(state);
    }
  }
});