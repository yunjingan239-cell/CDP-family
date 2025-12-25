import request from "@/utils/request";

const baseUrl = '/goods';

// 商品列表分页查询接口
export function getPageList(query: GoodsQuery, current = 1, size = 20) {
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

export function updateStatus(data: {id:string, status:number}) {
  return request({
    url: `${baseUrl}/status`,
    method: 'PUT',
    data
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

// 查询商品编码是否存在
export function isExist(params: {code: string}) {
  return request({
    url: `${baseUrl}/exist`,
    method: 'GET',
    params
  })
}