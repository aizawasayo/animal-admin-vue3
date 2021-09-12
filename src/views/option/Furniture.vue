<template>
  <option-index :tab-options="tabOptions" :active-tab="activeName"></option-index>
</template>

<script>
import OptionIndex from '../components/OptionIndex'

export default {
  name: 'FurnitureSetting',
  components: { OptionIndex },
  data() {
    return {
      tabOptions: [
        { label: '家具类型', key: 'furnitureType' },
        { label: '家具来源', key: 'furnitureChannels' },
        { label: '家具系列', key: 'series' },
        { label: '家具尺寸', key: 'size' }
      ],
      activeName: 'furnitureType'
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
