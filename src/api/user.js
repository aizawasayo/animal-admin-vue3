import request from '@utils/request'

export function login(data) {
  return request({ url: '/admin/login', method: 'post', data })
}

export function logout() {
  return request({ url: '/admin/logout', method: 'post' })
}

export function sendMessage(data) {
  return request({ url: '/admin/message', method: 'post', data })
}

export function getUsers(params) {
  return request({ url: 'admin/user', method: 'get', params })
}

export function addUser(data) {
  return request({ url: 'admin/user', method: 'post', data })
}

export function editUser(id, data) {
  return request({ url: 'admin/user/' + id, method: 'put', data })
}

export function getUser(id) {
  return request({ url: 'admin/user/' + id, method: 'get' })
}

export function deleteUser(id) {
  return request({ url: 'admin/user/' + id, method: 'delete' })
}

export function searchUser(username) {
  return request({
    url: 'admin/user/search',
    method: 'get',
    params: { username },
  })
}

export function modifyPsw(id, data) {
  return request({
    url: 'admin/user/psw/' + id,
    method: 'put',
    data,
  })
}

export function register(data) {
  return request({
    url: 'admin/user/regsiter',
    method: 'post',
    data,
  })
}
