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
  name: 'ToolSetting',
  components: { OptionIndex },
  setup() {
    const route = useRoute()
    const activeName = ref('toolChannels')

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
        // { label: '', key: 'diyType' },
        { label: '工具来源', key: 'toolChannels' },
        // { label: '解锁数量要求', key: 'diyUnlock' }
      ],
    }
  },
})
</script>

<style scoped></style>
