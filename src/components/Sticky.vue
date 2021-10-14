<template>
  <div :style="{ height: height + 'px', zIndex: zIndex }" ref="elRef">
    <div
      :class="className"
      :style="{
        top: isSticky ? stickyTop + 'px' : '',
        zIndex: zIndex,
        position: position,
        width: width,
        height: height + 'px',
      }"
    >
      <slot>
        <div>sticky</div>
      </slot>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, onActivated, onUnmounted } from 'vue'

export default defineComponent({
  name: 'Sticky',
  props: {
    stickyTop: {
      type: Number,
      default: 0,
    },
    zIndex: {
      type: Number,
      default: 1,
    },
    className: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const active = ref(false)
    const position = ref('')
    const width = ref(undefined)
    const height = ref(undefined)
    const isSticky = ref(false)
    const elRef = ref(null)

    const reset = () => {
      position.value = ''
      width.value = 'auto'
      active.value = false
      isSticky.value = false
    }

    const sticky = () => {
      if (active.value) return
      position.value = 'fixed'
      active.value = true
      width.value = width.value + 'px'
      isSticky.value = true
    }

    const handleReset = () => {
      if (!active.value) {
        return
      }
      reset()
    }

    const handleScroll = () => {
      const w = elRef.value.getBoundingClientRect().width
      width.value = w?.toString() + 'px' || 'auto'
      const offsetTop = elRef.value.getBoundingClientRect().top
      if (offsetTop < props.stickyTop) {
        sticky()
        return
      }
      handleReset()
    }

    const handleResize = () => {
      if (isSticky.value) {
        width.value = elRef.value.getBoundingClientRect().width + 'px'
      }
    }

    onMounted(() => {
      height.value = elRef.value.getBoundingClientRect().height
      window.addEventListener('scroll', handleScroll)
      window.addEventListener('resize', handleResize)
    })

    onActivated(handleScroll)

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    })

    return {
      active,
      position,
      width,
      height,
      isSticky,
      elRef,
    }
  },
})
</script>
