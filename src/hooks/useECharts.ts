import * as echarts from 'echarts';
import { ref, toRefs, reactive, markRaw, onMounted, onBeforeUnmount, watch, nextTick, onActivated } from "vue";

// 注意: defineProps、defineEmits、defineExpose等在hooks中无法使用，只能用于SFC中使用
interface Params {
  props: any;
  option: any; // /echarts.EChartsOption;
}

function useECharts(params: Params) {
  const { props, option } = params;

  // 图表渲染ref
  const chartRef = ref();

  const state = reactive({
    nvl: ['', null, undefined], // 用于判断饼图实例是否存在
    chart: null as any, // 饼图实例
  });

  // 不要少了中括号[]
  watch(() => [props.data, props.theme], ([data, theme]) => {
    // nextTick，不然初始化时图表时，元素未绑定到 ref 上
    nextTick(() => {
      initChart();
    });
  }, { deep: true, immediate: true });

  // 初始化图表
  function initChart() {
    // 实例存在则移除
    if (state.nvl.indexOf(state.chart) === -1) state.chart.dispose();
    // 初始化echarts实例，参数2：黑暗主题 'dark'
    // 防止echarts 有些功能失效，要使用 `markRaw` 返回该对象本身，而不是转为代理对象返回。
    state.chart = markRaw(echarts.init(chartRef.value, props.theme));
    // 设置图表选项
    state.chart.setOption(option);
  }

  // 重置 echarts 图表大小
  function echartsResizeFun() {
    state.chart && state.chart.resize();
  }

  onMounted(() => {
    // 监听浏览器窗口大小改变，重置图表大小
    window.addEventListener('resize', echartsResizeFun);
  });

  // 使用了 <keep-alive> 页面缓存组件，每次从缓存中被重新插入时，重置图表大小
  onActivated(() => {
    echartsResizeFun();
  });

  // 组件销毁前触发
  onBeforeUnmount(() => {
    document.removeEventListener('resize', echartsResizeFun);
    if (state.chart) {
      state.chart.dispose();
      state.chart = null;
    }
  });

  return {
    chartRef,
    ...toRefs(state),
    echartsResizeFun
  }
}

export { useECharts };
export default useECharts;