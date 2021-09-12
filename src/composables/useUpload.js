import { ElMessage } from 'element-plus'

export default function useUpload() {
  const uploadSuccess = res => {
    ElMessage({ type: 'success', message: res.message || '上传成功' })
    const src = res.data.path
    return src.replace('/public', '')
  }

  const uploadMultiSuccess = files => {
    // ElMessage({ type: 'success', message: res.message || '上传成功' })
    const photoList = []
    files.forEach((pic, i) => {
      const src = pic.path.replace('/public', '')
      const uid = Date.parse(new Date()) / 1000 + i
      photoList.push({ name: pic.name, src, uid, status: 'success' })
    })
    return photoList
  }
  return {
    uploadSuccess,
    uploadMultiSuccess,
  }
}
