import Layout from '@layout/index.vue'

const communityRouter = {
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
}

export default communityRouter
