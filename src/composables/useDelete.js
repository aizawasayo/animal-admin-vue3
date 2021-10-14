import { ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'

export default function useDelete(deleteApi, refreshList, type) {
  const multiSelection = ref([])

  // 监听多选并给多选数组赋值
  const selectionChange = selection => {
    multiSelection.value = selection
  }

  const deleteById = (id, callback) => {
    let params = [] // 用来处理评论 api 的特殊情况
    type && type.value ? (params = [id, type.value]) : (params = [id])

    ElMessageBox.confirm('是否要永久删除数据', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warn',
    })
      .then(() => {
        deleteApi(...params).then(res => {
          ElMessage.success(res.message)
          callback()
        })
      })
      .catch(err => {
        ElMessage.info('已取消删除')
      })
  }

  const handleDelete = (id, roles) => {
    // 用户管理页面判断是否是删除管理员
    if (roles && roles.includes('admin'))
      return ElMessage.warning('不能删除管理员！')
    // 删除方法，可批量
    deleteById(id, refreshList)
  }

  // 点击批量删除按钮
  const multiDelete = () => {
    if (multiSelection.value.length === 0) {
      return ElMessage.warning('请先选中至少一条数据')
    }
    let id = ''
    let isAdmin = false // 用户页面防止删除管理员

    multiSelection.value.forEach(val => {
      if (val.roles && val.roles.includes('admin')) {
        isAdmin = true
      }
      id += val._id + ','
    })

    if (!isAdmin) {
      id = id.substring(0, id.length - 1)
      deleteById(id, refreshList)
    } else {
      ElMessage.warning('没有权限删除管理员！')
    }
  }

  return {
    multiSelection,
    selectionChange,
    deleteById,
    handleDelete,
    multiDelete,
  }
}
