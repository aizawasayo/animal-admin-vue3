<template>
  <option-index :tab-options="tabOptions" :active-tab="activeName"></option-index>
</template>

<script>
import OptionIndex from '../components/OptionIndex'

export default {
  name: 'FishSetting',
  components: { OptionIndex },
  data() {
    return {
      tabOptions: [
        { label: '鱼出现场所', key: 'fishLocale' },
        { label: '鱼影大小', key: 'shadow' },
        { label: '解锁数量要求', key: 'fishUnlock' }
      ],
      activeName: 'fishLocale'
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
