import store from '@store'
import { getToken } from '@utils/auth'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'

// create an axios instance
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // 发送跨域请求时携带 cookie 和 session，后端要配置相应的 cors
  timeout: 10000, // request timeout
})

// axios.defaults.retry = 4
// service.defaults.retryDelay = 1000

// request interceptor 请求拦截
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      config.headers['Authorization'] = `Bearer ${getToken()}`
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor 响应拦截
service.interceptors.response.use(
  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    const statusCode = res.code || response.status // 直接获取http相应码而不再去data里获取code
    // 响应码不是200, 解析返回的错误
    if (statusCode !== 200) {
      // 服务端自定义错误信息字段为 message
      // ElMessage({ message: res.message || 'Error', type: 'error', duration: 5 * 1000 })
      // 508: Illegal token; 512: Other clients logged in; 514: Token expired;
      if ([508, 512, 401, 403].includes(statusCode)) {
        // to re-login
        ElMessageBox.confirm(
          '你已经登出了账户, 你可以关闭这个页面，或者重新登录',
          '确认登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning',
          }
        ).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      // console.log('返回错误：' + res.message)
      return Promise.reject(new Error(res.message || 'Error'))
    }
    return res
  },
  error => {
    console.log('请求/响应失败：' + error) // for debug
    if (error.response) {
      // 请求已发出，但服务器响应的状态码不在 2xx 范围
      console.log(error.response.data)
      console.log(error.response.status)
      console.log(error.response.headers)
    } else if (error.request) {
      // 请求已发出但未收到响应. `error.request` 是浏览器中 XMLHttpRequest 的一个实例
      console.log(error.request)
    } else {
      // 在设置触发错误的请求时发生了一些事情
      console.log('Error', error.message)
    }
    console.log(error.config)
    return Promise.reject(error)
  }
)

export default service
