<script setup lang="ts" name="GlobalPage">
// 注意: Props引用的类型接口不支持外部ts文件导入，必须在sf-c中定义。
interface IPage {
  current: number;
  size: number;
  total: number;
}

const props = withDefaults(defineProps<{
  page: IPage; // 不支持引用外部ts文件中的类型(不支持views.d.ts中的PageType)
  pagerCount?: number;
  background?: boolean;
  always?: boolean;// 是否始终显示当前分页组件
  layout?: string;
}>(), {
  page: () => ({ // 返回对象，必须用小括号括起来
    current: 1,
    size: 20,
    total: 0
  }),
  pagerCount: 7,
  background: true,
  layout: 'total, sizes, prev, pager, next, jumper'
});

const emit = defineEmits(['pageChange'])

// 当每页显示条数改变后,被触发, val是最新的每页显示条数
function handleSizeChange(val: number) {
  props.page.size = val;
  emit('pageChange');
}

// 当页码改变后,被触发, val 是最新的页面
function handleCurrentChange(val: number) {
  props.page.current = val;
  emit('pageChange');
}
</script>

<template>
  <el-row v-show="page.total || always" justify="end" class="mt20">
    <!-- 分页 -->
    <el-pagination 
      :background="background" 
      :pager-count="pagerCount"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="page.size"
      :total="page.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.current"
      :layout="layout"
    >
    </el-pagination>
  </el-row>
</template>

<style scoped>

</style>