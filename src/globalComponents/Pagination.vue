<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination
      :background="background"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
    />
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to'
import { computed, onUpdated } from 'vue'

export default {
  name: 'Pagination',
  props: {
    total: {
      required: true,
      type: Number,
    },
    page: {
      type: Number,
      default: 1,
    },
    limit: {
      type: Number,
      default: 20,
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50]
      },
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper',
    },
    background: {
      type: Boolean,
      default: true,
    },
    autoScroll: {
      type: Boolean,
      default: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const currentPage = computed({
      // 当前页
      get: () => props.page,
      set: val => {
        emit('update:page', val)
      },
    })
    const pageSize = computed({
      // 每页条数
      get: () => props.limit,
      set: val => {
        emit('update:limit', val)
      },
    })

    // 计算属性通过传入一个包含 get 和 set 函数的对象，返回一个 `可写的` ref 对象
    // onUpdated(() => console.log(currentPage.value))

    return {
      currentPage,
      pageSize,
    }
  },
}
</script>

<style scoped>
.pagination-container {
  background: #fff;
  padding: 32px 16px;
}
.pagination-container.hidden {
  display: none;
}
</style>
