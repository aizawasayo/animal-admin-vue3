import store from '@store'
import {
  ElBreadcrumb,
  ElButton,
  ElCascader,
  ElCheckbox,
  ElCol,
  ElDatePicker,
  ElDialog,
  ElDropdown,
  ElForm,
  ElInput,
  ElInputNumber,
  ElLoading,
  ElMenu,
  ElPagination,
  ElRadio,
  ElRow,
  ElScrollbar,
  ElSelect,
  ElSwitch,
  ElTable,
  ElTabs,
  ElTag,
  ElTimePicker,
  ElTimeSelect,
  ElTooltip,
  ElUpload,
} from 'element-plus'
import { reactive } from 'vue'

const components = [
  ElBreadcrumb,
  ElButton,
  ElCascader,
  ElCheckbox,
  ElCol,
  ElDatePicker,
  ElDialog,
  ElDropdown,
  ElForm,
  ElInput,
  ElInputNumber,
  ElLoading,
  ElMenu,
  ElPagination,
  ElRadio,
  ElRow,
  ElScrollbar,
  ElSelect,
  ElSwitch,
  ElTable,
  ElTabs,
  ElTag,
  ElTimePicker,
  ElTimeSelect,
  ElTooltip,
  ElUpload,
]

const option = reactive({
  size: store.getters.size,
  zIndex: store.getters.zIndex,
})
export default app => {
  components.forEach(component => {
    app.config.globalProperties.$ELEMENT = option
    app.use(component)
  })
}
