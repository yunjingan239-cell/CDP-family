import request from "@/utils/request";

// 营业概况统计查询
export function getStatisticsData() {
  return request({
    url: '/home/statistics',
    method: 'GET'
  })
}
// 分类销售统计查询
export function getCategoryData() {
  return request({
    url: '/home/categoryData',
    method: 'GET'
  })
}
// 查询近30天销售数据
export function getLast30DaysSaleData() {
  return request({
    url: '/home/30days/saleData',
    method: 'GET'
  })
}
// 会员消费Top10查询
export function getMemberTop10Data() {
  return request({
    url: '/home/member/top10',
    method: 'GET'
  })
}