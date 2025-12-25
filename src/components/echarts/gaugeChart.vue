<template>
  <el-card shadow="hover">
    <div ref="chartRef" :style="{ height: props.height, width: props.width }"></div>
  </el-card>
</template>

<script lang="ts" setup>
import { useECharts } from '@/hooks/useECharts';

// 注意: props泛型声明类型,不能是外部文件导入的类型接口
const props = withDefaults(defineProps<{
  width?: string;
  height?: string;
  theme?: string;
  bgColor?: string;
  title: string;
  data: number; // 数据
}>(), {
  width: '100%',
  height: '380px',
  data: 0
});

// 绘制图表选项
const option = {
  backgroundColor: props.bgColor,
  title: {
    text: props.title,
    x: 'left'
  },
  series: [
    { // 仪表盘效果
      type: 'gauge',
      center: ['50%', '60%'],
      startAngle: 200,
      endAngle: -20,
      min: 0,
      max: 60,
      splitNumber: 12,
      pointer: {
        show: false
      },
      axisLine: {
        lineStyle: {
          width: 30
        }
      },
      axisTick: {
        distance: -45,
        splitNumber: 5,
        lineStyle: {
          width: 2,
          color: '#999'
        }
      },
      splitLine: {
        distance: -52,
        length: 14,
        lineStyle: {
          width: 3,
          color: '#999'
        }
      },
      axisLabel: {
        distance: -20,
        color: '#999',
        fontSize: 20
      },
      anchor: {
        show: false
      },
      title: {
        show: false
      },
      detail: {
        valueAnimation: true,
        width: '60%',
        lineHeight: 40,
        borderRadius: 8,
        offsetCenter: [0, '-15%'],
        fontSize: 60,
        fontWeight: 'bolder',
        formatter: '{value} °C',
        color: 'inherit'
      },
      data: [
        {
          value: props.data
        }
      ]
    },
    { // 下方数字效果
      type: 'gauge',
      center: ['50%', '60%'],
      startAngle: 200,
      endAngle: -20,
      min: 0,
      max: 60,
      itemStyle: {
        color: '#FD347'
      },
      progress: {
        show: true,
        width: 8
      },
      data: [
        {
          value: props.data
        }
      ]
    }
  ]
};

const { chartRef, chart, echartsResizeFun } = useECharts({props, option});
</script>

<style lang="scss" scoped>
</style>