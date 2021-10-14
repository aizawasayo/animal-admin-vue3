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
  name: 'DiySetting',
  components: { OptionIndex },
  setup() {
    const route = useRoute()
    const activeName = ref('diyType')

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
        { label: 'DIY类型', key: 'diyType' },
        { label: 'DIY来源', key: 'diyChannels' },
        { label: '解锁数量要求', key: 'diyUnlock' },
      ],
    }
  },
})
</script>
