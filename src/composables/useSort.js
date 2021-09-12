import { ref } from 'vue'

export default function useSort() {
  const sortJson = ref({})
  const sort = ref('')
  const sortChange = sortInfo => {
    let order = sortInfo.order
    order === 'ascending' ? (order = 1) : (order = -1)
    sortJson.value = {}
    sortJson.value[sortInfo.prop] = order
    sort.value = JSON.stringify(sortJson.value)
  }
  return {
    sort,
    sortJson,
    sortChange,
  }
}
