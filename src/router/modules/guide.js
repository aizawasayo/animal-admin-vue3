/** When your routing table is too long, you can split it into small modules **/
import Layout from '@layout/index.vue'

const guideRouter = {
  path: '/guide',
  component: Layout,
  redirect: '/guide/index',
  name: 'Guide',
  children: [
    {
      path: 'index',
      component: () => import('@views/guide/index.vue'),
      name: 'GuideIndex',
      meta: {
        title: '攻略管理',
        icon: 'guide',
        roles: ['admin'],
      },
    },
    {
      path: 'add',
      component: () => import('@views/guide/Add.vue'),
      name: 'GuideAdd',
      meta: {
        title: '新增攻略',
        icon: 'create',
        noCache: true,
        activeMenu: '/guide/index',
        roles: ['admin'],
      },
      hidden: true,
    },
    {
      path: 'edit/:id',
      component: () => import('@views/guide/Edit.vue'),
      name: 'GuideEdit',
      meta: {
        title: '编辑攻略',
        noCache: true,
        activeMenu: '/guide/index',
        roles: ['admin'],
      },
      hidden: true,
    },
  ],
}
export default guideRouter
