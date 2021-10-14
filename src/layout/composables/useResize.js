import { computed, onBeforeMount, onBeforeUnmount, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

export default function useResize() {
  const { body } = document
  const WIDTH = 992
  const store = useStore()
  const route = useRoute()
  const device = computed(() => store.getters.device)
  const sidebar = computed(() => store.getters.sidebar)

  const $_isMobile = () => body.getBoundingClientRect().width - 1 < WIDTH

  const $_resizeHandler = () => {
    if (!document.hidden) {
      store.dispatch('app/toggleDevice', $_isMobile() ? 'mobile' : 'desktop')

      if ($_isMobile()) {
        store.dispatch('app/closeSideBar', { withoutAnimation: true })
      }
    }
  }
  onBeforeMount(() => {
    window.addEventListener('resize', $_resizeHandler)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('resize', $_resizeHandler)
  })
  onMounted(() => {
    if ($_isMobile()) {
      store.dispatch('app/toggleDevice', 'mobile')
      store.dispatch('app/closeSideBar', { withoutAnimation: true })
    }
  })
  watch(route, () => {
    if (device.value === 'mobile' && sidebar.value.opened) {
      store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  })

  return { device, sidebar }
}
