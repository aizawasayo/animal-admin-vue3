import { createStore } from 'vuex'
import getters from './getters'

// 批量倒入 vuex module
// api： https://www.npmjs.com/package/fast-glob
const modulesFiles = import.meta.globEager('./modules/**/*.js')

const modules = {}
for (const key in modulesFiles) {
  modules[key.replace(/(\.\/modules\/|\.js)/g, '')] = modulesFiles[key].default
}

Object.keys(modules).forEach(item => {
  modules[item]['namespaced'] = true
})

// const modules = modulesFiles.keys().reduce((modules, modulePath) => {
//   // set './app.js' => 'app'
//   const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
//   const value = modulesFiles(modulePath)
//   modules[moduleName] = value.default
//   return modules
// }, {})

const store = createStore({
  modules,
  getters,
})

export default store
