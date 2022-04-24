import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import { createVitePlugins } from './build/vite-plugins'

// https://cn.vitejs.dev/config/
export default ({ command, mode }) => {
  const viteEnv = loadEnv(mode, process.cwd())
  const isBuild = command === 'build'
  return {
    // base: 'https://cdn.example.com/assets/', // CDN（总是 HTTPS 协议）
    // base: '//cdn.example.com/assets/', // CDN（协议相同）
    // base:
    //   mode === 'production'
    //     ? 'https://cdn.jsdelivr.net/gh/aizawasayo/cdn-animal-admin-vue3/dist/'
    //     : '/', // 相当于 webpack 的 publicPath，如果 build.assetsDir 的资源需要放到 cdn，则需要改成 cdn 地址
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@api': resolve(__dirname, 'src/api'),
        '@assets': resolve(__dirname, 'src/assets'),
        '@components': resolve(__dirname, 'src/components'),
        '@composables': resolve(__dirname, 'src/composables'),
        '@layout': resolve(__dirname, 'src/layout'),
        '@router': resolve(__dirname, 'src/router'),
        '@settings': resolve(__dirname, 'src/settings'),
        '@store': resolve(__dirname, 'src/store'),
        '@styles': resolve(__dirname, 'src/styles'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@views': resolve(__dirname, 'src/views'),
      },
    },
    plugins: createVitePlugins(viteEnv, isBuild),
    css: {
      preprocessorOptions: {
        scss: {
          // 自定义 element 主题样式
          //additionalData: `@use "./src/styles/variables.module.scss";`,
          additionalData: `@use "@styles/element/index.scss" as *;`,
        },
      },
    },
    build: {
      assetsDir: 'static',
      // minify: 'terser', // 'esbuild'
      // terserOptions: {
      //   compress: {
      //     // warnings: false,
      //     drop_console: true, // 打包时删除 console
      //     pure_funcs: ['console.log'],
      //   },
      //   output: {
      //     comments: true, // 去掉注释内容
      //   },
      // },
      // sourcemap: false, // 等于 rollupOption.output.sourcemap
      // lib: {entry，name?, formats?, fileName?}, // 库模式
      rollupOptions: {
        // https://rollupjs.org/guide/en/#big-list-of-options
        input: {
          // 指定入口， 相当于 webpack 的 entry， vite 会解析 HTML 中的 script 标签来找到入口的 js 文件。
          main: resolve(__dirname, 'index.html'),
          // nested: resolve(__dirname, 'nested/index.html')
        },
        // input: resolve(__dirname, 'index.html'),
        // input: resolve(__dirname, 'src/main.ts'),
        // external:  ['vue', 'vuex', 'vueRouter' ], // 确保外部化处理一些你不想打包进库的依赖
        output: {
          // manualChunks(id) { // 按照 npm 包名拆分 js
          //   if (id.includes('node_modules')) {
          //     return id
          //       .toString()
          //       .split('node_modules/')[1]
          //       .split('/')[0]
          //       .toString()
          //   }
          // },
          manualChunks: {
            // https://rollupjs.org/guide/en/#outputmanualchunks
            // 拆分代码/分包，配置完后自动按需加载，细度现在还比不上 webpack 的 splitchunk，不过也能用了。
            vue: ['vue', 'vue-router', 'vuex'],
            zrender: ['zrender'],
            echarts: ['echarts'],
          },
          entryFileNames: 'static/js/[name]-[hash].js',
          chunkFileNames: 'static/js/[name]-[hash].js', // https://rollupjs.org/guide/en/#outputchunkfilenames
          // assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
          assetFileNames: assetInfo => {
            const fileExt = assetInfo.name.split('.')[1]
            if (
              ['png', 'jpeg', 'jpg', 'gif', 'webp', 'avif'].includes(fileExt)
            ) {
              return 'static/img/[name]-[hash].[ext]'
            } else if (fileExt === 'svg') {
              return 'static/svg/[name]-[hash].[ext]'
            } else if (
              ['woff2', 'woff', 'eot', 'ttf', 'otf'].includes(fileExt)
            ) {
              return 'static/fonts/[name]-[hash].[ext]'
            } else {
              return 'static/[ext]/[name]-[hash].[ext]'
            }
          },
          // dir: 'dist', // 放置所有生成的包的目录。如果生成了多个块，则需要此选项。否则，可以改用 file 选项。
          // file: 'bundle.js', // 在只输出一个文件时使用。 // 指定输出的路径/文件名。如果配置了 output.sourcemap，还将用于生成 sourcema 名称。
          // format: 'cjs', // 指定输出包的格式，默认 ‘es’, 可选值枚举【'amd｜cjs｜es｜iife｜umd｜system｜'】
          // name: 'bundleName', // 如果是 iife｜umd ，也就是库，则需要指定这个包的全局变量名
          // globals: { // 为这些外部导入的 umd/iife 包依赖提供一个全局变量
          //   vue: 'Vue',
          // },
          // paths: { // 用于提供 externals 的外部引用路径，比如 cdn
          //   jquery: 'https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js',
          // },
          // sourcemap: false,
        },
      },
      // chunkSizeWarningLimit: 500, // 默认 500k
      brotliSize: false,
    },
    server: {
      port: 3333, // 开发服务器端口
      proxy: {
        [viteEnv.VITE_APP_BASE_API]: {
          target: viteEnv.VITE_APP_REAL_API, // 腾讯云服务器
          // target: 'http://localhost:3003', // animal_server
          changeOrigin: true,
          rewrite: path => {
            const apiString = viteEnv.VITE_APP_BASE_API
            const envApi = new RegExp(apiString, 'g')
            // return path.replace(/^\/[apiString]/, '')
            return path.replace(envApi, '')
          },
        },
      },
    },
  }
}
