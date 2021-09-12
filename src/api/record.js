import request from '@utils/request'

export function getRecords(params) {
  return request({
    url: 'admin/record',
    method: 'get',
    params,
  })
}

export function addRecord(data) {
  return request({
    url: 'admin/record',
    method: 'post',
    data,
  })
}

export function getRecord(id) {
  return request({
    url: 'admin/record/' + id,
    method: 'get',
  })
}

export function deleteRecord(id) {
  return request({
    url: 'admin/record/' + id,
    method: 'delete',
  })
}
