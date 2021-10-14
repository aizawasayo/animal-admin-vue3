import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
export default function useFixiOSBug($subMenu) {
  const store = useStore()
  const device = computed(() => store.state.app.device)

  const fixBugIniOS = () => {
    if ($subMenu) {
      const handleMouseleave = $subMenu.handleMouseleave
      $subMenu.handleMouseleave = e => {
        if (device.value === 'mobile') {
          return
        }
        handleMouseleave(e)
      }
    }
  }
  onMounted(fixBugIniOS)

  return {}
}
