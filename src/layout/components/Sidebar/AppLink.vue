<template>
  <a v-if="isExternalLink" v-bind="$attrs" :href="to" target="_blank">
    <slot />
  </a>
  <router-link
    v-else
    v-bind="$props"
    custom
    v-slot="{ isActive, href, navigate }"
  >
    <a
      v-bind="$attrs"
      :href="href"
      @click="navigate"
      :class="isActive ? activeClass : inactiveClass"
    >
      <slot />
    </a>
  </router-link>
</template>

<script>
import { computed, toRef } from 'vue'
import { RouterLink, useLink } from 'vue-router'
import { isExternal } from '@utils/validate'

export default {
  name: 'AppLink',
  props: {
    // 如果使用 TypeScript，请添加 @ts-ignore
    ...RouterLink.props,
    inactiveClass: { type: String },
  },
  setup(props) {
    // console.log(props)
    const { navigate, href, route, isActive, isExactActive } = useLink(
      toRef(props, 'to')
    )

    const isExternalLink = computed(() => isExternal(href))
    return {
      navigate,
      href,
      route,
      isActive,
      isExactActive,
      isExternalLink,
    }
  },
}
</script>
