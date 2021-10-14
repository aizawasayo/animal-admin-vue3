<template>
  <svg-icon v-if="icon" :icon-class="icon"></svg-icon>
  <span v-if="title">{{ title }}</span>
  <!-- <template #title>{{ title }}</template> -->
</template>

<script>
import { toRefs } from 'vue'
export default {
  name: 'MenuItem',
  props: {
    icon: { type: String, default: '' },
    title: { type: String, default: '' },
  },
  setup(props) {
    const { icon, title } = toRefs(props)
    return { icon, title }
  },
}
</script>
