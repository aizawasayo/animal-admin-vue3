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
        multiple
        :file-list="fileList"
        show-file-list
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        class="editor-slide-upload"
        :action="uploadUrl"
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
import { defineComponent, ref, computed, reactive, inject } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'EditorImage',
  props: {
    color: {
      type: String,
      default: '#4FC08D',
    },
  },
  setup(props, { emit }) {
    const store = useStore()
    const dialogVisible = ref(false)
    const listObj = reactive({})
    const fileList = ref([])
    const apiUrl = inject('apiUrl')

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
          // listObj[objKeyArr[i]].url = 'http://106.54.168.208:1016' + fileSrc
          listObj[objKeyArr[i]].url =
            import.meta.env.VITE_APP_REAL_API + fileSrc
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
        const img = new Image()
        img.src = _URL.createObjectURL(file)
        img.onload = function () {
          listObj[fileName] = {
            hasSuccess: false,
            uid: file.uid,
            width: props.width,
            height: props.height,
          }
        }
        resolve(true)
      })
    }
    return {
      dialogVisible,
      listObj,
      fileList,
      uploadUrl: computed(() => store.getters.uploadUrl),
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
