<script>
import { defineComponent, ref } from '@vue/composition-api'
import { onMounted, onUnmounted, toRefs } from '@vue/runtime-core'

function useMouse() {
  const x = ref(0)
  const y = ref(0)
  const updated = e => {
    x.value = e.pageX
    y.value = e.pageY
  }
  onMounted(() => {
    window.addEventListener('mousemove', update)
  })
  onUnmounted(() => {
    window.removeEventListener('mouseover', update)
  })
  return {
    x,
    y,
  }
}

const App = {
  setup() {
    const { x, y } = useMouse()
    return { x, y }
  },
  template: `{{ x }} {{ y }}`,
}
const Mouse = {
  data() {
    return {
      x: 0,
      y: 0,
    }
  },
  methods: {
    update(e) {
      // 这个包装组件有自己的命名空间，不用担心命名冲突
      this.x = e.pageX
      this.y = e.pageY
    },
  },
  mounted() {
    window.addEventListener('mousemove', this.update)
  },
  unmounted() {
    window.removeEventListener('mouseover', this.update)
  },
  template: `<slot :x="x" :y="y">`, // 和下面 render 等价的写法
  render() {
    return (
      this.$slots.default &&
      this.$slots.default({
        x: this.x,
        y: this.y,
      })
    )
  },
}

const App2 = {
  components: {
    Mouse,
  },
  template: `
  <Mouse v-slot="{ x, y }">
    <Foo v-slot="{ foo }">
      {{ x }} {{ y }}
    </Foo>
  </Mouse>
  `,
}

function withMouse(Inner) {
  // 包装器组件
  return {
    data() {
      return {
        x: 0,
        y: 0,
      }
    },
    methods: {
      update(e) {
        // 这个包装组件有自己的命名空间，不用担心命名冲突
        this.x = e.pageX
        this.y = e.pageY
      },
    },
    mounted() {
      window.addEventListener('mousemove', this.update)
    },
    unmounted() {
      window.removeEventListener('mouseover', this.update)
    },
    render() {
      return h(Inner, {
        x: this.x,
        y: this.y,
      })
    },
  }
}

const App = withMouse({
  props: ['x', 'y'],
  template: `{{ x }} {{ y }}`,
})

// 多个高阶组件包装
const App1 = withFoo(
  widthAnother(
    withMouse({
      props: ['x', 'y', 'foo', 'bar'], // 还可能得到很多 props，同样搞不清楚这些 props 来自哪个高阶组件
      template: `{{ x }} {{ y }}`,
    })
  )
)

createApp(App).mount('#app')
</script>
