<template>
  <option-index :tab-options="tabOptions" :active-tab="activeName"></option-index>
</template>

<script>
import OptionIndex from '../components/OptionIndex'

export default {
  name: 'DiySetting',
  components: { OptionIndex },
  data() {
    return {
      tabOptions: [
        { label: 'DIY类型', key: 'diyType' },
        { label: 'DIY来源', key: 'diyChannels' },
        { label: '解锁数量要求', key: 'diyUnlock' }
      ],
      activeName: 'diyType'
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
