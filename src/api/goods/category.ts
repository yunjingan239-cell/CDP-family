/**
 * 查询所有分类—新增修改商品下拉框
 * @returns 所有分类
 */
// 导入request工具（路径示例：@/utils/request，需根据项目实际调整）
import request from "@/utils/request";
// 商品分类接口基础路径
const baseUrl = "/goods/category";

export function getCategoryList() {
  return request({
    url: `${baseUrl}/list`,
    method: 'GET'
  });
}
// 列表分页查询接口
export function getPageList(query: GoodsCategoryQuery, current = 1, size = 20) {
    return request({
        url: `${baseUrl}/search`,
        method: 'POST',
        data: { ...query, current, size } // 合并为一个对象
    });
}

// 删除
export function deleteById(id:string) {
    return request({
        url: `${baseUrl}/${id}`,
        method: 'DELETE',
    });
}
// 新增
export function add(data: GoodsType) {
  return request({
    url: `${baseUrl}`,
    method: 'POST',
    data
  });
}

// 更新
export function update(data: GoodsType) {
  return request({
    url: `${baseUrl}`,
    method: 'PUT',
    data,
  });
}