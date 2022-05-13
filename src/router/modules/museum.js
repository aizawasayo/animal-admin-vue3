/** When your routing table is too long, you can split it into small modules **/

import Layout from '@layout/index.vue'

const museumRouter = {
  path: '/museum',
  component: Layout,
  redirect: '/museum/fish',
  name: 'Museum',
  meta: {
    title: '博物馆图鉴',
    icon: 'museum',
    roles: ['admin'],
  },
  children: [
    {
      path: 'fish',
      component: () => import('@views/museum/Fish.vue'),
      name: 'Fish',
      meta: {
        title: '鱼类',
        icon: 'fish',
      },
    },
    {
      path: 'insect',
      component: () => import('@views/museum/Insect.vue'),
      name: 'Insect',
      meta: {
        title: '昆虫',
        icon: 'bug',
      },
    },
    {
      path: 'fossil',
      component: () => import('@views/museum/Fossil.vue'),
      name: 'Fossil',
      meta: {
        title: '化石',
        icon: 'dragon',
      },
    },
    {
      path: 'artwork',
      component: () => import('@views/museum/Artwork.vue'),
      name: 'Artwork',
      meta: {
        title: '艺术品',
        icon: 'art',
      },
    },
    {
      path: 'halobios',
      component: () => import('@views/museum/Halobios.vue'),
      name: 'Halobios',
      meta: {
        title: '海洋生物',
        icon: 'sea',
      },
    },
  ],
}
export default museumRouter
