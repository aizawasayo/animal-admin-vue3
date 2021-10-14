<!--攻略文章主图上传组件-->
<template>
  <div class="upload-container">
    <el-upload
      name="avatar"
      :multiple="false"
      :show-file-list="false"
      :on-success="handleImageSuccess"
      class="image-uploader"
      drag
      :action="uploadUrl"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
    <div class="image-preview image-app-preview">
      <div v-show="imageUrl.length > 1" class="image-preview-wrapper">
        <img :src="imageUrl" />
        <div class="image-preview-action">
          <i class="el-icon-delete" @click="removeImage" />
        </div>
      </div>
    </div>
    <div class="image-preview">
      <div v-show="imageUrl.length > 1" class="image-preview-wrapper">
        <img :src="imageUrl" />
        <div class="image-preview-action">
          <i class="el-icon-delete" @click="removeImage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, inject } from 'vue'
export default defineComponent({
  name: 'ImageUpload',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const apiUrl = inject('apiUrl')

    const removeImage = () => {
      emit('update:modelValue', '')
    }

    const handleImageSuccess = response => {
      const fileSrc = response.data.path
      emit('update:modelValue', fileSrc.replace('/public', ''))
    }

    return {
      uploadUrl: computed(() => apiUrl + '/admin/single/upload'),
      imageUrl: computed(() =>
        props.modelValue ? apiUrl + props.modelValue : ''
      ),
      handleImageSuccess,
      removeImage,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@styles/mixin.scss';
.upload-container .el-upload .el-upload-dragger {
  height: 200px;
}
.upload-container {
  width: 100%;
  position: relative;
  @include clearfix;
  .image-uploader {
    width: 35%;
    float: left;
  }
  .image-uploader :deep(.el-upload) {
    width: 100%;
  }
  .image-preview {
    width: 200px;
    height: 200px;
    position: relative;
    border: 1px dashed #d9d9d9;
    float: left;
    margin-left: 50px;
    .image-preview-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .image-preview-action {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: default;
      text-align: center;
      color: #fff;
      opacity: 0;
      font-size: 20px;
      background-color: rgba(0, 0, 0, 0.5);
      transition: opacity 0.3s;
      cursor: pointer;
      text-align: center;
      line-height: 200px;
      .el-icon-delete {
        font-size: 36px;
      }
    }
    &:hover {
      .image-preview-action {
        opacity: 1;
      }
    }
  }
  .image-app-preview {
    width: 320px;
    height: 200px;
    position: relative;
    border: 1px dashed #d9d9d9;
    float: left;
    margin-left: 50px;
    .app-fake-conver {
      height: 44px;
      position: absolute;
      width: 100%; // background: rgba(0, 0, 0, .1);
      text-align: center;
      line-height: 64px;
      color: #fff;
    }
  }
}
</style>
