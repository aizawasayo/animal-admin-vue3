import request from '@utils/request'

export function getInsects(params) {
  return request({ url: 'admin/insect', method: 'get', params })
}

export function addInsect(data) {
  return request({ url: 'admin/insect', method: 'post', data })
}

export function getInsect(id) {
  return request({ url: 'admin/insect/' + id, method: 'get' })
}

export function deleteInsect(id) {
  return request({ url: 'admin/insect/' + id, method: 'delete' })
}
