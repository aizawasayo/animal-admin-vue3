<script setup>
import { onMounted, reactive, ref } from 'vue'
import MyCom from '@components/MyCom.vue'
import JsxDemo from '@components/JsxDemo.vue'

// console.log(a, b)
defineProps({
  msg1: String,
})
const myComRef = ref(null)
const msg = ref('Hello')

onMounted(() => {
  console.log(myComRef, myComRef.value.a)
})
const count = ref(0)
const updateFun = param => {
  console.log('update', param)
}
const deleteFun = () => {
  msg.value = ''
}
</script>

<template>
  <jsx-demo></jsx-demo>
  <my-com
    :msg="msg"
    @update-msg="updateFun"
    @delete-msg="deleteFun"
    ref="myComRef"
  >
    <template v-slot:default="slotProps">
      <p style="color: green">我是不带 name 的插槽内容</p>
      <p>这是从子组件 my-com 传来的：{{ slotProps.data }}</p>
    </template>

    <template v-slot:footer>
      <p style="color: purple">我是具名 footer 插槽内容</p>
    </template>
  </my-com>
  <h1>{{ msg1 }}{{ a }}</h1>

  <p>
    Recommended IDE setup:
    <a href="https://code.visualstudio.com/" target="_blank">VSCode</a>
    +
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
  </p>

  <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank">
      Vite Documentation
    </a>
    |
    <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Documentation</a>
  </p>

  <button type="button" @click="count++">count is: {{ count }}</button>
  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
</template>

<style scoped>
a {
  color: #42b983;
}
</style>
