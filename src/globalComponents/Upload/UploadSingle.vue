<!--单图上传组件/按钮-->
<template>
  <div class="upload-container">
    <el-upload
      name="avatar"
      :action="`${apiUrl}/admin/single/upload`"
      :multiple="false"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :on-success="handleUploadSuccess"
      :on-error="handleUploadError"
      :drag="drag"
      with-credentials
      :class="uploadClass"
    >
      <template v-if="!drag">
        <el-button v-if="imageUrl" size="small" type="success"
          >已上传，可点击修改</el-button
        >
        <el-button size="small" type="primary" v-else
          ><i class="el-icon-upload el-icon--left"></i>点击上传</el-button
        >
      </template>
      <template v-if="drag">
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          将单张图片拖到<br />此处，或<em>点击上传</em>
        </div>
      </template>
      <template #tip>
        <div class="el-upload__tip">
          <span style="color: #f56c6c"
            >只能上传一张图片，格式限jpg/png/gif，大小不超过2M</span
          >
        </div>
      </template>
    </el-upload>
    <div class="preview-dialog">
      <el-dialog
        v-model="dialogVisible"
        :append-to-body="true"
        :width="dialogWidth"
      >
        <el-image style="width: 100%" :src="imageUrl" fit="fill"></el-image>
      </el-dialog>
    </div>
    <div
      v-if="!drag && imageUrl.length > 0"
      class="el-upload-list el-upload-list--text"
    >
      <div class="el-upload-list__item is-success">
        <a class="el-upload-list__item-name" @click="handlePreview">
          <i class="el-icon-picture"></i>点此处预览</a
        >
        <label class="el-upload-list__item-status-label">
          <i class="el-icon-upload-success el-icon-circle-check"></i>
        </label>
        <i class="el-icon-close" @click="removeImage"></i>
      </div>
    </div>
    <div
      v-if="drag && imageUrl.length > 0"
      class="el-upload-list el-upload-list--picture-card"
    >
      <div class="el-upload-list__item is-success">
        <img :src="imageUrl" alt="" class="el-upload-list__item-thumbnail" />
        <label class="el-upload-list__item-status-label">
          <i class="el-icon-upload-success el-icon-check"></i>
        </label>
        <i class="el-icon-close"></i>
        <i class="el-icon-close-tip">按 delete 键可删除</i>
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview">
            <i class="el-icon-zoom-in" @click="handlePreview"></i>
          </span>
          <span class="el-upload-list__item-delete">
            <i class="el-icon-delete" @click="removeImage"></i>
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, defineComponent, toRefs, inject } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import useUpload from '@composables/useUpload'

export default defineComponent({
  name: 'UploadSingle',
  props: {
    modelValue: {
      type: String,
      default: '',
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
  inject: ['apiUrl'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { modelValue, drag } = toRefs(props)
    const realUrl = inject('realUrl')
    const dialogVisible = ref(false)

    const { uploadSuccess, beforeUpload } = useUpload()

    const removeImage = () => {
      ElMessageBox.confirm('确定移除已上传的图片？', '提示').then(() => {
        emit('update:modelValue', '')
      })
    }
    const handleUploadSuccess = response => {
      emit('update:modelValue', uploadSuccess(response))
    }
    const handleUploadError = err => {
      ElMessage.error(err.message)
    }
    const handleUploadRemove = () => {
      emit('update:modelValue', '')
    }

    const handlePreview = () => {
      dialogVisible.value = true
    }
    return {
      dialogVisible,
      imageUrl: computed(() =>
        modelValue.value ? realUrl + modelValue.value : ''
      ),
      uploadClass: computed(() => (drag.value ? 'image-uploader' : '')),
      removeImage,
      handleUploadSuccess,
      handleUploadError,
      handleUploadRemove,
      beforeUpload,
      handlePreview,
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
    width: 150px;
    margin-right: 20px;
    .el-icon-upload {
      margin: 20px 0 16px;
      font-size: 60px;
    }
    .el-upload__text {
      line-height: 20px;
      font-size: 13px;
    }
  }
  .el-upload-list--text {
    margin: 6px 0 0 10px;
  }
  .image-uploader :deep(.el-upload-dragger) {
    width: 150px;
    height: 150px;
  }
  .el-upload__tip {
    margin: 0 0 0 15px;
    line-height: 20px;
  }
  .el-upload-list__item:first-child {
    margin: 0;
  }
}
.preview-dialog :deep(.el-dialog__header) {
  padding: 0;
}
.preview-dialog :deep(.el-dialog__body) {
  padding: 20px;
}
</style>
