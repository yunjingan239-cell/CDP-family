<template>
  <el-card shadow="hover">
    <div ref="chartRef" :style="{ height: props.height, width: props.width }"></div>
  </el-card>
</template>

<script lang="ts" setup>
import { useECharts } from '@/hooks/useECharts';
import { reactive, computed } from 'vue';

interface Series {
  typeName: string;
  list: number[];
}

// 注意: props泛型声明类型,不能是外部文件导入的类型接口
const props = withDefaults(defineProps<{
  width?: string;
  height?: string;
  theme?: string;
  bgColor?: string;
  title: string;
  subtitle?: string;
  data: Series[]; // 曲线数据
  xAxisData: string[]; // x轴数据
}>(), {
  width: '100%',
  height: '380px',
  data: () => [],
});

// 右上角标签名
const legendData = computed(() => props.data.map(item => item.typeName));
// 折线数据
const series = computed(() => props.data.map(item => ({
  name: item.typeName,
  type: 'line',
  smooth: 0.5,
  // 出现了线和值对不上的情况: 用于数据堆叠, 当两条线数值相近时, 后面的值会在前一个系列的值上面叠加。
  // 去掉 stack , 或者每个系列使用不同的 stack 值: Total1、Total2、.....
  // stack: 'Total',
  emphasis: {
    focus: 'series'
  },
  data: item.list,
})));

// '近30天销售趋势'
const option = reactive({
  backgroundColor: props.bgColor,
  title: {
    text: props.title,
    subtext: props.subtitle,
    x: 'left',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  legend: {
    right: '50px',
    // ['订单数', '销售额', '退款额', '充值额'],
    // data: legendData,
    data: legendData,
  },
  toolbox: {
    feature: {
      // 下载图片
      saveAsImage: {
        title: '下载为图片'
      }
    },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    { 
      // 上面使用reactive声明了option, 则需要 computed 才能加载最新数据
      data: computed(() => props.xAxisData)
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: series
});

const { chartRef } = useECharts({ props, option });
</script>

<style lang="scss" scoped>
</style>