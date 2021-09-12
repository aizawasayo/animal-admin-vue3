<template>
  <option-index :tab-options="tabOptions" :active-tab="activeName"></option-index>
</template>

<script>
import OptionIndex from '../components/OptionIndex'

export default {
  name: 'ToolSetting',
  components: { OptionIndex },
  data() {
    return {
      tabOptions: [
        // { label: '', key: 'diyType' },
        { label: '工具来源', key: 'toolChannels' }
        // { label: '解锁数量要求', key: 'diyUnlock' }
      ],
      // tabIndex:0,
      activeName: 'toolChannels'
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
