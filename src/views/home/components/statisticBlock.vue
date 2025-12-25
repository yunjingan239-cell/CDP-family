<script lang="ts" setup>
import { getStatisticsData } from "@/api/home";
import { reactive, onMounted } from "vue";

const state = reactive({
    loading: false,
    statisticData: {
        totalOrderNum: 0,
        totalSaleMoney: 0,
        totalReturnedMoney: 0,
        totalIncomeMoney: 0,
    } as any
});

onMounted(() => {
    loadStatisticsData();
});

// 营收概况
async function loadStatisticsData() {
    try {
        state.loading = true;
        const { data } = await getStatisticsData();
        console.log('data', data);
        state.statisticData = data;
    } catch (error) {
    } finally {
        state.loading = false;
    }
}
const blocklist = [
    { name: "订单笔数", unit: "笔", column: "totalOrderNum", content: "订单笔数=(商品消费+快递消费+计次消费)的订单数", startColor: "#90ba26", endColor: "#90ba26a1" },
    { name: "销售总额", unit: "元", column: "totalSaleMoney", content: "销售总额=商品消费+快递消费+计次消费的合计金额", startColor: "#f52c12", endColor: "#f52c12c7" },
    { name: "退款总额", unit: "元", column: "totalReturnedMoney", content: "退款总额=退货或撤单的退款总金额", startColor: "#fb9a08", endColor: "#fb9a08db" },
    { name: "综合收入", unit: "元", column: "totalIncomeMoney", content: "综合收入是指店铺实际进账金额", startColor: "#2062e6", endColor: "#2062e696" }
];
</script>

<template>
    <div class="home-statistic">
        <div class="home-statistic-title">营业数据统计</div>
        <el-row v-loading="state.loading" :gutter="15">
            <el-col :xs="24" :sm="12" :md="12" :lg="6" v-for="(item, index) in blocklist" :key="index">
                <el-card class="home-business-card" shadow="hover"
                    :style="{ 'background-image': `linear-gradient(to right, ${item.startColor}, ${item.endColor})` }">
                    <div class="home-business-title">
                        <span>{{ item.name }}</span>
                        <el-tooltip :content="item.content" placement="top" effect="light">
                            <SvgIcon name="ele-QuestionFilled"></SvgIcon>
                        </el-tooltip>
                    </div>
                    <div class="item-num">
                        <span>{{ state.statisticData[item.column] }}</span>
                        <span class="unit">{{ item.unit }}</span>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<style lang="scss" scoped>
.home-statistic {
    .home-statistic-title {
        font-size: 18px;
        line-height: 25px;
        height: 25px;
        position: relative;
        border-left: 2px solid var(--el-color-primary);
        padding-left: 10px;
        margin: 15px 0;
    }

    .home-business-card {
        margin-bottom: 15px;
        padding-left: 9px;
        color: #fff;
        line-height: 30px;
        cursor: pointer;

        .home-business-title {
            display: flex;
            flex-direction: row;
            align-items: center;
        }

        .item-num {
            font-size: 25px;
            font-weight: 500;
        }

        .unit {
            font-size: 13px;
            line-height: 16px;
            margin-left: 2px;
        }
    }
}
</style>