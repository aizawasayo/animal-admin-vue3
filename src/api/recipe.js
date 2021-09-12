import request from '@utils/request'

export function getRecipes(params) {
  return request({
    url: 'admin/recipe',
    method: 'get',
    params,
  })
}

export function addRecipe(data) {
  return request({
    url: 'admin/recipe',
    method: 'post',
    data,
  })
}

export function getRecipe(id) {
  return request({
    url: 'admin/recipe/' + id,
    method: 'get',
  })
}

export function deleteRecipe(id) {
  return request({
    url: 'admin/recipe/' + id,
    method: 'delete',
  })
}

export function searchRecipe(name) {
  return request({
    url: 'admin/recipe/search',
    method: 'get',
    params: {
      name,
    },
  })
}
