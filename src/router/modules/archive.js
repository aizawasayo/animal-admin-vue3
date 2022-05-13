/** When your routing table is too long, you can split it into small modules **/

import Layout from '@layout/index.vue'

const archiveRouter = {
  path: '/archive',
  component: Layout,
  redirect: '/archive/furniture',
  name: 'Archive',
  meta: {
    title: '图鉴管理',
    icon: 'component',
    roles: ['admin'],
  },
  children: [
    {
      path: 'furniture',
      component: () => import('@views/archive/Furniture.vue'),
      name: 'Furniture',
      meta: {
        title: '家具',
        icon: 'fish',
      },
    },
    {
      path: 'clothing',
      component: () => import('@views/archive/Clothing.vue'),
      name: 'Clothing',
      meta: {
        title: '服饰',
        icon: 'dress',
      },
    },
    {
      path: 'plant',
      component: () => import('@views/archive/Plant.vue'),
      name: 'Plant',
      meta: {
        title: '植物',
        icon: 'plant',
      },
    },
    {
      path: 'material',
      component: () => import('@views/archive/Material.vue'),
      name: 'Material',
      meta: {
        title: '素材',
        icon: 'shell',
      },
    },
    {
      path: 'tool',
      component: () => import('@views/archive/Tool.vue'),
      name: 'Tool',
      meta: {
        title: '工具',
        icon: 'tool',
      },
    },
    {
      path: 'recipe',
      component: () => import('@views/archive/Recipe.vue'),
      name: 'Recipe',
      meta: {
        title: 'DIY配方',
        icon: 'book',
      },
    },
    {
      path: 'record',
      component: () => import('@views/archive/Record.vue'),
      name: 'Record',
      meta: {
        title: '唱片',
        icon: 'record',
      },
    },
  ],
}
export default archiveRouter
