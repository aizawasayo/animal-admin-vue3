import { ref, toRefs, watch } from 'vue'

// 请求分页列表数据
export default function useList(listQuery, getListApi) {
  const { page, pageSize } = toRefs(listQuery)
  const list = ref(null)
  const total = ref(0)
  const listLoading = ref(false)
  const error = ref(null)

  const getList = async () => {
    listLoading.value = true
    try {
      const response = await getListApi(listQuery)
      list.value = response.data.list
      total.value = response.data.total
    } catch (err) {
      error.value = err
    } finally {
      listLoading.value = false
    }
  }

  // onMounted(getList)

  // watch 能监听 getter，而且必须像这样使用箭头函数。或者直接监听一个 ref
  watch(
    listQuery,
    () => getList(),
    { immediate: true } // 初始化时就执行一次，代替 onMounted 钩子
  )
  // 或者像这样直接监听 ref
  // watch(
  //   [page, pageSize],
  //   (newValues, prevValues) => {
  //     getList()
  //   },
  //   { immediate: true }
  // )

  // 刷新列表
  const refreshList = () => {
    listQuery.page = 1
    getList()
  }

  return {
    list,
    total,
    listLoading,
    error,
    getList,
    refreshList,
  }
}
