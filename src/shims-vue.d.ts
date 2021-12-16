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

// TODO: remove below after these libs has its typescript file
declare module 'vue-count-to'

declare module 'vue-image-crop-upload'

declare module '@element-plus/icons'

declare module 'path-browserify'

declare module 'js-cookie'
