<script>
import { defineComponent, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
export default defineComponent({
  setup() {
    const router = useRouter()
    const route = useRoute()

    const { params, query } = route
    const { path } = params

    router.replace({ path: '/' + path, query })
  },
  render() {
    return h() // avoid warning message
  },
})
</script>
