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
//当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
redirect: 'noRedirect'




name: 'router-name' // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
meta: {
  roles: ['admin', 'editor'] // 设置该路由进入的权限，支持多个权限叠加
  title: 'title' // 设置该路由在侧边栏和面包屑中展示的名字
  icon: 'svg-name' // 设置该路由的图标，支持 svg-class，也支持 el-icon-x element-ui 的 icon
  noCache: true // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
  breadcrumb: false //  如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
  affix: true // 若果设置为true，它则会固定在tags-view中(默认 false)
  hidden: true // (默认 false) // 当设置 true 的时候该路由不会在侧边栏出现 如 404，login等页面，或者如一些编辑页面/edit/1
 
  // SidebarItem 组件的默认逻辑为，当一个路由下面的 children 路由大于 >1 时，会自动变成嵌套的模式。如果子路由正好一个就会默认将子路由作为根路由显示在侧边栏中，若不想这样，可以通过设置在根路由中设置 alwaysShow: true来取消这一特性
  alwaysShow: true // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
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
    path: '/password',
    component: Layout,
    redirect: '/password/index', // 重定向地址，在面包屑中点击会重定向去的地址
    children: [
      {
        path: 'index',
        component: () => import('@views/Password.vue'),
        name: 'Password',
        meta: {
          title: '修改密码',
        },
      },
    ],
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
    meta: { roles: ['admin'] },
    children: [
      {
        path: 'index',
        component: () => import('@views/User.vue'),
        name: 'UserIndex',
        meta: {
          title: '用户管理',
          icon: 'user',
        },
      },
    ],
  },
  {
    path: '/islander',
    component: Layout,
    redirect: '/islander/index',
    name: 'Islander',
    meta: { roles: ['admin'] },
    children: [
      {
        path: 'index',
        component: () => import('@views/archive/Islander.vue'),
        name: 'IslanderIndex',
        meta: {
          title: '岛民',
          icon: 'people',
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
    meta: { roles: ['admin'] },
    children: [
      {
        path: 'index',
        component: () => import('@views/Banner.vue'),
        name: 'BannerIndex',
        meta: {
          title: '焦点图',
          icon: 'banner',
        },
      },
    ],
  },
  {
    path: '/comment',
    component: Layout,
    redirect: '/comment/index',
    name: 'Comment',
    meta: { roles: ['admin'] },
    children: [
      {
        path: 'index',
        component: () => import('@views/comment/index.vue'),
        name: 'CommentIndex',
        meta: {
          title: '评论管理',
          icon: 'message',
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
