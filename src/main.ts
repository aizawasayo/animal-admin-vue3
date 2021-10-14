import { createApp } from 'vue'
import './styles/index.scss'
import router from './router'
import store from './store'
import App from './App.vue'
import filters from './filters' // filters 全局过滤器改造
import 'vite-plugin-svg-icons/register'
import SvgIcon from '@components/SvgIcon.vue'
import registerAllComponents from './globalComponents'
import defineConstant from './plugins/constant'
import installElementPlus from './plugins/element' // 注册 ElementPlus 指令
import dayjs from 'dayjs'
import '@/permission' // permission control
// import './theme/index.css'
import * as commonApi from './utils/common'

const app = createApp(App).use(router).use(store)

// 模版过滤器
app.config.globalProperties.$filters = filters
app.config.globalProperties.$commonApi = commonApi
// app.config.compilerOptions.isCustomElement = tag => tag.startsWith('com-')

app.provide('apiUrl', import.meta.env.VITE_APP_BASE_API)
app.provide('update_time', dayjs().format('YYYY-M-D HH:mm:ss'))
defineConstant(app)

installElementPlus(app)
app.component('svg-icon', SvgIcon)
registerAllComponents(app)

router.isReady().then(() => app.mount('#app'))
// app.mount('#app')
