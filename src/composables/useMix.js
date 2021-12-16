import { computed, nextTick, reactive, unref } from 'vue'
import useDelete from '@composables/useDelete'
import useEditDialog from '@composables/useEditDialog'
import useFilter from '@composables/useFilter'
import useList from '@composables/useList'
import usePostForm from '@composables/usePostForm'
import useSort from '@composables/useSort'
import useLoading from '@composables/useLoading'

export default function useMix(api, formRef, formData, uploadRef, loadingRef) {
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

  useLoading(loadingRef, listLoading)

  const {
    dialogVisible,
    openAddDialog,
    openEditDialog,
    closeDialog,
    clearForm,
  } = useEditDialog(formRef, formData)

  const handleEdit = (id, callback) => {
    openEditDialog(id, api.getInfoApi, callback)
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
    unref(isUserPage),
    uploadRef
  )

  // 提交表单
  // @isMulti：批量上传参数传 true，否则不传/false
  // @dataProcess：上传之前的表单数据处理
  const handlePost = (isMulti, dataProcess) => {
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
      },
      dataProcess
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
