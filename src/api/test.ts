import request from "@/utils/request";



const BASE_URL = '';
export function test1 () {
  // 测试1: 调用 get 方式发送get请求
  request.get("/test").then(response => {
    console.log("get1", response);
  }).catch(error => {
    console.log('error', error);
  });
}

export function test2 () {
  // 测试2, 使用对象形式传入请求配置, 如 请求url, method, param
  request({
    url: '/test',
    method: "GET"
  }).then(response => {
    console.log("get2", response);
  }).catch(error => {
    console.log(error);
  });
}

// 返回 Promise
export function getList () {
  const req = request({
    url: '/test',
    method: "GET"
  });
  // console.log(req) // Promise
  return req;
}
