import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'

import { viteMockServe } from 'vite-plugin-mock'
import viteSvgIcons from 'vite-plugin-svg-icons'

import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default ({ mode }) =>
  defineConfig({
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@api': path.resolve(__dirname, 'src/api'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@composables': path.resolve(__dirname, 'src/composables'),
        '@layout': path.resolve(__dirname, 'src/layout'),
        '@router': path.resolve(__dirname, 'src/router'),
        '@settings': path.resolve(__dirname, 'src/settings'),
        '@store': path.resolve(__dirname, 'src/store'),
        '@styles': path.resolve(__dirname, 'src/styles'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@views': path.resolve(__dirname, 'src/views'),
      },
    },
    plugins: [
      vue(),
      vueJsx(),
      viteMockServe({ supportTs: false }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      ElementPlus({ useSource: true }),
      viteSvgIcons({
        // 配置路劲在你的src里的svg存放文件
        iconDirs: [path.resolve(process.cwd(), 'src/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
      viteCompression(),
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
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
      rollupOptions: {
        output: {
          manualChunks: {
            // 拆分代码，这个就是分包，配置完后自动按需加载，现在还比不上webpack的splitchunk，不过也能用了。
            // vue: ['vue', 'vue-router', 'vuex'],
            // echarts: ['echarts'],
          },
        },
      },
      brotliSize: false,
    },
    server: {
      port: 3333, // 开发服务器端口
      proxy: {
        [loadEnv(mode, process.cwd()).VITE_APP_BASE_API]: {
          target: loadEnv(mode, process.cwd()).VITE_APP_REAL_API, // 腾讯云服务器
          // target: 'http://localhost:3003', // animal_server
          changeOrigin: true,
          rewrite: path => {
            const apiString = loadEnv(mode, process.cwd()).VITE_APP_BASE_API
            const envApi = new RegExp(apiString, 'g')
            // return path.replace(/^\/[apiString]/, '')
            return path.replace(envApi, '')
          },
        },
      },
    },
  })
