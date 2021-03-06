<template>
  <div v-if="!(item.meta && item.meta.hidden)">
    <template
      v-if="theOnlyOneChild && !theOnlyOneChild.children && !alwaysShowRootMenu"
    >
      <app-link
        v-if="theOnlyOneChild.meta"
        :to="resolvePath(theOnlyOneChild.path)"
      >
        <el-menu-item :index="resolvePath(theOnlyOneChild.path)">
          <item
            v-if="theOnlyOneChild.meta"
            :icon="theOnlyOneChild.meta && theOnlyOneChild.meta.icon"
            :title="theOnlyOneChild.meta.title"
          />
        </el-menu-item>
      </app-link>
    </template>
    <el-sub-menu v-else :index="resolvePath(item.path)">
      <!-- popper-append-to-body -->
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
          :item="child"
          :is-collapse="isCollapse"
          :is-first-level="false"
          :base-path="resolvePath(child.path)"
          class="nest-menu"
        />
      </template>
    </el-sub-menu>
  </div>
</template>

<script lang="ts">
import path from 'path-browserify'
import { defineComponent, computed, PropType, toRefs } from 'vue'
import { RouteRecordRaw } from 'vue-router'
import { isExternal } from '@utils/validate'
import AppLink from './Link.vue'
import Item from './Item.vue'
import { ElMenuItem, ElSubMenu } from 'element-plus'

export default defineComponent({
  name: 'SidebarItem',
  props: {
    item: {
      type: Object as PropType<RouteRecordRaw>,
      required: true,
    },
    isCollapse: {
      type: Boolean,
      required: false,
    },
    isFirstLevel: {
      type: Boolean,
    },
    basePath: {
      type: String,
      required: true,
    },
  },
  components: { Item, AppLink, ElMenuItem, ElSubMenu },
  setup(props) {
    const { item } = toRefs(props)

    const alwaysShowRootMenu = computed(
      () => item.value.meta && item.value.meta.alwaysShow
    )
    const showingChildNumber = computed(() => {
      if (item.value.children) {
        const showingChildren = item.value.children.filter(
          child => !(child.meta && child.meta.hidden)
        )
        return showingChildren.length
      }
      return 0
    })

    const theOnlyOneChild = computed(() => {
      if (showingChildNumber.value > 1) {
        return null
      }
      if (props.item.children) {
        for (const child of props.item.children) {
          if (!(child.meta && child.meta.hidden)) {
            return child
          }
        }
      }
      // If there is no children, return itself with path removed,
      // because this.basePath already conatins item's path information
      return { ...props.item, path: '' }
    })

    const resolvePath = (routePath: string) => {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(props.basePath)) {
        return props.basePath
      }
      return path.resolve(props.basePath, routePath)
    }

    return {
      alwaysShowRootMenu,
      showingChildNumber,
      theOnlyOneChild,
      resolvePath,
    }
  },
})
</script>

<style lang="scss" scoped></style>
