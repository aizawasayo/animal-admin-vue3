<template>
  <!-- eslint-disable vue/require-component-is -->
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { isExternal } from '@utils/validate'

export default defineComponent({
  props: { to: { type: String, required: true } },
  setup(props) {
    // console.log(props)
    const linkProps = to => {
      if (isExternal(props.to)) {
        // 判断是不是外部链接 🔗
        return { href: to, target: '_blank', rel: 'noopener' }
      }
      return { to }
    }
    return {
      type: computed(() => (isExternal(props.to) ? 'a' : 'router-link')),
      linkProps,
    }
  },
})
</script>
