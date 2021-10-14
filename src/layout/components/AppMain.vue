<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in" appear>
        <keep-alive :include="cachedViews">
          <component :is="Component" :key="route.path" />
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<script>
import { defineComponent, computed, h, resolveDynamicComponent } from 'vue'
import { useStore } from 'vuex'

// const DynamicComponent = defineComponent({
//   props: ['comp', 'route'],
//   render() {
//     const Component = resolveDynamicComponent(this.comp)
//     return h(Component)
//   },
// })

export default defineComponent({
  name: 'AppMain',
  props: { isShowMain: Boolean },
  // components: { DynamicComponent },
  setup() {
    const store = useStore()
    return {
      cachedViews: computed(() => store.getters.cachedViews),
    }
  },
})
</script>

<style lang="scss" scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: $bgGreen;
}
.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
