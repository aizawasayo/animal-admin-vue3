<!--批量上传组件-->
<template>
  <div class="upload-container">
    <el-upload
      ref="upload"
      :action="`${apiUrl}/admin/upload`"
      name="photoSrc"
      with-credentials
      :show-file-list="true"
      :file-list="fileList"
      :on-change="fileListChange"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :auto-upload="false"
      :drag="drag"
      multiple
      :class="uploadClass"
    >
      <template #trigger>
        <el-button v-if="!drag" size="small" type="primary">选取文件</el-button>
      </template>
      <div v-if="drag">
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          将图片拖到此处，<br />或<em>点击上传</em>
        </div>
      </div>
      <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="handleUpload">上传到服务器</el-button> -->
      <template #tip>
        <div class="el-upload__tip">
          <span style="color: #f56c6c"
            >只能上传jpg/png/gif文件，且不超过2M。</span
          ><br />
          图片列表中已经上传成功的图片(<span style="color: #67c23a"
            >有绿色✓</span
          >)，点击图片名称可以预览大图
        </div>
      </template>
    </el-upload>
    <el-dialog
      v-model="dialogVisible"
      :append-to-body="true"
      :modal-append-to-body="false"
      :width="dialogWidth"
      class="preview-dialog"
    >
      <img width="100%" :src="previewUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, defineComponent } from 'vue'
import { uploadMulti } from '@/api/upload'
import { ElMessage, ElMessageBox } from 'element-plus'
import useUpload from '@composables/useUpload'

export default defineComponent({
  name: 'UploadMulti',
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    drag: {
      type: Boolean,
      default: false,
    },
    dialogWidth: {
      type: String,
      default: '35%',
    },
  },
  setup(props) {
    const { list, drag, dialogWidth } = toRefs(props)
    const value = ref('')
    const fileList = ref([])
    const dialogVisible = ref(false)
    const previewUrl = computed(() =>
      value ? import.meta.env.VITE_APP_BASE_API + value : ''
    )
    const uploadClass = computed(() => (drag ? 'image-uploader' : ''))

    watch(
      list,
      () => {
        fileList.value = list.map(obj => ({ ...obj }))
      },
      { deep: true }
    )

    const { uploadMultiSuccess } = useUpload()

    const fileListChange = file => {
      const typeList = ['image/jpeg', 'image/png', 'image/gif']
      const isTypeValid = typeList.includes(file.raw.type)
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isTypeValid) return ElMessage.error('图片格式只能是 JPG/PNG/GIF!')
      if (!isLt2M) return ElMessage.error('图片大小不能超过 2MB!')
      fileList.value.push(file)
    }
    const filterFileList = uploaded => {
      return uploaded
        ? fileList.value.filter(
            item => !Object.prototype.hasOwnProperty.call(item, 'raw')
          )
        : fileList.value.filter(item =>
            Object.prototype.hasOwnProperty.call(item, 'raw')
          )
    }

    const getUploadedList = async () => {
      const toUploadList = filterFileList()
      if (toUploadList.length === 0) return fileList.value
      const formData = new FormData()
      toUploadList.forEach(file =>
        formData.append('photoSrc', file.raw, file.name)
      )
      const { data } = await uploadMulti(formData)
      return filterFileList(true).concat(uploadMultiSuccess(data))
    }
    const handlePreview = file => {
      if (file.src) {
        value.value = file.src
        dialogVisible.value = true
      }
    }
    const handleRemove = (file, fileList) => {
      fileList.value = fileList.value.map(obj => ({ ...obj }))
    }
    return {
      value,
      fileList,
      dialogVisible,
      previewUrl,
      uploadClass,
      fileListChange,
      filterFileList,
      getUploadedList,
      handlePreview,
      handleRemove,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@styles/mixin.scss';
.upload-container {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: row;
  flex-flow: wrap;
  @include clearfix;
  .image-uploader {
    width: 100%;
    display: flex;
    flex-direction: row;
    .el-icon-upload {
      margin: 20px 0 16px;
      font-size: 60px;
    }
    .el-upload__text {
      line-height: 20px;
      font-size: 13px;
    }
    .el-upload__tip {
      width: 300px;
      margin: 0 20px;
      line-height: 20px;
    }
  }
  .image-uploader :deep(.el-upload) {
    width: 150px;
  }
  .image-uploader :deep(.el-upload-dragger) {
    width: 150px;
    height: 150px;
  }
  .image-uploader :deep(.el-upload-list__item:first-child) {
    margin-top: 0px;
  }
}
</style>
