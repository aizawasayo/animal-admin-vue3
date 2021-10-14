<template>
  <div v-if="!item.meta || !item.meta.hidden">
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        !item.alwaysShow
      "
    >
      <el-menu-item
        :index="resolvePath(onlyOneChild.path)"
        :class="{ 'submenu-title-noDropdown': !isNest }"
      >
        <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
          <item
            :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
            :title="onlyOneChild.meta.title"
          />
        </app-link>
      </el-menu-item>
    </template>
    <el-sub-menu
      v-else
      ref="subMenu"
      :index="resolvePath(item.path)"
      popper-append-to-body
    >
      <template #title>
        <item
          v-if="item.meta"
          :icon="item.meta && item.meta.icon"
          :title="item.meta.title"
        />
      </template>
      <template v-if="item.children">
        <sidebar-item
          v-for="child in item.children"
          :key="child.path"
          :is-nest="true"
          :item="child"
          :base-path="resolvePath(child.path)"
          :is-collapse="isCollapse"
          class="nest-menu"
        />
      </template>
    </el-sub-menu>
  </div>
</template>

<script>
import { defineComponent, ref, toRefs } from 'vue'
import path from 'path-browserify'
import { isExternal } from '@utils/validate'
import Item from './Item.vue'
import AppLink from './Link.vue'
import useFixiOSBug from './useFixiOSBug'

export default defineComponent({
  name: 'SidebarItem',
  components: { Item, AppLink },
  props: {
    // route object
    item: { type: Object, required: true },
    isNest: { type: Boolean, default: false },
    basePath: { type: String, default: '' },
    isCollapse: { type: Boolean, required: false },
  },
  setup(props) {
    // console.log(item.value, basePath.value)
    const subMenu = ref(null)
    const onlyOneChild = ref(null)
    useFixiOSBug(subMenu)

    const hasOneShowingChild = (children = [], parent) => {
      const showingChildren = children.filter(item => {
        if (item.meta.hidden) {
          return false
        }
        // Temp set(will be used if only has one showing child)
        onlyOneChild.value = item
        return true
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        onlyOneChild.value = { ...parent, path: '/', noShowingChildren: true }
        return true
      }

      return false
    }
    const resolvePath = routePath => {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(props.basePath)) {
        return props.basePath
      }
      console.log(
        props.basePath,
        routePath,
        path.resolve(props.basePath, routePath)
      )
      return path.resolve(props.basePath, routePath)
    }
    return {
      subMenu,
      onlyOneChild,
      hasOneShowingChild,
      resolvePath,
    }
  },
  // setup(){
  //   const onlyOneChild = ref(null)
  // },
})
</script>
