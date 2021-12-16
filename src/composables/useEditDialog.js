import { ElMessage } from 'element-plus'
import { nextTick, ref } from 'vue'

// 新增/编辑弹窗的 打开/关闭
export default function useEdit(formRef, formData) {
  const dialogVisible = ref(false)

  const clearForm = () => {
    formRef.value.resetFields()
    // 处理一些额外需要清除的字段
    const resetKeys = ['email', 'password']
    const deleteKeys = ['_id', '__v', 'psw']
    resetKeys.forEach(key => {
      if (formData[key]) formData[key] = ''
    })
    deleteKeys.forEach(key => {
      if (formData[key]) delete formData[key]
    })
    formData['__v'] = undefined
  }
  // 打开弹窗并初始化数据
  const openAddDialog = callback => {
    dialogVisible.value = true

    nextTick(() => {
      // $refs['formDataRef'].resetFields()
      clearForm()

      if (
        callback &&
        Object.prototype.toString.call(callback) === '[object Function]'
      )
        callback()
    })
  }
  // 请求信息并打开编辑弹窗
  const openEditDialog = (id, getInfoApi, callback) => {
    if (formRef.value) {
      formRef.value.resetFields()
    }
    getInfoApi(id)
      .then(res => {
        dialogVisible.value = true
        nextTick(() => {
          Object.keys(res.data).forEach(key => {
            formData[key] = res.data[key]
          })
          if (formData.startDate) {
            // 时间格式处理
            formData.startDate = formData.startDate + '000'
            // formData.startDate = standardTime(formData.startDate)
          }
          if (callback) callback() // 一些额外的表单数据处理
        })
      })
      .catch(err => ElMessage.error(err.message))
  }

  // 关闭弹窗并清空数据
  const closeDialog = done => {
    clearForm()
    done()
  }

  return {
    dialogVisible,
    openAddDialog,
    openEditDialog,
    closeDialog,
    clearForm,
  }
}
