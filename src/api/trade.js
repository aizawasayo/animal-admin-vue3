import request from '@utils/request'

export function getTradeList(params) {
  return request({
    url: 'admin/trade',
    method: 'get',
    params,
  })
}

export function addTrade(data) {
  return request({
    url: 'admin/trade',
    method: 'post',
    data,
  })
}

export function getTrade(id) {
  return request({
    url: 'admin/trade/' + id,
    method: 'get',
  })
}

export function deleteTrade(id) {
  return request({
    url: 'admin/trade/' + id,
    method: 'delete',
  })
}
