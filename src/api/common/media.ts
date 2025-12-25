import request from "@/utils/request";

const baseUrl = '/system/media';

// 上传图片
export function uploadImg(data: FormData) {
  return request({
    url: `${baseUrl}/upload/img`,
    method: 'POST',
    data
  });
}