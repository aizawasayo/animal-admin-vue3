<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="false"
        text-color="#3FB984"
      >
        <sidebar-item
          v-for="route in permission_routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
          :is-collapse="isCollapse"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import Logo from './Logo.vue'
import SidebarItem from './SidebarItem.vue'
// import variables from '@styles/variables.module.scss'

export default defineComponent({
  name: 'SideBar',
  components: { SidebarItem, Logo },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    // const isCollapse = ref(true);
    //const routes = computed(() => router.options.routes)
    return {
      isCollapse: computed(() => !store.getters.sidebar.opened),
      showLogo: computed(() => store.state.settings.sidebarLogo),
      routes: computed(() => router.options.routes),
      permission_routes: computed(() => store.getters.permission_routes),
      // variables: computed(() => variables),
      activeMenu: computed(() => {
        const { meta, path } = route
        return meta.activeMenu ? meta.activeMenu : path
      }),
    }
  },
})
</script>
<style></style>
