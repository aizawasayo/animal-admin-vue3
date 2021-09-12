import request from '@utils/request'

export function getTurnipList(params) {
  return request({
    url: 'admin/turnip',
    method: 'get',
    params,
  })
}

export function addTurnip(data) {
  return request({
    url: 'admin/turnip',
    method: 'post',
    data,
  })
}

export function getTurnip(id) {
  return request({
    url: 'admin/turnip/' + id,
    method: 'get',
  })
}

export function deleteTurnip(id) {
  return request({
    url: 'admin/turnip/' + id,
    method: 'delete',
  })
}
