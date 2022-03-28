<!--富文本右上角自定义按钮上传组件-->
<template>
  <div class="upload-container">
    <el-button
      :style="{ background: color, borderColor: color }"
      icon="el-icon-upload"
      size="mini"
      type="primary"
      @click="dialogVisible = true"
    >
      上传图片
    </el-button>
    <el-dialog v-model="dialogVisible">
      <el-upload
        name="photoSrc"
        :action="`${apiUrl}/admin/upload`"
        multiple
        :file-list="fileList"
        show-file-list
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        class="editor-slide-upload"
        list-type="picture-card"
      >
        <el-button size="small" type="primary"> 点击上传 </el-button>
      </el-upload>
      <el-button @click="dialogVisible = false"> 取消 </el-button>
      <el-button type="primary" @click="handleSubmit"> 确认 </el-button>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, inject } from 'vue'
import { ElMessage } from 'element-plus'
import { compressAccurately } from 'image-conversion'

export default defineComponent({
  name: 'EditorImage',
  props: {
    color: {
      type: String,
      default: '#4FC08D',
    },
  },
  inject: ['apiUrl'],
  setup(props, { emit }) {
    const dialogVisible = ref(false)
    const listObj = reactive({})
    const fileList = ref([])
    const realUrl = inject('realUrl')

    const checkAllSuccess = () => {
      return Object.keys(listObj).every(item => listObj[item].hasSuccess)
    }
    const handleSubmit = () => {
      const arr = Object.keys(listObj).map(v => listObj[v])
      if (!checkAllSuccess()) {
        ElMessage.warning(
          '请等待所有图片上传成功。如果有网络问题，请刷新页面并重新上传!'
        )
        return
      }
      emit('successCBK', arr)
      Object.keys(listObj).map(key => {
        delete listObj[key]
      })
      fileList.value = []
      dialogVisible.value = false
    }
    const handleSuccess = (response, file) => {
      let fileSrc = response.data[0].path
      const uid = file.uid
      const objKeyArr = Object.keys(listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (listObj[objKeyArr[i]].uid === uid) {
          listObj[objKeyArr[i]].url = realUrl + fileSrc
          listObj[objKeyArr[i]].hasSuccess = true
          return
        }
      }
    }
    const handleRemove = file => {
      const uid = file.uid
      const objKeyArr = Object.keys(listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (listObj[objKeyArr[i]].uid === uid) {
          delete listObj[objKeyArr[i]]
          return
        }
      }
    }
    const beforeUpload = file => {
      const _URL = window.URL || window.webkitURL
      const fileName = file.uid
      listObj[fileName] = {}
      return new Promise((resolve, reject) => {
        listObj[fileName] = {
          hasSuccess: false,
          uid: file.uid,
          width: props.width,
          height: props.height,
        }
        if (file.size / 1024 > 200) {
          // 大于 400 kb 就压缩
          compressAccurately(file, 100).then(resBlob => {
            resolve(resBlob)
          })
        } else {
          // 直接返回图片
          resolve(file)
        }
      })

      // return new Promise((resolve, reject) => {
      //   const img = new Image()
      //   img.src = _URL.createObjectURL(file)
      //   img.onload = function () {
      //     listObj[fileName] = {
      //       hasSuccess: false,
      //       uid: file.uid,
      //       width: props.width,
      //       height: props.height,
      //     }
      //   }
      //   resolve(true)
      // })
    }
    return {
      dialogVisible,
      listObj,
      fileList,
      checkAllSuccess,
      handleSubmit,
      handleSuccess,
      handleRemove,
      beforeUpload,
    }
  },
})
</script>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  :deep(.el-upload--picture-card) {
    width: 100%;
  }
}
</style>
