<template>
  <div class="home-container">
    <!-- 营业统计 -->
    <StatisticBlock />

    <el-row :gutter="15">
      <el-col v-loading="state.category.loading" :xs="24" :sm="24" :md="11" :lg="9" class="mb15">
        <PieChart width="100%" height="380px" title="分类销售统计" subtitle="每种商品分类的近30天销售数据" :theme="theme"
          :bgColor="bgColor" :data="state.category.data" />
      </el-col>

      <el-col v-loading="state.last30Days.loading" :xs="24" :sm="24" :md="13" :lg="15" class="mb15">
        <LineChart width="100%" height="380px" title="近30天销售趋势" :theme="theme" :bgColor="bgColor"
          :data="state.last30Days.data" :xAxisData="state.last30Days.xAxisData" />
      </el-col>
    </el-row>

    <el-row :gutter="15">
      <el-col v-loading="state.memberTop10.loading" :xs="24" :sm="24" :md="13" :lg="15" class="mb15">
        <BarChart width="100%" height="380px" title="会员消费Top10" subtitle="单位：元" :theme="theme" :bgColor="bgColor"
          :xAxisData="state.memberTop10.xAxisData" :data="state.memberTop10.data" />
      </el-col>
      <el-col :xs="24" :sm="24" :md="11" :lg="9" class="mb15">
        <GaugeChart width="100%" height="380px" title="气温仪表盘 °C" :theme="theme" :bgColor="bgColor"
          :data="state.temperature" />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import StatisticBlock from './components/statisticBlock.vue';
import PieChart from '@/components/echarts/pieChart.vue';
import LineChart from '@/components/echarts/lineChart.vue';
import BarChart from '@/components/echarts/barChart.vue';
import GaugeChart from '@/components/echarts/gaugeChart.vue';
import { reactive, computed, onMounted } from "vue";
import { getCategoryData, getLast30DaysSaleData, getMemberTop10Data } from '@/api/home';
import { useLayoutConfigStore } from '@/stores/layoutConfig';
const layoutConfig = useLayoutConfigStore();

// 图表主题: 'dark' 黑暗主题
const theme = computed(() => layoutConfig.isDark ? 'dark' : '');
// 图表背景色
const bgColor = computed(() => layoutConfig.isDark ? 'transparent' : '');

const state = reactive({
  category: {
    loading: false,
    data: []
  },
  last30Days: {
    loading: false,
    xAxisData: [] as string[],
    data: [] as any[]
  },
  memberTop10: {
    loading: false,
    xAxisData: [] as string[],
    data: [] as number[]
  },
  temperature: 38
});

onMounted(() => {
  loadCategoryData();
  loadLast30DaysSaleData();
  loadMemberTop10Data();
});

// 分类销售统计查询
async function loadCategoryData() {
  try {
    state.category.loading = true;
    const { data } = await getCategoryData();
    state.category.data = data;
  } catch (error) {
  } finally {
    state.category.loading = false;
  }
}

// 查询近30天销售数据
async function loadLast30DaysSaleData() {
  try {
    state.last30Days.loading = true;
    const { data } = await getLast30DaysSaleData();
    const { last30Days, orderNumList, saleMoneyList, returnMoneyList, rechargeMoneyList } = data;
    state.last30Days.xAxisData = last30Days;
    state.last30Days.data = [
      { typeName: '订单数', list: orderNumList },
      { typeName: '销售额', list: saleMoneyList },
      { typeName: '退款额', list: returnMoneyList },
      { typeName: '充值额', list: rechargeMoneyList },
    ];
  } catch (error) {
  } finally {
    state.last30Days.loading = false;
  }
}

// 查询会员消费top10数据
async function loadMemberTop10Data() {
  try {
    state.memberTop10.loading = true;
    const { data } = await getMemberTop10Data();
    // 清空：不要直接赋值空数组，不然刷新页面无法渲染出数据
    state.memberTop10.data.length = 0;
    state.memberTop10.xAxisData.length = 0;
    // 获取名字
    data.forEach((item: any) => {
      state.memberTop10.xAxisData.push(item.name);
      state.memberTop10.data.push(item.consumeMoney);
    });
  } catch (error) {
  } finally {
    state.memberTop10.loading = false;
  }
}
</script>

<style lang="scss" scoped></style>