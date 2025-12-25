<script lang="ts" setup>
import { useECharts } from '@/hooks/useECharts';
import * as echarts from 'echarts';

// 注意: props泛型声明类型,不能是外部文件导入的类型接口
const props = withDefaults(defineProps<{
  width?: string;
  height?: string;
  theme?: string;
  bgColor?: string;
  title: string;
  subtitle: string;
  data: any[]; // 柱状图数据
  xAxisData: string[] | number[]; // x轴数据
}>(), {
  width: '100%',
  height: '380px',
  data: () => []
});

// 绘制图表选项
const option = {
  backgroundColor: props.bgColor,
  title: {
    text: props.title,
    subtext: props.subtitle,
    x: 'left'
  },
  tooltip: { // 鼠标悬浮提示
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  xAxis: {
    type: 'category',
    data: props.xAxisData
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: props.data,
      type: 'bar',
      itemStyle: { // 渐变样式
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#83bff6' },
          { offset: 0.5, color: '#188df0' },
          { offset: 1, color: '#188df0' }
        ])
      }
    }
  ]
};

const { chartRef, chart, echartsResizeFun } = useECharts({ props, option });
</script>

<template>
  <el-card shadow="hover">
    <div ref="chartRef" :style="{ height: props.height, width: props.width }"></div>
  </el-card>
</template>


<style lang="scss" scoped>
</style>