<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div>{{ user }}</div>
    <!-- <p>ref state1: {{ state1.count }}</p> -->
    <button @click="add1">增加 state1.value</button>
    <!-- <p>toRef state2: {{ state2 }}</p> -->
    <button @click="add2">增加 state2.value</button>
    <child :state1="state1" :state2="state2"></child>
  </div>
</template>

<script lang="jsx">
import {
  inject,
  onMounted,
  toRef,
  ref,
  onUpdated,
  toRefs,
  defineComponent,
  getCurrentInstance,
  reactive,
} from 'vue'
const child = defineComponent({
  props: ['state1', 'state2'],
  setup(props) {
    console.log(props.state1.count, props.state2)
    const { state1 } = toRefs(props)
    console.log(state1.value.count)
    // const state = ref('hh')
    // const inputData = ref('11')
    onUpdated(() => {
      console.log(props.state1.count, props.state2)
    })
    return () => (
      <div>
        <p>我是child</p>
        <p>{props.state1.count}</p>
        <p>{props.state2}</p>
        <p>{state1.value.count}</p>
      </div>
    )
  },
})
export default {
  // inject: ['user'],
  components: { child },
  setup() {
    const user = inject('user')
    const internalInstance = getCurrentInstance()
    const num1 = ref(2)
    const obj1 = reactive({ num1 })
    const obj2 = ref(internalInstance.proxy)

    console.log(num1)
    console.log(obj1, obj1.num1)
    console.log(obj2, obj2.value)
    console.log(internalInstance.proxy, internalInstance.proxy.user)

    const obj = { count: 3 }
    // const state1 = ref(obj.count)
    const state1 = ref(obj)
    const state2 = toRef(obj, 'count')
    function add1() {
      state1.value.count++
      // console.log('原始值：', obj)
      // console.log('响应式数据对象：', state1.value.count)
      // console.log('state2', state2.value)
    }
    function add2() {
      state2.value++
      // console.log('原始值：', obj)
      // console.log('响应式数据对象：', state2.value)
      // console.log('state1', state1.value.count)
    }

    onMounted(() => {
      // console.log('setup', user)
    })
    return {
      user,
      state1,
      state2,
      add1,
      add2,
      // method1,
    }
  },
  mounted() {
    // console.log(this, this.user)
  },
  methods: {
    add3(aaa) {
      console.log(aaa)
    },
  },
}
</script>
