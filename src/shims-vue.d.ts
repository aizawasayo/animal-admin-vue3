/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.gif' {
  export const gif: any
}

// TODO: remove this part after vue-count-to has its typescript file
declare module 'vue-count-to'
// TODO: remove this part after vue-image-crop-upload has its typescript file
declare module 'vue-image-crop-upload'

declare module '@element-plus/icons'
