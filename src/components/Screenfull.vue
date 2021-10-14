<template>
  <div>
    <svg-icon
      :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
      @click="click"
    />
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'
import screenfull from 'screenfull'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'Screenfull',
  setup() {
    const isFullscreen = ref(false)

    const click = () => {
      if (!screenfull.isEnabled) {
        ElMessage({
          message: '您的浏览器不能执行全屏操作',
          type: 'warning',
        })
        return false
      }
      screenfull.toggle()
    }
    const change = () => {
      isFullscreen.value = screenfull.isFullscreen
    }
    const init = () => {
      if (screenfull.isEnabled) {
        screenfull.on('change', change)
      }
    }
    const destroy = () => {
      if (screenfull.isEnabled) {
        screenfull.off('change', change)
      }
    }

    onMounted(init)
    onBeforeUnmount(destroy)

    return {
      isFullscreen,
      click,
    }
  },
})
</script>

<style scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>
