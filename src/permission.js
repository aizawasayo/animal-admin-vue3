import router from '@router'
import store from '@store'
import { getToken } from '@utils/auth' // get token from cookie
import getPageTitle from '@utils/get-page-title'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

NProgress.configure({
  showSpinner: false,
}) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // 判断本地是否存在 token,没有就重新登陆
  if (getToken()) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      // 判断用户是否通过 getInfo 获得了权限角色
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // 这个请求 api 需要登录权限，顺便可以检测 token 是否在有效期
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { roles } = await store.dispatch('user/getInfo')

          // 获取通过权限验证的路由
          const accessRoutes = await store.dispatch(
            'permission/generateRoutes',
            roles
          )

          // console.log(accessRoutes)

          // 更新加载路由
          router.options.routes = store.getters.permission_routes

          // dynamically add accessible routes
          // addRoutes(accessRoutes)
          accessRoutes.forEach(route => {
            router.addRoute(route)
          })

          if (to.matched.length === 0) {
            // router.push({ path: to.path, query: to.query })
            next({ ...to, replace: true })
          } else {
            next()
          }

          // console.log(router.getRoutes())
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
        } catch (error) {
          console.log(error)
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          ElMessage.error('登录已过期，请重新登录！')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
