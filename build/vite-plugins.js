import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers' // ElementPlus 组件专用的内置解析器
import ElementPlus from 'unplugin-element-plus/vite' // 按需导入 element-plus 样式插件

import { viteMockServe } from 'vite-plugin-mock'
import viteSvgIcons from 'vite-plugin-svg-icons'

import viteCompression from 'vite-plugin-compression'
import viteImagemin from 'vite-plugin-imagemin'
import { createHtmlPlugin } from 'vite-plugin-html' // https://github.com/vbenjs/vite-plugin-html
// import legacy from '@vitejs/plugin-legacy'
import { visualizer } from 'rollup-plugin-visualizer'

export function createVitePlugins(viteEnv, isBuild) {
  const vitePlugins = [
    vue(),
    vueJsx(), // 提供 Vue 3 JSX & TSX 支持（通过 专用的 Babel 转换插件）
    viteMockServe({ supportTs: false }),
    Components({
      resolvers: [ElementPlusResolver()], // 配置启用 ElementPlus 专用的 UI 组件解析器
      exclude: [
        /[\\/]node_modules[\\/]/,
        /[\\/]\.git[\\/]/,
        /[\\/]\.nuxt[\\/]/,
        /[\\/]SvgIcon\.vue[\\/]/,
      ],
    }),
    ElementPlus({ useSource: true }),
    viteSvgIcons({
      // 配置路径在你的src里的svg存放文件
      iconDirs: [resolve(process.cwd(), 'src/icons')],
      symbolId: 'icon-[dir]-[name]',
    }),
    visualizer({
      // 可视化分析构建
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ]
  if (isBuild) {
    vitePlugins.push([
      viteImagemin({
        gifsicle: {
          optimizationLevel: 7,
          interlaced: false,
        },
        optipng: {
          optimizationLevel: 7,
        },
        mozjpeg: {
          quality: 20,
        },
        pngquant: {
          quality: [0.8, 0.9],
          speed: 4,
        },
        svgo: {
          plugins: [
            {
              name: 'removeViewBox',
            },
            {
              name: 'removeEmptyAttrs',
              active: false,
            },
          ],
        },
      }),
      viteCompression({
        // deleteOriginFile: true
      }),
      // legacy({
      //   targets: ['defaults', 'not IE 11'], // 为打包后的文件提供旧版浏览器兼容性支持
      // }),
      createHtmlPlugin({
        minify: isBuild,
        // entry: 'src/main.ts', // @default src/main.ts
        // template: 'public/index.html', // @default index.html
        /* Data that needs to be injected into the index.html ejs template */
        inject: {
          data: {
            // title: 'index',
            // injectScript: `<script src="./inject.js"></script>`,
            // tinymce: ,
          },
          // tags: [
          //   {
          //     injectTo: 'body-prepend',
          //     tag: 'script',
          //     attrs: {
          //       src: 'https://cdn.jsdelivr.net/npm/vue@3.2.6/dist/vue.min.js',
          //       rel: 'preload',
          //     },
          //   },
          // ],
        },
      }),
    ])
  }
  return vitePlugins
}
