<div id="app">
  
</div>
<script>
import { defineComponent, ref } from '@vue/composition-api'
import { watchEffect } from '@vue/runtime-core'

function useFetch(getUrl) {
  const data = ref(null)
  const error = ref(null)
  const isPending = ref(true)

  watchEffect(() => {
    fetch(getUrl())
      .then(res => res.json)
      .then(_data => {
        data.value = _data
        isPending.value = false
      })
      .catch(err => {
        error.value = err
        isPending.value = false
      })
  })

  return {
    data,
    error,
    isPending,
  }
}

function usePost(getId) {
  return useFetch(() => `https://jsonplaceholder.typicode.com/todos/${getId()}`)
}

const Post = {
  props: ['id'],
  template: `
    <div v-if="isPending">loading...</div>
    <div v-else-if="data">{{ data }}</div>
    <div v-else-if="error">sth went wrong: {{ error.message }}</div>
  `,
  setup(props) {
    const { data, error, isPending } = usePost(() => props.id)

    return {
      data,
      error,
      isPending,
    }
  },
}

const App = {
  components: {
    Post,
  },
  data() {
    return {
      id: 1,
    }
  },
  template: `
    <button @click="id++">change ID</button>
    <post :id="id" />
  `,
}

createApp(App).mount('#app')
</script>
