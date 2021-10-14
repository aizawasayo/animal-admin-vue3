<template>
  <el-dropdown :show-timeout="100" trigger="click">
    <el-button plain>
      {{ !comment_disabled ? '评论: 开放' : '评论: 关闭' }}
      <i class="el-icon-caret-bottom el-icon--right" />
    </el-button>
    <template #dropdown>
      <el-dropdown-menu class="no-padding">
        <el-dropdown-item>
          <el-radio-group v-model="comment_disabled" style="padding: 10px">
            <el-radio :label="true"> 关闭评论 </el-radio>
            <el-radio :label="false"> 开放评论 </el-radio>
          </el-radio-group>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
import { computed, defineComponent } from 'vue'

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const comment_disabled = computed({
      get: () => props.modelValue,
      set: val => emit('update:modelValue', val),
    })
    return {
      comment_disabled,
    }
  },
})
</script>
