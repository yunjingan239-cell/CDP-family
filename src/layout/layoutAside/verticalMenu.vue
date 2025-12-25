<!-- 侧栏(垂直)菜单-->
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useLayoutConfigStore } from '@/stores/layoutConfig';

const layoutConfig = useLayoutConfigStore();
// 是否折叠收起菜单
const { isCollapse } = storeToRefs(layoutConfig);
</script>

<template>
    <!---滚动条-->
    <el-scrollbar>
        <!--
      router 开启路由功能, 使用 index 属性指定路由地址
      default-active 默认选中哪个菜单
      background-color 背景色
      :default-openeds 默认选中哪个菜单, 值为index值数组, 要v-bind绑定
    -->
        <el-menu router default-active="/" background-color="transparent" :default-openeds="['/system']"
            :collapse="isCollapse">
            <el-menu-item index="/home">
                <el-icon><ele-HomeFilled /></el-icon>
                <template #title>首页</template>
            </el-menu-item>

            <el-sub-menu index="/system">
                <template #title>
                    <el-icon><ele-Setting /></el-icon>
                    <span>系统管理</span>
                </template>
                <el-menu-item index="/system/menu">
                    <template #title>
                        <el-icon><ele-Menu /></el-icon>
                        <span>菜单管理</span>
                    </template>
                </el-menu-item>
                <el-menu-item index="/system/role">
                    <template #title>
                        <el-icon><ele-IceCream /></el-icon>
                        <span>角色管理</span>
                    </template>
                </el-menu-item>
                <el-menu-item index="/system/user">
                    <template #title>
                        <el-icon><ele-User /></el-icon>
                        <span>用户管理</span>
                    </template>
                </el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="/goods">
                <template #title>
                    <el-icon><ele-Goods /></el-icon>
                    <span>商品管理</span>
                </template>
                <el-menu-item index="/goods/list">
                    <template #title>
                        <el-icon><ele-GoodsFilled /></el-icon>
                        <span>商品列表</span>
                    </template>
                </el-menu-item>
                <el-menu-item index="/goods/category">
                    <template #title>
                        <el-icon><ele-Operation /></el-icon>
                        <span>商品分类</span>
                    </template>
                </el-menu-item>
            </el-sub-menu>

            <el-menu-item index="/401">
                <SvgIcon name="ele-Warning" />
                <span>401页面</span>
            </el-menu-item>

            <el-menu-item index="/cdp">
                <el-icon><ele-Link /></el-icon>
                <template #title>
                    <span>成职院官网</span>
                </template>
            </el-menu-item>
        </el-menu>
    </el-scrollbar>
</template>

<style scoped></style>