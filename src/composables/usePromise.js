import { ref } from 'vue'

export default function usePromise(apiFn) {
  const result = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const createPromise = async (...args) => {
    loading.value = true
    error.value = null
    result.value = null
    try {
      result.value = await apiFn(...args)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }
  return {
    result,
    loading,
    error,
    createPromise,
  }
}

// 使用
// const getList = usePromise(queryInfo => getUsers(queryInfo))
