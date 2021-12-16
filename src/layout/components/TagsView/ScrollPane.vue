<template>
  <el-scrollbar
    ref="scrollContainerRef"
    :vertical="false"
    class="scroll-container"
    @wheel.prevent="handleScroll"
  >
    <slot />
  </el-scrollbar>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { ElScrollbar } from 'element-plus'
export default defineComponent({
  name: 'ScrollPane',
  components: { ElScrollbar },
  props: ['slotTagRefs'],
  emits: ['scroll'],
  setup(props, { emit }) {
    const scrollContainerRef = ref(null)
    // 包裹容器节点
    const scrollWrapper = computed(
      () => scrollContainerRef.value.wrap as HTMLElement
    )
    const tagSpacing = 4

    const handleScroll = (e: WheelEvent) => {
      const eventDelta = (e as any).wheelDelta || -e.deltaY * 40
      scrollWrapper.value.scrollLeft =
        scrollWrapper.value.scrollLeft + eventDelta / 4
    }
    const moveToCurrentTag = (currentTag: HTMLElement) => {
      const container = scrollContainerRef.value.scrollbar as HTMLElement // scrollbar 节点
      const containerWidth = container.offsetWidth
      const tagList = props.slotTagRefs as any[]

      let fristTag = null
      let lastTag = null

      // find first tag and last tag
      if (tagList.length > 0) {
        fristTag = tagList[0]
        lastTag = tagList[tagList.length - 1]
      }

      // console.log(nextTag, prevTag)

      if (fristTag === currentTag) {
        scrollWrapper.value.scrollLeft = 0
      } else if (lastTag === currentTag) {
        scrollWrapper.value.scrollLeft =
          scrollWrapper.value.scrollWidth - containerWidth
      } else {
        // find preTag and nextTag
        const currentIndex = tagList.findIndex(item => item === currentTag)
        const prevTag = tagList[currentIndex - 1]
        const nextTag = tagList[currentIndex + 1]
        // the tag's offsetLeft after of nextTag

        const afterNextTagOffsetLeft =
          nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagSpacing
        // the tag's offsetLeft before of prevTag
        const beforePrevTagOffsetLeft = prevTag.$el.offsetLeft - tagSpacing

        if (
          afterNextTagOffsetLeft >
          scrollWrapper.value.scrollLeft + containerWidth
        ) {
          scrollWrapper.value.scrollLeft =
            afterNextTagOffsetLeft - containerWidth
        } else if (beforePrevTagOffsetLeft < scrollWrapper.value.scrollLeft) {
          scrollWrapper.value.scrollLeft = beforePrevTagOffsetLeft
        }
      }
    }

    const emitScroll = () => {
      emit('scroll')
    }

    onMounted(() => {
      scrollWrapper.value.addEventListener('scroll', emitScroll, true)
    })

    onBeforeUnmount(() => {
      scrollWrapper.value.removeEventListener('scroll', emitScroll)
    })

    return {
      scrollContainerRef,
      handleScroll,
      moveToCurrentTag,
    }
  },
})
</script>

<style lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
}
.scroll-container :deep(.el-scrollbar__bar) {
  bottom: 0px;
}
</style>
