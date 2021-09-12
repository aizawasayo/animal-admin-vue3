<template>
  <div style="padding: 15px">
    <!-- 可以动态赋予一个变量的值 -->
    <!-- 也可以不用`:`传入一个静态的值 -->
    <design-tabs
      :tab-options="tabOptions"
      :active-tab="activeName"
      :tab-change="handleTabChange"
    ></design-tabs>
  </div>
</template>

<script>
import DesignTabs from './DesignTabs3.vue'
export default {
  components: { DesignTabs },
  data() {
    return {
      tabOptions: [
        { label: '衣服', key: 'clothingDesign', icon: 'cherry' },
        { label: '帽子', key: 'hatDesign', icon: 'cold-drink' },
        { label: '图案', key: 'patternDesign', icon: 'lollipop' },
      ],
      activeName: 'clothingDesign',
    }
  },
  methods: {
    handleTabChange(tab) {
      this.activeName = tab
    },
  },
  // created() {
  //   const tab = this.$route.query.tab
  //   if (tab) {
  //     this.activeName = tab
  //   }
  // },
}
</script>
