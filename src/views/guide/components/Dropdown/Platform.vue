<template>
  <el-dropdown :hide-on-click="false" :show-timeout="100" trigger="click">
    <el-button plain>
      来源({{ platforms.length }})
      <i class="el-icon-caret-bottom el-icon--right" />
    </el-button>
    <template #dropdown>
      <el-dropdown-menu class="no-border">
        <el-checkbox-group v-model="platforms" style="padding: 5px 15px">
          <el-checkbox
            v-for="item in platformsOptions"
            :label="item.key"
            :key="item.key"
          >
            {{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
import { computed, defineComponent } from 'vue'

export default defineComponent({
  props: {
    modelValue: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const platforms = computed({
      get: () => props.modelValue,
      set: val => emit('update:modelValue', val),
    })
    return {
      platforms,
      platformsOptions: [
        { key: '动森研究所', name: '动森研究所' },
        { key: '动森生活家', name: '动森生活家' },
        { key: '集合吧动物森友会', name: '集合吧动物森友会' },
        { key: '森友圈', name: '森友圈' },
        { key: '动森助手', name: '动森助手' },
      ],
    }
  },
})
</script>
