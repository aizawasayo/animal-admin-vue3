import { getUser, login, logout } from '@api/user'
import { addRoutes, resetRouter } from '@router'
import {
  getToken,
  getUserId,
  removeToken,
  removeUserId,
  setToken,
  setUserId,
} from '@utils/auth'

const getDefaultState = () => {
  return {
    token: getToken(),
    username: '',
    avatar: '',
    userId: getUserId(),
    roles: [],
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ID: (state, id) => {
    state.userId = id
  },
  SET_NAME: (state, username) => {
    state.username = username
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then(response => {
          const { data } = response

          if (!data) {
            reject('认证失败，请重新登陆')
          }
          const { user, token } = data
          commit('SET_TOKEN', token)
          commit('SET_ID', user._id)
          setToken(token)
          setUserId(user._id)
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      const id = getUserId()
      getUser(id)
        .then(response => {
          const { data } = response

          if (!data) {
            reject('认证失败，请重新登陆')
          }

          const { roles, username, avatar } = data

          // roles must be a non-empty array
          if (!roles || roles.length <= 0) {
            reject('用户角色必须是一个非空数组!')
          }

          commit('SET_ROLES', roles)
          commit('SET_NAME', username)
          commit('SET_AVATAR', avatar)

          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken() // must remove token first
          removeUserId()
          resetRouter()
          commit('RESET_STATE')

          // reset visited views and cached views
          // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
          dispatch('tagsView/delAllViews', null, {
            root: true,
          })
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      removeUserId()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    // 如果是管理员则不删除动态添加的路由
    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, {
      root: true,
    })
    // dynamically add accessible routes
    addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, {
      root: true,
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
