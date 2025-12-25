<script setup lang="ts">
/**
 * Vue 提供了一个 `h()` 渲染函数用于创建虚拟DOM（vnodes）
 */
import { h, resolveComponent } from 'vue';

// 声明一个渲染函数，渲染结果: <div class="bar">hello</div>
// const render1 = () => h('div', { class: 'bar', innerHTML: 'hello' }, );

// 没有props时, 参数2可以省略不写, 直接写参数3。渲染结果: <div>cdp</div>//
const render2 = () => h('div', 'cdp');

// 并没有渲染出图标, 渲染结果: <el-icon color="red" size="20">ele-Search</el-icon>
// const render3 = () => h('el-icon', {color: 'red', size: 20}, 'ele-Search');

// 如果组件以名称注册时, 可以使用 resolveComponent 函数来解决动态加载组件.
// 注意: 第3个参数使用 h() 时, 建议使用函数返回。否则控制有警告: Non-function value encountered
// for default slot. Prefer function slots for better performance.
// const render4 = () => h(resolveComponent('el-icon'), {color: 'red', size: 20},
// ()=>h(resolveComponent('ele-Search')));


const props = withDefaults(defineProps<{
    name?: string, // 图标名称
    color?: string, // 图标颜色
    size?: number, // 图标大小
}>(), {
    name: '',
    size: 18
});


const render = () => {
    if (props.name?.startsWith('ele-')) {
        return h(resolveComponent('el-icon'),
            { color: props.color, size: props.size },
            () => h(resolveComponent(props.name))
        );
    } else {
        return h('i');
    }
}
</script>

<template>
    <!--模板中直接引用虚拟Dom -->
    <render />
</template>