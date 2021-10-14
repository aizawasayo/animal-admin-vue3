<template>
  <option-index
    :tab-options="tabOptions"
    :active-tab="activeName"
  ></option-index>
</template>

<script>
import { defineComponent, ref, onBeforeMount, watch } from 'vue'
import { useRoute } from 'vue-router'
import OptionIndex from './components/OptionIndex.vue'

export default defineComponent({
  name: 'ClothingSetting',
  components: { OptionIndex },
  setup() {
    const route = useRoute()
    const activeName = ref('clothingType')

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
        { label: '服饰类型', key: 'clothingType' },
        { label: '服饰来源', key: 'clothingChannels' },
        { label: '服饰颜色', key: 'clothingColor' },
        { label: '服饰风格', key: 'clothingStyle' },
        { label: '服饰主题', key: 'clothingTheme' },
      ],
    }
  },
})
</script>
