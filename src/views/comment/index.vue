<template>
  <comment-index :tab-options="tabOptions" :active-tab="activeName"></comment-index>
</template>

<script>
import CommentIndex from './components/CommentIndex'

export default {
  name: 'Comment',
  components: { CommentIndex },
  data() {
    return {
      tabOptions: [
        { label: '攻略评论', key: 'guide' },
        { label: '森友墙评论', key: 'board' },
        { label: '大头菜评论', key: 'turnip' },
        { label: '交易区评论', key: 'trade' }
      ],
      activeName: 'guide'
    }
  },
  created() {
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {}
}
</script>

<style scoped></style>
