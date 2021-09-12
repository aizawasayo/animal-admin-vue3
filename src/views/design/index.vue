<template>
  <design-index
    :tab-options="tabOptions"
    :active-tab="activeName"
  ></design-index>
</template>

<script>
import DesignIndex from './components/DesignIndex.vue'

export default {
  name: 'Design',
  components: { DesignIndex },
  data() {
    return {
      tabOptions: [
        { label: '衣服', key: 'clothingDesign', icon: 'theme' },
        { label: '帽子', key: 'hatDesign', icon: 'hat' },
        { label: '图案', key: 'patternDesign', icon: 'pattern' },
      ],
      activeName: 'clothingDesign',
    }
  },
  created() {
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {},
}
</script>

<style scoped></style>
