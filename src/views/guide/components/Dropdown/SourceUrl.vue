<template>
  <el-dropdown :show-timeout="100" trigger="click">
    <el-button plain>
      原文链接🔗
      <i class="el-icon-caret-bottom el-icon--right" />
    </el-button>
    <template #dropdown>
      <el-dropdown-menu class="no-padding no-border" style="width: 400px">
        <el-form-item
          label-width="0px"
          style="margin-bottom: 0px"
          prop="source_uri"
        >
          <el-input v-model="source_uri" placeholder="Please enter the content">
            <template slot="prepend"> URL </template>
          </el-input>
        </el-form-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
import { computed, defineComponent } from 'vue'

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const source_uri = computed({
      get: () => props.modelValue,
      set: val => emit('update:modelValue', val),
    })
    return {
      source_uri,
    }
  },
})
</script>
