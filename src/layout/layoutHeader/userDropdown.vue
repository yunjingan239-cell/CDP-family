<script setup lang="ts">
import { useFullscreen } from '@vueuse/core';
import { useRouter } from 'vue-router';
import { useLayoutConfigStore } from '@/stores/layoutConfig';
import { useDark } from '@vueuse/core';
import { useAuthStore } from '@/stores/auth';
import { FullScreen, Aim } from '@element-plus/icons-vue';
const layoutConfig = useLayoutConfigStore();

// 全屏切换
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen();
const router = useRouter();
const authStore = useAuthStore();

// 点击切换全屏
async function handleToggleFullscreen() {
  await toggleFullscreen();
  // 更新状态
  layoutConfig.isFullscreen = isFullscreen.value;
}

// 暗黑模式切换：会将状态值自动保存到localStorage中：`vueuse-color-scheme: dark|auto`
// 会自动监听isDark值的变化，来切换到对应主题
const isDark = useDark({
  initialValue: 'dark' // 初始主题
});
//console.log('isDark', isDark.value); // true/false

// 切换暗黑模式，更新状态值
function changeDark(_isDark: boolean) {
  layoutConfig.isDark = _isDark;
}
</script>

<template>
  <div class="layout-header-user">
    <div class="layout-header-user-icon m5" @click="handleToggleFullscreen">
      <el-icon :size="18">
        <FullScreen v-if="!isFullscreen" />
        <Aim v-else />
      </el-icon>
    </div>

    <div class="layout-header-user-icon m5">
      <el-switch 
        v-model="isDark" 
        @change="changeDark" 
        inline-prompt 
        active-icon="ele-Moon"
        inactive-icon="ele-Sunny" 
        style="--el-switch-on-color:#333;"
      />
    </div>

    <el-dropdown>
      <span class="user-dropdown-link">
        <el-avatar :src="authStore.userInfo?.imageUrl" class="m3" :style="{width: '30px', height: '30px'}" icon="ele-UserFilled" />
        {{ authStore.userInfo?.nickName }}
        <SvgIcon class="m13" name="ele-ArrowDown"></SvgIcon>
      </span>

      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="router.push('/')">首页</el-dropdown-item>
          <el-dropdown-item @click.prevent="router.push('/404')">404</el-dropdown-item>
          <el-dropdown-item @click.prevent="router.push('/401')">401</el-dropdown-item>
          <el-dropdown-item @click="authStore.userLogout()" divided>退出系统</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style scoped></style>