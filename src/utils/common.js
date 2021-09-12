import { ElMessage, ElMessageBox } from 'element-plus'

/**
 * 删除数据
 * @id {string} 多个id用 , 分隔
 * @deleteFun {Function} 删除数据调用的Api方法
 * @callback {Function} 删除成功的回调
 * @returns {null}
 */
export const deleteById = (id, deleteFun, callback) => {
  ElMessageBox.confirm('是否要永久删除该信息', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warn',
  })
    .then(() => {
      deleteFun(id).then(res => {
        ElMessage.success(res.message)
        callback()
      })
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

export const multipleDelete = (multiData, deleteFun, callback) => {
  if (multiData.length === 0) {
    return ElMessage.warning('请先选中至少一条数据')
  }
  let id = ''
  multiData.forEach(val => {
    id += val._id + ','
  })
  id = id.substring(0, id.length - 1)
  deleteById(id, deleteFun, callback)
}

export const uploadSuccess = res => {
  ElMessage({ type: 'success', message: res.message || '上传成功' })
  const src = res.data.path
  return src.replace('/public', '')
}

export const uploadMultiSuccess = files => {
  // ElMessage({ type: 'success', message: res.message || '上传成功' })
  const photoList = []
  files.forEach((pic, i) => {
    const src = pic.path.replace('/public', '')
    const uid = Date.parse(new Date()) / 1000 + i
    photoList.push({ name: pic.name, src, uid, status: 'success' })
  })
  return photoList
}

export const filterChange = (filters, target) => {
  Object.assign(target.queryInfo, filters)
  target.fetchData('refresh')
}

export const sortChange = (sortInfo, target) => {
  let order = sortInfo.order
  order === 'ascending' ? (order = 1) : (order = -1)
  target.queryInfo.sortJson = {}
  target.queryInfo.sortJson[sortInfo.prop] = order
  target.queryInfo.sort = JSON.stringify(target.queryInfo.sortJson)
  target.fetchData('refresh')
}

// 监听多选并给多选数组赋值
export const handleSelectionChange = (selection, target) => {
  target.multipleSelection = selection
}

// 字符串首字母转大写，后面字母小写
/**
 * js字符串切割
 * @str {string}
 */
function firstToUpper(str) {
  return str.trim().toLowerCase().replace(str[0], str[0].toUpperCase())
}

// 对象数组去重
/**
 * @key {string} 判断唯一值的键名
 * @returns {array} 去重后的数组
 */
export const unique = (arr, key) => {
  const res = new Map()
  return arr.filter(arr => !res.has(arr[key]) && res.set(arr[key], 1))
}

// 打开新增表格数据的表单弹窗
export const openAddForm = (name, target) => {
  target.dialogVisible = true
  // 用 this.nextTick 或者用个定时器来确保组件的 dom 渲染并更新
  target.$nextTick(function () {
    // 打开新增弹窗后重置表单 避免表单出现上一次新增的校验数据
    target.$refs[`new${firstToUpper(name)}Ref`].resetFields()
  })
}

// 关闭 新增/修改 表格数据的表单弹窗
export const dialogAddClose = (name, target) => {
  target.$refs[`new${firstToUpper(name)}Ref`].resetFields()
  delete target[`new${firstToUpper(name)}`]._id
  delete target[`new${firstToUpper(name)}`].__v
}

// 请求信息并打开编辑弹窗
export const openEditForm = (id, name, getInfoFun, target) => {
  if (target.$refs[`new${firstToUpper(name)}Ref`]) {
    target.$refs[`new${firstToUpper(name)}Ref`].resetFields()
  }
  getInfoFun(id)
    .then(res => {
      target.dialogVisible = true
      target.$nextTick(function () {
        target[`new${firstToUpper(name)}`] = res.data
      })
    })
    .catch(err => ElMessage.error(err.message))
}

// 请求分页列表数据
export const getList = (refresh, getListFun, target) => {
  target.listLoading = true
  if (refresh === 'refresh') {
    target.queryInfo.page = 1
  }
  getListFun(target.queryInfo).then(response => {
    target.list = response.data.list
    target.total = response.data.total || 0
    target.listLoading = false
  })
}

// 提交表单
export const postForm = (name, postFun, target) => {
  target.$refs[`new${firstToUpper(name)}Ref`].validate(valid => {
    if (!valid) return ElMessage.error('请修改有误的表单项')
    postFun(target[`new${firstToUpper(name)}`])
      .then(res => {
        ElMessage.success(res.message)
        target.dialogVisible = false
        if (!target[`new${firstToUpper(name)}`]._id) target.queryInfo.page = 1
        target.fetchData()
      })
      .catch(err => ElMessage.error(err.message))
  })
}

// 含图片上传的表单提交
export const postUploadForm = (name, postFun, target) => {
  target.$refs[`new${firstToUpper(name)}Ref`].validate(valid => {
    target.$refs.upload.getUploadedList().then(uploads => {
      target[`new${firstToUpper(name)}`].photoSrc = uploads.map(obj => ({
        ...obj,
      }))
      if (!valid) return ElMessage.error('请修改有误的表单项')
      postFun(target[`new${firstToUpper(name)}`])
        .then(res => {
          ElMessage.success(res.message)
          target.dialogVisible = false
          target[`new${firstToUpper(name)}`].photoSrc = []
          if (!target[`new${firstToUpper(name)}`]._id) target.queryInfo.page = 1
          target.fetchData()
        })
        .catch(err => ElMessage.error(err.message))
    })
  })
}
