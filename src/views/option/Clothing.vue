<template>
  <option-index :tab-options="tabOptions" :active-tab="activeName"></option-index>
</template>

<script>
import OptionIndex from '../components/OptionIndex'

export default {
  name: 'ClothingSetting',
  components: { OptionIndex },
  data() {
    return {
      tabOptions: [
        { label: '服饰类型', key: 'clothingType' },
        { label: '服饰来源', key: 'clothingChannels' },
        { label: '服饰颜色', key: 'clothingColor' },
        { label: '服饰风格', key: 'clothingStyle' },
        { label: '服饰主题', key: 'clothingTheme' }
      ],
      activeName: 'clothingType'
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
