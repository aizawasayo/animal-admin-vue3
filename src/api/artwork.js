import request from '@utils/request'

export function getArtworkList(params) {
  return request({
    url: 'admin/artwork',
    method: 'get',
    params,
  })
}

export function addArtwork(data) {
  return request({
    url: 'admin/artwork',
    method: 'post',
    data,
  })
}

export function getArtwork(id) {
  return request({
    url: 'admin/artwork/' + id,
    method: 'get',
  })
}

export function deleteArtwork(id) {
  return request({
    url: 'admin/artwork/' + id,
    method: 'delete',
  })
}
