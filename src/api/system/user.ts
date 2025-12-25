import request from "@/utils/request";

const baseUrl = "/system/user";

// 用户列表分页查询接口
export function getPageList(query: SysUserQuery, current = 1, size = 20) {
  return request({
    url: `${baseUrl}/search`,
    method: 'POST',
    data: { ...query, current, size } // 合并为一个对象
  });
}

// 删除
export function deleteById(id: number|string) {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'DELETE',
  });
}

// 新增
export function add(data: SysUserType) {
  return request({
    url: `${baseUrl}`,
    method: 'POST',
    data
  });
}

// 更新
export function update(data: SysUserType) {
  return request({
    url: `${baseUrl}`,
    method: 'PUT',
    data
  });
}

// 查询用户帐号、手机号是否存在
export function checkExist(params: {username: string} | {mobile: string}) {
  return request({
    url: `${baseUrl}/exist`,
    method: 'GET',
    params
  });
}

/**
 * 重置用户密码
 * @param data
 * @returns
 */
export function updatePassword(data: PwdResetForm) {
  return request({
    url: `${baseUrl}/password`,
    method: 'PUT',
    data
  });
}