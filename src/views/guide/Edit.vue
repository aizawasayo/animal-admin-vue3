<template>
  <guide-detail :is-edit="true" />
</template>

<script>
import { defineComponent } from 'vue'
import GuideDetail from './components/GuideDetail.vue'

export default defineComponent({
  name: 'GuideEdit',
  components: { GuideDetail },
})
</script>
