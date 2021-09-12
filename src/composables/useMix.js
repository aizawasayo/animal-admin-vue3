import useDelete from '@composables/useDelete'
import useEditDialog from '@composables/useEditDialog'
import useFilter from '@composables/useFilter'
import useList from '@composables/useList'
import usePostForm from '@composables/usePostForm'
import useSort from '@composables/useSort'
import { computed, nextTick, reactive, unref } from 'vue'

export default function useMix(api, formRef, formData) {
  const { sort, sortJson, sortChange } = useSort() // 列表排序

  // 分页请求参数
  const listQuery = reactive({
    query: '',
    page: 1,
    pageSize: 10,
    sort,
    sortJson,
  })

  // 列表请求返回数据及列表刷新方法
  const { list, total, listLoading, refreshList } = useList(
    listQuery,
    api.getListApi
  )
  const { filterChange } = useFilter(listQuery) // 列表筛选

  const {
    dialogVisible,
    openAddDialog,
    openEditDialog,
    closeDialog,
    clearForm,
  } = useEditDialog(formRef, formData)

  const handleEdit = id => {
    openEditDialog(id, api.getInfoApi)
  }

  // 编辑/新增相关
  // 判断是否是用户管理页面
  const isUserPage = computed(
    () => formData.roles && Array.isArray(formData.roles)
  )

  const postApi = computed(() =>
    unref(isUserPage) && formData._id ? api.editApi : api.addApi
  )

  const { postForm, postUploadForm } = usePostForm(
    formRef,
    formData,
    unref(isUserPage)
  )

  // 提交表单，批量上传参数传 true，否则不传
  const handlePost = isMulti => {
    const postFun = isMulti === true ? postUploadForm : postForm
    postFun(
      unref(postApi),
      () => {
        clearForm()
        dialogVisible.value = false
        nextTick(() => {
          refreshList()
        })
      },
      () => {
        if (formData.startDate) formData.startDate = ''
      }
    )
  }

  // 删除/批量删除
  const { selectionChange, handleDelete, multiDelete } = useDelete(
    api.deleteApi,
    refreshList
  )

  return {
    list,
    total,
    listLoading,
    listQuery,
    filterChange,
    sortChange,
    handlePost,
    handleEdit,
    dialogVisible,
    openAddDialog,
    closeDialog,
    clearForm,
    selectionChange,
    handleDelete,
    multiDelete,
  }
}
