import { ElMessage } from 'element-plus'
import { compress, compressAccurately } from 'image-conversion'

export default function useUpload() {
  const beforeUpload = file => {
    const typeList = ['image/jpeg', 'image/png', 'image/gif']
    const isTypeValid = typeList.includes(file.type)
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isTypeValid) {
      ElMessage.error('图片格式只能是 JPG/PNG/GIF!')
    }
    if (!isLt2M) {
      ElMessage.error('图片大小不能超过 2MB!')
    }

    return new Promise((resolve, reject) => {
      if (!isTypeValid) {
        ElMessage.error('图片格式只能是 JPG/PNG/GIF!')
        return reject()
      }
      if (!isLt2M) {
        ElMessage.error('图片大小不能超过 2MB!')
        return reject()
      }
      if (file.size / 1024 > 200) {
        // 大于 400 kb 就压缩
        compressAccurately(file, 100).then(resBlob => {
          //The res in the promise is a compressed Blob type (which can be treated as a File type) file;
          // let resAvatarFile = new window.File(
          //   [resBlob],
          //   file.name,
          //   { type: file.type },
          // )
          //
          // resAvatarFile.uid = file.uid
          // resolve(resAvatarFile)
          // 直接传 Blob 即可
          resolve(resBlob)
        })
      } else {
        // 直接返回图片
        resolve(file)
      }
    })
  }

  const uploadSuccess = res => {
    ElMessage({ type: 'success', message: res.message || '上传成功' })
    // const src = res.data.path
    return res.data.path
  }

  const uploadMultiSuccess = files => {
    // ElMessage({ type: 'success', message: res.message || '上传成功' })
    const photoList = []
    files.forEach((pic, i) => {
      const uid = Date.parse(new Date()) / 1000 + i
      photoList.push({ name: pic.name, src: pic.path, uid, status: 'success' })
    })
    return photoList
  }
  return {
    beforeUpload,
    uploadSuccess,
    uploadMultiSuccess,
  }
}
