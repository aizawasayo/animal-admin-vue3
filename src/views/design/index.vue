<template>
  <design-index
    :tab-options="tabOptions"
    :active-tab="activeName"
  ></design-index>
</template>

<script>
import { defineComponent, onBeforeMount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import DesignIndex from './components/DesignIndex.vue'

export default defineComponent({
  name: 'Design',
  components: { DesignIndex },
  setup() {
    const route = useRoute()
    const activeName = ref('clothingDesign')

    onBeforeMount(() => {
      if (route.query.tab) activeName.value = route.query.tab
    })

    watch(
      () => route.query.tab,
      val => {
        if (val) activeName.value = val
      }
    )

    return {
      activeName,
      tabOptions: [
        { label: '衣服', key: 'clothingDesign', icon: 'theme' },
        { label: '帽子', key: 'hatDesign', icon: 'hat' },
        { label: '图案', key: 'patternDesign', icon: 'pattern' },
      ],
    }
  },
})
</script>

<style scoped></style>
