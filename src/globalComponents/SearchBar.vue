<template>
  <el-input
    v-model="query"
    :placeholder="`请输入${keyword}关键字`"
    clearable
    prefix-icon=""
  >
    <template #prefix>
      <i class="el-input__icon el-icon-search"></i>
    </template>
  </el-input>
</template>

<script setup>
import { ref, watch } from 'vue'
defineProps({
  keyword: { type: String, default: '' },
  query: { type: String, default: '' },
})
const query = ref('')
const emit = defineEmits(['update:query'])

watch(query, val => {
  emit('update:query', val)
})
</script>
