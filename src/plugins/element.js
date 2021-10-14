import store from '@store'

import {
  ElBreadcrumb,
  ElButton,
  ElCard,
  ElCascader,
  ElCheckbox,
  ElCol,
  ElDatePicker,
  ElDialog,
  ElDivider,
  ElDropdown,
  ElForm,
  ElIcon,
  ElImage,
  ElInput,
  ElInputNumber,
  ElLoading,
  ElMenu,
  ElPagination,
  ElProgress,
  ElRadio,
  ElRow,
  ElScrollbar,
  ElSelect,
  ElSkeleton,
  ElSwitch,
  ElTable,
  ElTabs,
  ElTag,
  ElTimeline,
  ElTimePicker,
  ElTimeSelect,
  ElTooltip,
  ElUpload,
} from 'element-plus'

const components = [
  ElBreadcrumb,
  ElButton,
  ElCard,
  ElCascader,
  ElCheckbox,
  ElCol,
  ElDatePicker,
  ElDialog,
  ElDivider,
  ElDropdown,
  ElForm,
  ElIcon,
  ElImage,
  ElInput,
  ElInputNumber,
  ElLoading,
  ElMenu,
  ElPagination,
  ElProgress,
  ElRadio,
  ElRow,
  ElScrollbar,
  ElSelect,
  ElSkeleton,
  ElSwitch,
  ElTable,
  ElTabs,
  ElTag,
  ElTimeline,
  ElTimePicker,
  ElTimeSelect,
  ElTooltip,
  ElUpload,
]

const option = {
  size: store.getters.size,
  zIndex: store.getters.zIndex,
}

import '../styles/element-variables.scss'

export default app => {
  app.config.globalProperties.$ELEMENT = option
  components.forEach(component => {
    app.use(component)
  })
}
