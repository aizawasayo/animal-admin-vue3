import request from '@utils/request'

export function getBoardList(params) {
  return request({
    url: 'admin/board',
    method: 'get',
    params,
  })
}

export function addBoard(data) {
  return request({
    url: 'admin/board',
    method: 'post',
    data,
  })
}

export function getBoard(id) {
  return request({
    url: 'admin/board/' + id,
    method: 'get',
  })
}

export function deleteBoard(id) {
  return request({
    url: 'admin/board/' + id,
    method: 'delete',
  })
}
