import '@/permission' // permission control
import SvgIcon from '@components/SvgIcon.vue'
import 'element-plus/dist/index.css'
import 'vite-plugin-svg-icons/register'
import { createApp } from 'vue'
import App from './App.vue'
import filters from './filters' // filters 全局过滤器改造
import registerAllComponents from './globalComponents'
import installElementPlus from './plugins/element'
import router from './router'
import store from './store'
import './styles/index.scss'
import * as commonApi from './utils/common'

const app = createApp(App).use(router).use(store)
// 模版过滤器
app.config.globalProperties.$filters = filters
app.config.globalProperties.$commonApi = commonApi
// app.config.compilerOptions.isCustomElement = tag => tag.startsWith('com-')

app.provide('user', 'aizawasayo')
app.provide('apiUrl', import.meta.env.VITE_APP_BASE_API)

installElementPlus(app)
app.component('svg-icon', SvgIcon)
registerAllComponents(app)

// router.isReady().then(() => app.mount('#app'))
app.mount('#app')
