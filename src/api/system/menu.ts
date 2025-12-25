import request from "@/utils/request";

// 基础路径: 菜单管理
const baseUrl = '/system/menu';

// 所有菜单列表接口
export function getList(query?: SysMenuQuery) {
  return request({
    url: `${baseUrl}/search`,
    method: 'POST',
    data: query
  });
}
// 删除
export function deleteById(id: string) {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'DELETE',
  });
}
// 菜单下拉选择框接口(没有按钮)
export function getMenuSelect() {
  return request({
    url: `${baseUrl}/select`,
    method: 'GET',
  });
}

// 新增
export function add(data: SysMenuType) {
  return request({
    url: `${baseUrl}`,
    method: 'POST',
    data
  });
}
// 更新
export function update(data: SysMenuType) {
  return request({
    url: `${baseUrl}`,
    method: 'PUT',
    data,
  })
}
// 查询用户拥有的菜单按钮权限（动态路由）
export function getMenuUser() {
  return request({
    url: `${baseUrl}/user`,
    method: 'GET'
  });
}