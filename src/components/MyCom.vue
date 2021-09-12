<template>
  <div>我是子组件 My-Com ： {{ msg }}</div>
  <button @click="emit('update-msg', 'hi')">update</button>
  <!--或者-->
  <button @click="deleteMsg">delete</button>
  <slot :data="111"></slot>
  <slot name="footer"></slot>
</template>

<script setup>
import { useAttrs, useSlots } from '@vue/runtime-core'
import { render } from '@vue/runtime-dom'

defineProps({
  msg: String,
})
const emit = defineEmits(['update-msg', 'delete-msg'])
const deleteMsg = () => {
  emit('delete-msg')
}
const slots = useSlots()
const attrs = useAttrs()

const a = 1
defineExpose({
  a,
})
</script>

<style lang="scss" scoped></style>
