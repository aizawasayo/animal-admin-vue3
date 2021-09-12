/* Layout */
import Layout from '@layout/index.vue'
import { createRouter, createWebHashHistory } from 'vue-router'
/* Router Modules */
import archiveRouter from './modules/archive'
import guideRouter from './modules/guide'
import museumRouter from './modules/museum'
import optionRouter from './modules/option'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@views/Redirect.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@views/login/index.vue'),
    hidden: true,
  },

  {
    path: '/auth-redirect',
    component: () => import('@views/login/Auth-redirect.vue'),
    hidden: true,
  },

  {
    path: '/404',
    component: () => import('@views/404.vue'),
    hidden: true,
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard', // 重定向地址，在面包屑中点击会重定向去的地址
    children: [
      {
        path: 'dashboard',
        component: () => import('@views/User.vue'),
        name: 'Home',
        meta: {
          title: '首页',
          icon: 'home',
        },
      },
    ],
  },
  {
    path: '/community',
    component: Layout,
    name: 'Community',
    redirect: '/community/board',
    meta: {
      title: '交流区',
      icon: 'example',
    },
    children: [
      {
        path: 'board',
        component: () => import('@views/community/Board.vue'),
        name: 'Board',
        meta: {
          title: '森友墙',
          icon: 'board',
        },
      },
      {
        path: 'turnip',
        component: () => import('@views/community/Turnip.vue'),
        name: 'Turnip',
        meta: {
          title: '菜市场',
          icon: 'rutabaga',
        },
      },
      {
        path: 'trade',
        component: () => import('@views/community/Trade.vue'),
        name: 'Trade',
        meta: {
          title: '交易区',
          icon: 'exchange',
        },
      },
    ],
  },
  {
    path: '/design',
    component: Layout,
    redirect: '/design/board',
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
    hidden: true,
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
  asyncRoutes.forEach(route => {
    if (route.name) {
      router.removeRoute(route.name)
    }
  })
}

export default router
