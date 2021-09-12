<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane
      v-for="(item, i) in tabOptions1"
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
          :ref="
            el => {
              if (el) designList[i] = el
            }
          "
          :type="item.key"
          :key="item.key + i"
        />
      </template>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import {
  ref,
  computed,
  watch,
  defineComponent,
  toRef,
  reactive,
  onBeforeUpdate,
} from 'vue'
import { useRouter, useRoute } from 'vue-router'

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
  props: ['tabOptions', 'activeTab'],
  components: { DesignList },
  emits: ['tabChange'],
  setup(props, { emit }) {
    const router = useRouter()
    const route = useRoute()

    // const { tabOptions } = toRefs(props) // 切记 props 只读，不允许在子组件直接修改
    const activeName = ref(props.activeTab) // 将其赋为组件状态的初始值，直接 props.xx
    // 如果和`tabOptions`一样通过 `toRefs` 或 `toRef` 包装，对 `activeName` 的修改会影响 `props` 的值（报错）
    // 如果要同步修改父组件的值，需要通过 emit 事件(后面会说)
    const tabOptions1 = ref(props.tabOptions)

    // const { tabOptions, activeTab } = toRefs(props)
    // const activeName = ref(activeTab)
    const designList = ref([])

    const tabIndex = reactive(
      computed(() =>
        tabOptions1.value.findIndex(item => {
          return item.key === activeName.value
        })
      )
    )
    // 确保在每次更新之前重置ref
    onBeforeUpdate(() => {
      designList.value = []
    })
    watch(activeName, val => {
      router.push(`${route.path}?tab=${val}`)
      console.log(`${val}`)
      emit('tabChange', val)
      designList.value[tabIndex].fetchData()
    })

    const handleClick = (tab, event) => {
      console.log(tab, event)
    }
    return {
      tabOptions1,
      activeName,
      handleClick,
      designList,
    }
  },
}
</script>
