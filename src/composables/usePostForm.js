import { ElMessage } from 'element-plus'

export default function usePostFrom(formRef, formData, isUserPage) {
  // 表单提交
  const postForm = (postApi, success, fail) => {
    formRef.value.validate(valid => {
      if (!valid) return ElMessage.error('请修改有误的表单项')
      // 因为 DatePicker 选择组件不接受数字格式，所以新建一个对象，以免直接修改原对象报警告
      const postData = Object.assign({}, formData)
      if (postData.startDate) {
        // const timeString = parseTime(formData.startDate)
        // formData.startDate = timestamp(timeString)
        postData.startDate = postData.startDate / 1000
      }

      let params = [] // 用来区分编辑(put)和新增(post) 的参数
      // 如果 _id 有值就是编辑
      postData._id && isUserPage
        ? (params = [postData._id, postData])
        : (params = [postData])

      postApi(...params)
        .then(res => {
          ElMessage.success(res.message)
          success()
        })
        .catch(err => {
          ElMessage.error(`提交失败，${err.message}！`)
          fail()
        })
    })
  }

  // 包含批量上传组件的表单提交
  const postUploadForm = (postApi, uploadRef) => {
    formRef.value.validate(valid => {
      uploadRef.value.getUploadedList().then(uploads => {
        formData.photoSrc = uploads.map(obj => ({
          ...obj,
        }))
        if (!valid) return ElMessage.error('请修改有误的表单项')
        postApi(formData)
          .then(res => {
            ElMessage.success(res.message)
            formRef.value.dialogVisible = false
            formData.photoSrc = []
            if (!formData._id) formRef.value.queryInfo.page = 1
          })
          .catch(err => ElMessage.error(err.message))
      })
    })
  }

  return {
    postForm,
    postUploadForm,
  }
}
