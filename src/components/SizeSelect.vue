<template>
  <div>
    <el-dropdown trigger="click" @command="handleSetSize">
      <div>
        <svg-icon class-name="size-icon" icon-class="size" />
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="item of sizeOptions"
            :key="item.value"
            :disabled="size === item.value"
            :command="item.value"
          >
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script>
import { computed, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

export default {
  name: 'SizeSelect',
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    const sizeOptions = [
      { label: '默认', value: 'default' },
      { label: 'Medium', value: 'medium' },
      { label: 'Small', value: 'small' },
      { label: 'Mini', value: 'mini' },
    ]

    const refreshView = () => {
      // In order to make the cached page re-rendered
      store.dispatch('tagsView/delAllCachedViews', route)
      const { fullPath } = route
      //const { params, query } = route
      // const { path } = params

      //router.replace({ path: '/' + path, query })
      nextTick(() => {
        router.replace({
          path: '/redirect' + fullPath,
          // path: `${fullPath}`,
        })
      })
    }
    const handleSetSize = size => {
      store.dispatch('app/setSize', size)
      refreshView()
      ElMessage.success({
        message: '切换成功',
        type: 'success',
      })
    }
    return {
      sizeOptions,
      size: computed(() => store.getters.size),
      handleSetSize,
    }
  },
}
</script>
