<template>
  <el-dialog
    title="添加设计"
    v-model="dialogVisible"
    width="60%"
    :close-on-click-modal="false"
    :before-close="closeDialog"
  >
    <el-form
      ref="designFormRef"
      :inline="false"
      :model="designFormData"
      :rules="designFormRules"
      label-width="80px"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="名称" prop="name">
            <el-input v-model="designFormData.name" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="类型" prop="type">
            <el-select
              v-model="designFormData.type"
              collapse-tags
              placeholder="请选择设计类型"
            >
              <el-option
                v-for="(item, i) in tabOptions"
                :label="item.label"
                :value="item.key"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="照片" prop="photoSrc">
            <upload-multi
              ref="uploadRef"
              drag
              :list="designFormData.photoSrc"
              dialog-width="50%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="" prop="content">
            <el-input
              v-model="designFormData.content"
              type="textarea"
              placeholder="灵感来源，设计思路等等，畅所欲言"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="$emit('closeDialog')">取 消</el-button>
        <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="handlePost">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { useStore } from 'vuex'
import { computed, defineComponent, nextTick, reactive, ref, toRefs } from 'vue'
import useEditDialog from '@composables/useEditDialog'
import usePostForm from '@composables/usePostForm'
import { addDesign } from '@api/design'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'DesignForm',
  props: {
    type: { type: String, require: true },
    tabOptions: { type: Array, require: true },
  },
  emits: ['freshList'],
  setup(props, { emit }) {
    const store = useStore()
    const { type, tabOptions } = toRefs(props)
    const designFormRef = ref(null)
    const designFormData = reactive({
      name: '',
      type: '',
      photoSrc: [],
      content: '',
    })

    const uploadRef = ref(null)

    const userId = computed(() => store.getters.userId)

    const {
      dialogVisible,
      openAddDialog,
      openEditDialog,
      closeDialog,
      clearForm,
    } = useEditDialog(designFormRef, designFormData)

    const openAddCallback = () => (designFormData.type = type.value)

    const { postUploadForm } = usePostForm(
      designFormRef,
      designFormData,
      false,
      uploadRef
    )

    const handlePost = () => {
      if (designFormData.photoSrc.length === 0)
        return ElMessage.error('请上传图片！')
      postUploadForm(
        addDesign,
        () => {
          clearForm()
          dialogVisible.value = false
          nextTick(() => {
            emit('freshList')
          })
        },
        null,
        formData => {
          formData.user = userId.value
        }
      )
    }

    return {
      tabOptions,
      designFormRef,
      designFormData,
      uploadRef,
      dialogVisible,
      openAddDialog,
      openEditDialog,
      closeDialog,
      clearForm,
      openAddCallback,
      handlePost,
      designFormRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
      },
    }
  },
})
</script>
