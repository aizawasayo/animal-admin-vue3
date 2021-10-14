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
  name: 'IslanderSetting',
  components: { OptionIndex },
  setup() {
    const route = useRoute()
    const activeName = ref('breed')

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
        { label: '动物种族', key: 'breed' },
        { label: '岛民性格', key: 'character' },
        { label: '岛民音高', key: 'voice' },
        { label: '岛民爱好', key: 'hobby' },
      ],
    }
  },
})
</script>

<style scoped></style>
