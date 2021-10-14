<script lang="jsx">
import { defineComponent, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  name: 'Redirect',
  setup() {
    const router = useRouter()
    const route = useRoute()

    const { params, query } = route
    const { path } = params
    router.replace({ path: `/${path}`, query })

    return () => <div></div>
    // return () => <></>
  },
  // render() {
  //   return h()
  // },
})
</script>
