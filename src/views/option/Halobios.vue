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
  name: 'HalobiosSetting',
  components: { OptionIndex },
  setup() {
    const route = useRoute()
    const activeName = ref('halobiosLocale')

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
        { label: '海洋生物出现场所', key: 'halobiosLocale' },
        { label: '海洋生物鱼影大小', key: 'halobiosShadow' },
        { label: '解锁数量要求', key: 'halobiosUnlock' },
      ],
    }
  },
})
</script>

<style scoped></style>
