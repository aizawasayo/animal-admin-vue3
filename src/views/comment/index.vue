<template>
  <comment-index
    :tab-options="tabOptions"
    :active-tab="activeName"
  ></comment-index>
</template>

<script>
import { defineComponent, ref, onBeforeMount, watch } from 'vue'
import { useRoute } from 'vue-router'
import CommentIndex from './components/CommentIndex.vue'

export default defineComponent({
  name: 'Comment',
  components: { CommentIndex },
  setup() {
    const route = useRoute()
    const activeName = ref('guide')

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
        { label: '攻略评论', key: 'guide' },
        { label: '森友墙评论', key: 'board' },
        { label: '大头菜评论', key: 'turnip' },
        { label: '交易区评论', key: 'trade' },
      ],
    }
  },
})
</script>

<style scoped></style>
