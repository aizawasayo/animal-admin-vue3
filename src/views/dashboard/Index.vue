<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref } from 'vue'
import { useStore } from 'vuex'
import AdminDashboard from './admin/Index.vue'
import NormalDashboard from './Normal.vue'

export default defineComponent({
  name: 'Dashboard',
  components: {
    AdminDashboard,
    NormalDashboard,
  },
  setup() {
    const store = useStore()
    const currentRole = ref('admin-dashboard')
    const roles = computed(() => store.getters.roles)

    onBeforeMount(() => {
      if (!roles.value.includes('admin')) {
        currentRole.value = 'normal-dashboard'
      }
    })

    return {
      currentRole,
    }
  },
})
</script>
