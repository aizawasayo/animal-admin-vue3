<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Logo from './Logo.vue'
import SidebarItem from './SidebarItem.vue'
import variables from '@styles/variables.module.scss'

export default defineComponent({
  components: { SidebarItem, Logo },
  setup(props) {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    return {
      isCollapse: computed(() => !store.getters.sidebar.opened),
      showLogo: computed(() => store.state.settings.sidebarLogo),
      routes: computed(() => router.options.routes),
      activeMenu: computed(() => {
        const { meta, path } = route
        return meta.activeMenu ? meta.activeMenu : path
      }),
      variables: computed(() => variables),
    }
  },
})
</script>
