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
  name: 'GeneralSetting',
  components: { OptionIndex },
  setup() {
    const route = useRoute()
    const activeName = ref('rarity')

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
        { label: '稀有程度', key: 'rarity' },
        { label: '动森活动', key: 'activity' },
        { label: '季节', key: 'season' },
        { label: '话题', key: 'topic' },
      ],
    }
  },
})
</script>
