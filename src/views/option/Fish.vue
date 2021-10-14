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
  name: 'FishSetting',
  components: { OptionIndex },
  setup() {
    const route = useRoute()
    const activeName = ref('fishLocale')

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
        { label: '鱼出现场所', key: 'fishLocale' },
        { label: '鱼影大小', key: 'shadow' },
        { label: '解锁数量要求', key: 'fishUnlock' },
      ],
    }
  },
})
</script>

<style scoped></style>
