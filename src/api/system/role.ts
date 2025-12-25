import request from "@/utils/request";
const baseUrl = "/system/role";

// 角色列表分页查询接口
export function getPageList(query: SysRoleQuery = { name: '' }, current = 1, size = 20) {
  return request({
    url: `${baseUrl}/search`,
    method: "POST",
    data: {
      ...query,
      current,
      size
    }
  });
}
// 删除角色
export function deleteById(id:string) {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'DELETE',
  });
}
// 新增
export function add(data: SysRoleType) {
  return request({
    url: `${baseUrl}`,
    method: 'POST',
    data
  });
}
// 更新
export function update(data: SysRoleType) {
  return request({
    url: `${baseUrl}`,
    method: 'PUT',
    data,
  });
}

/**
 * 通过角色id查询所有的菜单ids
 * @param roleId 角色id
 * @returns
 */
export function getMenuIdsByRoleId(roleId: string) {
  return request({
    url: `${baseUrl}/${roleId}/menu/ids`,
    method: 'GET'
  });
}

/**
 * 保存角色所分配的菜单Ids
 * @param roleId 角色id
 * @param menuIds 权限Ids数组
 * @returns
 */
export function saveRoleMenu(roleId: string, menuIds: string[]) {
  return request({
    url: `${baseUrl}/${roleId}/menu/ids`,
    method: 'POST',
    data: menuIds
  });
}
// 在 '/src/api/system/role.ts'
/**
 * 查询所有角色—用户分配角色下拉框
 * @returns 所有角色
 */
export function getRoleList() {
  return request({
    url: `${baseUrl}/list`,
    method: 'GET'
  });
}