/* Layout */
import Layout from '@layout/index.vue'
import { createRouter, createWebHashHistory } from 'vue-router'
/* Router Modules */
import archiveRouter from './modules/archive'
import communityRouter from './modules/community'
import guideRouter from './modules/guide'
import museumRouter from './modules/museum'
import optionRouter from './modules/option'

/**
// 当设置 true 的时候该路由不会在侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
hidden: true // (默认 false)

//当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
redirect: 'noRedirect'

// 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
// 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
// 若你想不管路由下面的 children 声明的个数都显示你的根路由
// 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
alwaysShow: true

name: 'router-name' // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
meta: {
  roles: ['admin', 'editor'] // 设置该路由进入的权限，支持多个权限叠加
  title: 'title' // 设置该路由在侧边栏和面包屑中展示的名字
  icon: 'svg-name' // 设置该路由的图标，支持 svg-class，也支持 el-icon-x element-ui 的 icon
  noCache: true // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
  breadcrumb: false //  如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
  affix: true // 若果设置为true，它则会固定在tags-view中(默认 false)

  // 当路由设置了该属性，则会高亮相对应的侧边栏。
  // 这在某些场景非常有用，比如：一个文章的列表页路由为：/article/list
  // 点击文章进入文章详情页，这时候路由为/article/1，但你想在侧边栏高亮文章列表的路由，就可以进行如下设置
  activeMenu: '/article/list'
}
 */

export const constantRoutes = [
  {
    path: '/redirect',
    name: 'Redirect',
    component: Layout,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@views/Redirect.vue'),
      },
    ],
    meta: { hidden: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@views/login/index.vue'),
    meta: { hidden: true },
  },

  {
    path: '/auth-redirect',
    component: () => import('@views/login/Auth-redirect.vue'),
    meta: { hidden: true },
  },

  {
    path: '/404',
    component: () => import('@views/404.vue'),
    meta: {
      noCache: true,
      hidden: true,
    },
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard', // 重定向地址，在面包屑中点击会重定向去的地址
    children: [
      {
        path: 'dashboard',
        component: () => import('@views/dashboard/Index.vue'),
        name: 'Dashboard',
        meta: {
          title: '首页',
          icon: 'home',
          affix: true,
        },
      },
    ],
  },
  communityRouter,
  {
    path: '/design',
    component: Layout,
    redirect: '/design/index',
    children: [
      {
        path: 'index',
        component: () => import('@views/design/index.vue'),
        name: 'Design',
        meta: {
          title: '服装图案管理',
          icon: 'dashboard',
        },
      },
    ],
  },
]

export const asyncRoutes = [
  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    name: 'User',
    children: [
      {
        path: 'index',
        component: () => import('@views/User.vue'),
        name: 'UserIndex',
        meta: {
          title: '用户管理',
          icon: 'user',
          roles: ['admin'],
        },
      },
    ],
  },
  {
    path: '/islander',
    component: Layout,
    redirect: '/islander/index',
    name: 'Islander',
    children: [
      {
        path: 'index',
        component: () => import('@views/archive/Islander.vue'),
        name: 'IslanderIndex',
        meta: {
          title: '岛民',
          icon: 'people',
          roles: ['admin'],
        },
      },
    ],
  },
  museumRouter,
  archiveRouter,
  guideRouter,
  {
    path: '/banner',
    component: Layout,
    redirect: '/banner/index',
    name: 'Banner',
    children: [
      {
        path: 'index',
        component: () => import('@views/Banner.vue'),
        name: 'BannerIndex',
        meta: {
          title: '焦点图',
          icon: 'banner',
          roles: ['admin'],
        },
      },
    ],
  },
  {
    path: '/comment',
    component: Layout,
    redirect: '/comment/index',
    name: 'Comment',
    children: [
      {
        path: 'index',
        component: () => import('@views/comment/index.vue'),
        name: 'CommentIndex',
        meta: {
          title: '评论管理',
          icon: 'message',
          roles: ['admin'],
        },
      },
    ],
  },
  optionRouter,
  // 404 page must be placed at the end !!!
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/404',
    meta: {
      hidden: true,
    },
  },
]

const router = createRouter({
  scrollBehavior: () => ({
    top: 0,
  }),
  history: createWebHashHistory(),
  routes: constantRoutes,
})

// 动态批量添加路由
export function addRoutes(routes) {
  routes.forEach(route => {
    if (router.hasRoute(route.name)) return
    router.addRoute(route)
  })
}

// 删除所有动态添加的路由
export function resetRouter() {
  const newRouter = router
  router.matcher = newRouter.matcher
  // asyncRoutes.forEach(route => {
  //   if (route.name) {
  //     router.removeRoute(route.name)
  //   }
  // })
}

export default router
