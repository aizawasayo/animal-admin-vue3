<template>
  <div id="tags-view-container" class="tags-view-container" ref="tagsViewRef">
    <ScrollPane
      ref="scrollPaneRef"
      class="tags-view-wrapper"
      @scroll="closeMenu"
      :slotTagRefs="tagRefs"
    >
      <template #default>
        <router-link
          v-for="(tag, i) in visitedViews"
          :ref="
            el => {
              if (el) tagRefs[i] = el
            }
          "
          :key="tag.path"
          :class="isActive(tag) ? 'active' : ''"
          :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
          tag="span"
          class="tags-view-item"
          @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
          @contextmenu.prevent="openMenu(tag, $event)"
        >
          {{ tag.meta.title }}
          <span
            v-if="!isAffix(tag)"
            class="el-icon-close"
            @click.prevent.stop="closeSelectedTag(tag)"
          />
        </router-link>
      </template>
    </ScrollPane>
    <ul
      v-show="visible"
      :style="{ left: left + 'px', top: top + 'px' }"
      class="contextmenu"
    >
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        关闭当前
      </li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭所有</li>
    </ul>
  </div>
</template>

<script>
import path from 'path-browserify'
import {
  computed,
  defineComponent,
  nextTick,
  onBeforeMount,
  ref,
  watch,
  onBeforeUpdate,
  inject,
} from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import ScrollPane from './ScrollPane.vue'

export default defineComponent({
  components: {
    ScrollPane,
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const scrollPaneRef = ref(null)
    const tagsViewRef = ref(null)
    const tagRefs = ref([])

    const visible = ref(false)
    const top = ref(0)
    const left = ref(0)
    const selectedTag = ref({})
    const affixTags = ref([])
    const reloadRoute = inject('reloadRoute')

    const isActive = routeVal => routeVal.path === route.path
    const isAffix = tag => tag.meta && tag.meta.affix

    const visitedViews = computed(() => store.getters.visitedViews)
    const routes = computed(() => store.getters.permission_routes)

    const filterAffixTags = (routes, basePath = '/') => {
      let tags = []

      routes.forEach(route => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta },
          })
        }

        if (route.children) {
          const childTags = filterAffixTags(route.children, route.path)
          if (childTags.length >= 1) tags = tags.concat(childTags)
        }
      })
      return tags
    }

    const initTags = () => {
      affixTags.value = filterAffixTags(routes.value)
      for (const tag of affixTags.value) {
        // Must have tag name
        if (tag.name) store.dispatch('tagsView/addVisitedView', tag)
      }
    }

    const addTags = () => {
      if (route.name) store.dispatch('tagsView/addView', route)
      return false
    }

    const moveToCurrentTag = () => {
      const tags = tagRefs.value
      nextTick(() => {
        if (tags === null || tags === undefined || !Array.isArray(tags)) return

        for (const tag of tags) {
          if (tag.to.path === route.path) {
            scrollPaneRef.value.moveToCurrentTag(tag)
            // When query is different then update
            if (tag.to.fullPath !== route.fullPath) {
              store.dispatch('tagsView/updateVisitedView', route)
            }
          }
        }
      })
    }

    const refreshSelectedTag = view => {
      store.dispatch('tagsView/delCachedView', view)
      const { fullPath } = view
      nextTick(() => {
        // reloadRoute()
        router.replace({ path: '/redirect' + fullPath })
      })
    }
    const closeSelectedTag = view => {
      store.dispatch('tagsView/delView', view)
      if (isActive(view)) toLastView(visitedViews.value, view)
    }
    const closeOthersTags = () => {
      if (
        selectedTag.value.fullPath !== route.path &&
        selectedTag.value.fullPath !== undefined
      ) {
        router.push(selectedTag.value.fullPath).catch(err => {
          console.log(err)
        })
      }
      store.dispatch('tagsView/delOthersViews', selectedTag.value)
    }

    const closeAllTags = view => {
      store.dispatch('tagsView/delAllViews', undefined)
      if (affixTags.value.some(tag => tag.path === route.path)) return
      toLastView(visitedViews.value, view)
    }

    const toLastView = (visitedViews, view) => {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView !== undefined && latestView.fullPath !== undefined) {
        router.push(latestView.fullPath)
      } else {
        // Default redirect to the home page if there is no tags-view, adjust it if you want
        if (view.name === 'Dashboard') {
          // to reload home page
          router.push({ path: '/redirect' + view.fullPath })
        } else {
          router.push('/')
        }
      }
    }
    const openMenu = (tag, e) => {
      const menuMinWidth = 105
      const offsetLeft = tagsViewRef.value.getBoundingClientRect().left // container margin left
      const offsetWidth = tagsViewRef.value.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const mrgleft = e.clientX - offsetLeft + 15 // 15: margin right
      if (mrgleft > maxLeft) {
        left.value = maxLeft
      } else {
        left.value = mrgleft
      }
      top.value = e.clientY
      visible.value = true
      selectedTag.value = tag
    }

    const closeMenu = () => {
      visible.value = false
    }

    watch(
      () => route.name,
      val => {
        if (route.name !== 'Login') {
          addTags()
          moveToCurrentTag()
        }
      }
    )

    watch(visible, value => {
      if (value) {
        document.body.addEventListener('click', closeMenu)
      } else {
        document.body.removeEventListener('click', closeMenu)
      }
    })

    onBeforeMount(() => {
      initTags()
      addTags()
    })

    // 确保在每次更新之前重置ref
    onBeforeUpdate(() => {
      tagRefs.value = []
    })

    return {
      visible,
      top,
      left,
      selectedTag,
      affixTags,
      tagsViewRef,
      tagRefs,
      visitedViews,
      routes,
      scrollPaneRef,
      isActive,
      isAffix,
      refreshSelectedTag,
      closeMenu,
      closeSelectedTag,
      closeOthersTags,
      closeAllTags,
      openMenu,
    }
  },
})
</script>

<style lang="scss" scoped>
// Reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      font-weight: 900;

      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }

      &:hover {
        background-color: $bgGreen;
        color: $green;
      }
    }
  }
}
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #eee;

  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 25px;
      border: 1px solid rgba(124, 141, 181, 0.3);
      border-radius: 4px;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      box-sizing: border-box;

      &:first-of-type {
        margin-left: 15px;
      }

      &:last-of-type {
        margin-right: 15px;
      }

      &.active {
        background-color: $green;
        color: #fff;
      }
    }
  }

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;

    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;

      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
