import request from '@utils/request'

export function getFurnitureList(params) {
  return request({
    url: 'admin/furniture',
    method: 'get',
    params,
  })
}

export function addFurniture(data) {
  return request({
    url: 'admin/furniture',
    method: 'post',
    data,
  })
}

export function getFurniture(id) {
  return request({
    url: 'admin/furniture/' + id,
    method: 'get',
  })
}

export function deleteFurniture(id) {
  return request({
    url: 'admin/furniture/' + id,
    method: 'delete',
  })
}

export function searchFurniture(name) {
  return request({
    url: 'admin/furniture/search',
    method: 'get',
    params: {
      name,
    },
  })
}
