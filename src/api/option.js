import request from '@utils/request'

export function getOptions(params) {
  return request({
    url: 'admin/option',
    method: 'get',
    params,
  })
}

export function addOption(data) {
  return request({
    url: 'admin/option',
    method: 'post',
    data,
  })
}

export function getOption(id) {
  return request({
    url: 'admin/option/' + id,
    method: 'get',
  })
}

export function deleteOption(id) {
  return request({
    url: 'admin/option/' + id,
    method: 'delete',
  })
}

export function searchOption(name) {
  return request({
    url: 'admin/option/search',
    method: 'get',
    params: {
      name,
    },
  })
}

export function getOptionList(params) {
  return request({
    url: 'admin/option/list',
    method: 'get',
    params,
  })
}
