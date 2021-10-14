<template>
  <guide-detail :is-edit="false" />
</template>

<script>
import { defineComponent } from 'vue'
import GuideDetail from './components/GuideDetail.vue'

export default defineComponent({
  name: 'GuideAdd',
  components: { GuideDetail },
})
</script>
