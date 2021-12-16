import { ref, watch, nextTick } from 'vue'
import { ElLoading } from 'element-plus'

export default function useLoading(target, isLoading, text = '数据加载中') {
  const loadingInstance = ref(null)

  watch(
    [isLoading, target],
    vals => {
      if (vals[0] && vals[1]) {
        nextTick(() => {
          loadingInstance.value = ElLoading.service({
            target: vals[1].$el,
            fullscreen: vals[1].$el === undefined ? true : false,
            text,
          })
        })
      } else {
        nextTick(() => {
          if (loadingInstance.value) loadingInstance.value.close()
        })
      }
    },
    { immediate: true }
  )
}
