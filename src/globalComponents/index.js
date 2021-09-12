// 自动注册全局组件
// const requireContext = require.context('./', true, /\.vue$/)
const componentFiles = import.meta.globEager('./**/*.vue')

// 注册当前目录下的所有 .vue 文件，包括子目录
export default function registerAllComponents(app) {
  Object.keys(componentFiles).forEach(comp => {
    const vueComp = componentFiles[comp]
    // default.name 就是我们 .vue 组件导出的 name
    const compName = vueComp.default.name
      ? vueComp.default.name
      : /\/([\w-]+)\.vue$/.exec(comp)[1]
    app.component(compName, vueComp.default)
  })
}
