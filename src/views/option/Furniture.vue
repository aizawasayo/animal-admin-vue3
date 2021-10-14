<template>
  <option-index
    :tab-options="tabOptions"
    :active-tab="activeName"
  ></option-index>
</template>

<script>
import { defineComponent, ref, watch, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import OptionIndex from './components/OptionIndex.vue'

export default defineComponent({
  name: 'FurnitureSetting',
  components: { OptionIndex },
  setup() {
    const route = useRoute()
    const activeName = ref('furnitureType')

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
        { label: '家具类型', key: 'furnitureType' },
        { label: '家具来源', key: 'furnitureChannels' },
        { label: '家具系列', key: 'series' },
        { label: '家具尺寸', key: 'size' },
      ],
    }
  },
})
</script>

<style scoped></style>
