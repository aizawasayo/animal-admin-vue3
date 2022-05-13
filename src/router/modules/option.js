/** When your routing table is too long, you can split it into small modules **/

import Layout from '@layout/index.vue'

const optionRouter = {
  path: '/option',
  component: Layout,
  redirect: '/option/general',
  name: 'Option',
  meta: {
    title: '选项配置',
    icon: 'setting',
    roles: ['admin'],
  },
  children: [
    {
      path: 'general',
      component: () => import('@views/option/General.vue'),
      name: 'GeneralSetting',
      meta: {
        title: '通用配置',
        icon: 'table',
      },
    },
    {
      path: 'islander',
      component: () => import('@views/option/Islander.vue'),
      name: 'IslanderSetting',
      meta: {
        title: '岛民配置',
        icon: 'people',
      },
    },
    {
      path: 'furniture',
      component: () => import('@views/option/Furniture.vue'),
      name: 'FurnitureSetting',
      meta: {
        title: '家具配置',
        icon: 'furniture',
      },
    },
    {
      path: 'clothing',
      component: () => import('@views/option/Clothing.vue'),
      name: 'ClothingSetting',
      meta: {
        title: '服饰配置',
        icon: 'theme',
      },
    },
    {
      path: 'fish',
      component: () => import('@views/option/Fish.vue'),
      name: 'FishSetting',
      meta: {
        title: '鱼类配置',
        icon: 'fish',
      },
    },
    {
      path: 'insect',
      component: () => import('@views/option/Insect.vue'),
      name: 'InsectSetting',
      meta: {
        title: '昆虫配置',
        icon: 'bug',
      },
    },
    {
      path: 'halobios',
      component: () => import('@views/option/Halobios.vue'),
      name: 'HalobiosSetting',
      meta: {
        title: '海洋生物配置',
        icon: 'sea',
      },
    },
    {
      path: 'tool',
      component: () => import('@views/option/Tool.vue'),
      name: 'ToolSetting',
      meta: {
        title: '工具配置',
        icon: 'tool',
      },
    },
    {
      path: 'diy',
      component: () => import('@views/option/DiyOption.vue'),
      name: 'DiySetting',
      meta: {
        title: 'DIY配置',
        icon: 'book',
      },
    },
  ],
}
export default optionRouter
