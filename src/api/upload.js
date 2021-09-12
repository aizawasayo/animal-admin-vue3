import request from '@utils/request'

export function upload(data) {
  return request({
    url: 'admin/single/upload',
    method: 'post',
    data,
  })
}

export function uploadMulti(data) {
  return request({
    url: 'admin/upload',
    method: 'post',
    data,
  })
}
