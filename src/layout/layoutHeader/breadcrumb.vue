<script setup lang="ts">
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import type { RouteLocationNormalized, RouteRecordNormalized } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useLayoutConfigStore } from '@/stores/layoutConfig';
const layoutConfig = useLayoutConfigStore();

const route = useRoute();
const router = useRouter();
// 面包屑渲染数据
const breadcrumbList = ref<RouteRecordNormalized[]>([]);

// 组件加载时触发（第1次）
onMounted(() => {
    getBreadcrumb(route);
});

// 路由更新时触发
onBeforeRouteUpdate((to) => {
    getBreadcrumb(to);
});

// 获取当前路由的面包屑（meta.title）
function getBreadcrumb(to: RouteLocationNormalized) {
    // 过滤出当前有 meta.title 且isBreadcrumb不为false的路由对象
    const matched = to.matched.filter(item => item.meta && item.meta.title && item.meta.isBreadcrumb !== false);
    // console.log('matched == ', matched);
    breadcrumbList.value = matched || [];
}

// 点击面包屑的某标题跳转
function handleLink(_route: RouteRecordNormalized) {
    const { redirect, path } = _route;
    if (redirect) router.push(<string>redirect);
    else router.push(path);
}

// 点击展开/收起左侧菜单
function handleChangeCollapse() {
    layoutConfig.isCollapse = !layoutConfig.isCollapse;
}
</script>

<template>
    <div class="layout-header-breadcrumb">
        <!-- 收缩 -->
        <SvgIcon @click="handleChangeCollapse" :name="layoutConfig.isCollapse ? 'ele-Expand' : 'ele-Fold'"
            class="layout-header-expand-icon" />
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <!-- v-for过渡效果 -->
            <TransitionGroup name="breadcrumb">
                <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="item.path">
                    <!-- 最后一级路由（当前路由），不可点击跳转 -->
                    <span v-if="index === breadcrumbList.length - 1" class="flex-center">
                        <SvgIcon v-if="item.meta.icon" :name="item.meta.icon" :size="14" />
                        {{ item.meta.title }}
                    </span>
                    <a v-else @click.prevent="handleLink(item)" class="flex-center">
                        <SvgIcon v-if="item.meta.icon" :name="item.meta.icon" :size="14" />
                        {{ item.meta.title }}
                    </a>
                </el-breadcrumb-item>
            </TransitionGroup>
        </el-breadcrumb>
    </div>
</template>

<style scoped></style>