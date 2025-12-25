import request from "@/utils/request";
const baseUrl = "/auth";

// 登录系统
export function login(data: LoginData) {
  return request({
    url: `${baseUrl}/token`,
    method: 'POST',
    data
  });
}
// 退出系统
export function logout() {
  return request({
    url: `${baseUrl}/logout`,
    method: "POST",
  });
}