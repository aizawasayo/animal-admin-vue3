<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane
      v-for="(item, i) in tabOptions"
      :label="item.label"
      :name="item.key"
      :key="item.key + i"
    >
      <template #label>
        <span>
          <i :class="`el-icon-${item.icon}`" />
          {{ item.label }}
        </span>
      </template>
      <template #default>
        假设这是一个渲染<strong style="color: #409eff">{{ item.label }}</strong
        >列表的子组件
        <design-list
          :ref="'designList' + i"
          :type="item.key"
          :key="item.key + i"
          @paneEdit="handleEdit(arguments)"
        />
      </template>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { defineComponent, toRef } from 'vue'
const DesignList = defineComponent({
  props: ['type'],
  setup(props) {
    const key = toRef(props, 'type')
    return () => <div>{key.value}</div>
  },
  methods: {
    fetchData() {
      console.log(`重新请求${this.type}数据`)
    },
  },
})
export default {
  // 表示接收的 props
  // 如果定义成对象而不是数组，可以设置 prop 类型、默认值、是否必须
  components: { DesignList },
  props: ['tabOptions', 'activeTab'],
  emits: ['tabChange'],
  data() {
    return {
      // 如果 prop 用来传递一个初始值
      // 子组件希望将其作为一个本地的数据来使用：
      activeName: this.activeTab,
    }
  },
  computed: {
    tabIndex() {
      return this.tabOptions.findIndex(item => item.key === this.activeName)
    },
  },
  watch: {
    activeName(val) {
      console.log(`${val}`)
      // const listRef = `designList${this.tabIndex}`
      this.$refs[`designList${this.tabIndex}`].fetchData()
      this.$emit('tab-change', val)
      // this.$refs.designList[this.tabIndex].fetchData() //触发列表子组件的数据请求
    },
  },
  // methods: {
  //   handleClick(tab, event) {
  //     //console.log(tab.index, tab.props) // 这样获得的`index`是字符串，props 可以获得传入`tab-pane`的属性
  //     // console.log(tab, event)
  //   },
  // },
}
</script>
