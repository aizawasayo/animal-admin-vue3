<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span
          v-if="item.redirect === 'noRedirect' || index == levelList.length - 1"
          class="no-redirect"
          >{{ item.meta.title }}</span
        >
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue'
import { useRouter, useRoute, RouteLocationMatched } from 'vue-router'
// import * as pathToRegexp from 'path-to-regexp'
import { compile } from 'path-to-regexp'

export default defineComponent({
  setup() {
    const router = useRouter()
    const route = useRoute()
    const levelList = ref([] as Array<RouteLocationMatched>)

    const isDashboard = (route: RouteLocationMatched) => {
      const name = route && route.name
      if (!name) return false

      return (
        name.toString().trim().toLocaleLowerCase() ===
        'Dashboard'.toLocaleLowerCase()
      )
    }
    const getBreadcrumb = () => {
      // only show routes with meta.title
      let matched = route.matched.filter(item => item.meta && item.meta.title)
      const first = matched[0]

      if (!isDashboard(first)) {
        matched = [{ path: '/', meta: { title: '控制台' } } as any].concat(
          matched
        )
      }

      levelList.value = matched.filter(
        item => item.meta && item.meta.title && item.meta.breadcrumb !== false
      )
    }
    const pathCompile = (path: string) => {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = route
      var toPath = compile(path)
      return toPath(params)
    }
    const handleLink = (item: any) => {
      const { redirect, path } = item
      if (redirect) {
        router.push(redirect)
        return
      }
      router.push(pathCompile(path))
    }
    watch(
      () => route.path,
      path => {
        if (path.startsWith('/redirect/')) return
        getBreadcrumb()
      },
      { immediate: true }
    )
    return { levelList, handleLink }
  },
})
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: $lightGrey;
    cursor: text;
  }
}
</style>
