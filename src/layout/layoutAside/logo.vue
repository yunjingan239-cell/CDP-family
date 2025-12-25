<script setup lang='ts'>
import { useLayoutConfigStore } from '@/stores/layoutConfig';
const layoutConfig = useLayoutConfigStore();
</script>

<template>
    <div class="layout-logo">
        <img class="layout-logo-img" src="@/assets/logo.png">
        <span v-if="!layoutConfig.isCollapse">{{ layoutConfig.globalTitle }}</span>
    </div>
</template>

<style scoped></style>