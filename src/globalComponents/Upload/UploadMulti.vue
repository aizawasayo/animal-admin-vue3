<!--批量上传组件-->
<template>
  <div class="upload-container">
    <el-upload
      :action="`${apiUrl}/admin/upload`"
      name="photoSrc"
      with-credentials
      :show-file-list="true"
      :file-list="photoList"
      :on-change="photoListChange"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :auto-upload="false"
      :drag="drag"
      multiple
      :class="uploadClass"
    >
      <template v-if="!drag" #trigger>
        <el-button size="small" type="primary">选取文件</el-button>
      </template>
      <template v-if="drag">
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          将图片拖到此处，<br />或<em>点击上传</em>
        </div>
      </template>
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
    <div class="preview-dialog">
      <el-dialog
        v-model="dialogVisible"
        :append-to-body="true"
        :width="dialogWidth"
      >
        <el-image style="width: 100%" :src="previewUrl" fit="fill"></el-image>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, defineComponent, toRefs, watch } from 'vue'
import { uploadMulti } from '@api/upload'
import { ElMessage, ElMessageBox } from 'element-plus'
import useUpload from '@composables/useUpload'

export default defineComponent({
  name: 'UploadMulti',
  inject: ['apiUrl'],
  props: {
    list: {
      type: Array,
      default: [],
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
    const photoList = ref([])
    const dialogVisible = ref(false)
    const previewUrl = computed(() =>
      value.value ? import.meta.env.VITE_APP_BASE_API + value.value : ''
    )
    const uploadClass = computed(() => (drag.value ? 'image-uploader' : ''))

    watch(
      list,
      () => {
        photoList.value = list.value.map(obj => ({ ...obj }))
      },
      { deep: true }
    )

    const { uploadMultiSuccess } = useUpload()

    // 当文件列表有改变时触发，添加文件、上传成功和上传失败时都会被调用。
    // 我们配置了手动上传，因此只有添加图片时触发
    const photoListChange = (file: Object) => {
      const typeList = ['image/jpeg', 'image/png', 'image/gif']
      const isTypeValid = typeList.includes(file.raw.type)
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isTypeValid) return ElMessage.error('图片格式只能是 JPG/PNG/GIF!')
      if (!isLt2M) return ElMessage.error('图片大小不能超过 2MB!')
      photoList.value.push(file)
    }

    // 传入 true 获取【已上传】文件，否则是获取【未上传】文件
    // 用是否拥有 raw 属性 来判断，有 raw property 就是待上传的
    const filterPhotoList = (isUploaded?: Boolean) => {
      return isUploaded
        ? photoList.value.filter(
            item => !Object.prototype.hasOwnProperty.call(item, 'raw')
          )
        : photoList.value.filter(item =>
            Object.prototype.hasOwnProperty.call(item, 'raw')
          )
    }

    // 表单提交时用来获取文件列表，如有未上传的就在这时上传
    const getUploadedList = async () => {
      // 获取待上传的文件列表，如果没有就直接返回 photoList 的值
      const toUploadList = filterPhotoList()
      if (toUploadList.length === 0) return photoList.value

      // 有则开始手动上传
      const formData = new FormData()
      toUploadList.forEach(file => {
        formData.append('photoSrc', file.raw, file.name)
      })
      const { data } = await uploadMulti(formData)
      return filterPhotoList(true).concat(uploadMultiSuccess(data))
    }

    // 点击文件列表中的文件，预览图片
    const handlePreview = file => {
      if (file.src) {
        value.value = file.src
        dialogVisible.value = true
      }
    }

    // 从文件列表删除文件时的回调
    const handleRemove = (file, fileList) => {
      photoList.value = fileList.map(obj => ({ ...obj }))
    }

    return {
      value,
      dialogWidth,
      photoList,
      dialogVisible,
      previewUrl,
      uploadClass,
      photoListChange,
      filterPhotoList,
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
  @include clearfix;
  .image-uploader {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-flow: wrap;
    position: relative;
    .el-icon-upload {
      margin: 20px 0 16px;
      font-size: 60px;
    }
    .el-upload__text {
      line-height: 20px;
      font-size: 13px;
    }
    .el-upload__tip {
      flex: 1;
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
  .image-uploader :deep(.el-upload-list__item-name) {
    max-width: 200px;
  }
}
</style>
