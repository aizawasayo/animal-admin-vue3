<template>
  <div
    :class="{ fullscreen: fullscreen }"
    class="tinymce-container"
    :style="{ width: containerWidth }"
  >
    <tinymce-editor
      :id="tinymceId"
      initialValue="<p>Initial editor content</p>"
      v-model="contentValue"
      :init="initOptions"
      apiKey="dkb23i61in9c5mdp72yr4mb1fo8t8117t21dnt8k8hpogn2n"
      tinymceScriptSrc="tinymce/tinymce.min.js"
    />
    <div class="editor-custom-btn-container">
      <editorImage
        color="#4FC08D"
        class="editor-upload-btn"
        @successCBK="imageSuccessCBK"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import EditorImage from './components/EditorImage.vue'
import TinymceEditor from '@tinymce/tinymce-vue'
import { getTinymce } from '@tinymce/tinymce-vue/lib/es2015/main/ts/TinyMCE.js'
import { filePickerCallback, imageUploadHandler } from './uploadHandler'
import { menubar, plugins, toolbar } from './config'

export default defineComponent({
  name: 'Tinymce',
  components: { TinymceEditor, EditorImage },
  props: {
    tinymceId: {
      type: String,
      default: function () {
        return (
          'vue-tinymce-' +
          +new Date() +
          ((Math.random() * 1000).toFixed(0) + '')
        )
      },
    },
    modelValue: {
      type: String,
      default: '',
    },
    toolbar: {
      type: [String, Array],
      // type: String || Number,
      required: false,
      default() {
        return []
      },
    },
    menubar: {
      type: String,
      default: 'file edit view insert format tools table tc help',
    },
    height: {
      type: [String, Number],
      required: false,
      default: 360,
    },
    width: {
      type: [String, Number],
      required: false,
      default: 'auto',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const hasChange = ref(false)
    const hasInit = ref(false)
    const fullscreen = ref(false)

    const initOptions = ref({
      base_url: 'tinymce',
      language: 'zh_CN',
      // content_css: 'tinymce/skins/content/animal/content.min.css',
      // skin_url: 'tinymce/skins/ui/animal',
      skin: 'animal',
      content_css: 'animal',
      body_class: 'panel-body',
      height: props.height, // 注：引入autoresize插件时，此属性失效
      min_height: props.height,
      // menubar: menubar,
      plugins: plugins,
      toolbar: props.toolbar,
      toolbar_sticky: true,
      toolbar_mode: 'wrap', // 'sliding'
      content_style:
        'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
      branding: false, // tiny技术支持信息是否显示
      // resize: false,
      link_title: false,
      default_link_target: '_blank',
      convert_urls: false,
      end_container_on_empty_block: true,
      imagetools_cors_hosts: ['106.54.168.208:1016'],
      init_instance_callback: (editor: any) => {
        // tinymce 实例初始化时的回调
        if (props.moduleValue) {
          editor.setContent(props.modelValue)
        }
        hasInit.value = true
        editor.on('NodeChange Change KeyUp SetContent', () => {
          hasChange.value = true
          emit('update:modelValue', editor.getContent())
        })
      },
      image_title: true,
      // #参考 https://www.tiny.cloud/docs/configure/file-image-upload/#file_picker_callback
      file_picker_callback: filePickerCallback,
      // images_upload_url: apiUrl + '/admin/single/upload',
      // #参考 https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
      images_upload_handler: imageUploadHandler,
      setup: (editor: any) => {
        // tinymce 实例渲染之前的回调
        editor.on('FullscreenStateChanged', (e: any) => {
          fullscreen.value = e.state
        })
      },
    })

    const containerWidth = computed(() => {
      const width = props.width
      if (/^[\d]+(\.[\d]+)?$/.test(width)) {
        return `${width}px`
      }
      return width
    })

    const imageSuccessCBK = arr => {
      const tinymce = getTinymce().get(props.tinymceId)
      arr.forEach((v: any) => {
        tinymce.insertContent(`<img class="articlePic" src="${v.url}" >`)
      })
    }

    return {
      initOptions,
      hasChange,
      hasInit,
      fullscreen,
      containerWidth,
      imageSuccessCBK,
      contentValue: computed({
        get: () => props.modelValue,
        set: val => {
          emit('update:modelValue', val)
        },
      }),
    }
  },
})
</script>

<style scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}
.tinymce-container :deep(.mce-fullscreen) {
  z-index: 10000;
}
.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}
.editor-custom-btn-container {
  position: absolute;
  right: 6px;
  top: 6px;
  z-index: 2005;
}
.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}
.editor-upload-btn {
  display: inline-block;
}
</style>
