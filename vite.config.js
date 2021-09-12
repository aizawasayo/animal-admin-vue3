import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'
import { defineConfig } from 'vite'
import { viteMockServe } from 'vite-plugin-mock'
import viteSvgIcons from 'vite-plugin-svg-icons'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@composables': path.resolve(__dirname, 'src/composables'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@router': path.resolve(__dirname, 'src/router'),
      '@views': path.resolve(__dirname, 'src/views'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@layout': path.resolve(__dirname, 'src/layout'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@settings': path.resolve(__dirname, 'src/settings'),
    },
  },
  plugins: [
    vue(),
    vueJsx(),
    viteMockServe({ supportTs: false }),
    viteSvgIcons({
      // 配置路劲在你的src里的svg存放文件
      iconDirs: [path.resolve(process.cwd(), 'src/icons')],
      symbolId: 'icon-[dir]-[name]',
    }),
    // importElementPlus({
    //   useSource: true,
    // }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://106.54.168.208:1016', // 腾讯云服务器
        // target: 'http://localhost:1016',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
})
