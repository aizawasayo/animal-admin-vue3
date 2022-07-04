import { ElMessage } from 'element-plus'

export default function usePostForm(formRef, formData, isUserPage, uploadRef) {
  // 表单提交
  const postForm = (postApi, success, fail, dataProcess) => {
    formRef.value.validate(valid => {
      if (!valid) return ElMessage.error('请修改有误的表单项')
      // 因为 DatePicker 选择组件不接受数字格式，所以新建一个对象，以免直接修改原对象报警告
      const postData = Object.assign({}, formData)
      if (postData.startDate) {
        // const timeString = parseTime(formData.startDate)
        // formData.startDate = timestamp(timeString)
        postData.startDate = postData.startDate / 1000
      }
      if (dataProcess) dataProcess(postData) // 发送请求之前对表单数据的额外处理

      let params = [] // 用来区分编辑(put)和新增(post) 的参数
      // 如果 _id 有值就是编辑
      postData._id && isUserPage
        ? (params = [postData._id, postData])
        : (params = [postData])

      postApi(...params)
        .then(res => {
          ElMessage.success(res.message)
          success && success(res)
        })
        .catch(err => {
          ElMessage.error(`提交失败，${err.message}！`)
          fail && fail(err)
        })
    })
  }

  // 包含批量上传组件的表单提交
  const postUploadForm = (postApi, success, fail, dataProcess) => {
    uploadRef.value.getUploadedList().then(uploads => {
      formData.photoSrc = uploads.map(obj => ({
        ...obj,
      }))
      formRef.value.validate(valid => {
        if (!valid) return ElMessage.error('请修改有误的表单项')
        const postData = Object.assign({}, formData)
        if (dataProcess) dataProcess(postData)

        postApi(postData)
          .then(res => {
            ElMessage.success(res.message)
            if (success) success()
          })
          .catch(err => {
            ElMessage.error(err.message)
            if (fail) fail()
          })
      })
    })
  }

  return {
    postForm,
    postUploadForm,
  }
}
