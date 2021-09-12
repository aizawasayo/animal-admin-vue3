import request from '@utils/request'

export function getBanners(params) {
  return request({
    url: 'admin/banner',
    method: 'get',
    params,
  })
}

export function getBannerList(params) {
  return request({
    url: 'admin/banner/list',
    method: 'get',
    params,
  })
}

export function addBanner(data) {
  return request({
    url: 'admin/banner',
    method: 'post',
    data,
  })
}

export function getBanner(id) {
  return request({
    url: 'admin/banner/' + id,
    method: 'get',
  })
}

export function deleteBanner(id) {
  return request({
    url: 'admin/banner/' + id,
    method: 'delete',
  })
}
