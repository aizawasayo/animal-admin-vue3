<template>
  <option-index :tab-options="tabOptions" :active-tab="activeName"></option-index>
</template>

<script>
import OptionIndex from '../components/OptionIndex'

export default {
  name: 'InsectSetting',
  components: { OptionIndex },
  data() {
    return {
      tabOptions: [
        { label: '昆虫出现场所', key: 'insectLocale' },
        { label: '解锁数量要求', key: 'insectUnlock' }
      ],
      activeName: 'insectLocale'
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
