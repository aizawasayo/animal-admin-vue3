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
  name: 'InsectSetting',
  components: { OptionIndex },
  setup() {
    const route = useRoute()
    const activeName = ref('insectLocale')

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
        { label: '昆虫出现场所', key: 'insectLocale' },
        { label: '解锁数量要求', key: 'insectUnlock' },
      ],
    }
  },
})
</script>

<style scoped></style>
