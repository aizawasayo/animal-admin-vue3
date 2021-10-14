<template>
  <el-dialog
    title="添加选项"
    v-model="dialogVisible"
    width="60%"
    :close-on-click-modal="false"
    :before-close="closeDialog"
  >
    <el-form
      ref="optionFormRef"
      :inline="false"
      :model="optionFormData"
      :rules="optionFormRules"
      label-width="80px"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="序号" prop="orderNum">
            <el-input v-model.number="optionFormData.orderNum" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="名称" prop="name">
            <el-input v-model="optionFormData.name" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="类型" prop="type">
            <el-select
              v-model="optionFormData.type"
              collapse-tags
              placeholder="请选择选项类型"
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
        <el-col v-show="isActivity" :span="8">
          <el-form-item label="位置" prop="position">
            <el-select
              v-model="optionFormData.position"
              multiple
              collapse-tags
              placeholder="请选择所属半球"
            >
              <el-option
                v-for="(item, i) in positionList"
                :label="item.label"
                :value="item.key"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-show="isActivity" :span="8">
          <el-form-item label="存在时期" prop="duration">
            <el-input v-model="optionFormData.duration" />
          </el-form-item>
        </el-col>
        <el-col v-show="isTopic" :span="8">
          <el-form-item label="图标" prop="icon">
            <el-input v-model="optionFormData.icon" />
          </el-form-item>
        </el-col>
        <el-col v-show="isTopic" :span="8">
          <el-form-item label="颜色" prop="color">
            <el-input v-model="optionFormData.color" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handlePost">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { computed, defineComponent, nextTick, reactive, ref, toRefs } from 'vue'
import useEditDialog from '@composables/useEditDialog'
import usePostForm from '@composables/usePostForm'
import { addOption } from '@api/option'

export default defineComponent({
  name: 'OptionForm',
  props: {
    type: { type: String, require: true },
    tabOptions: { type: Array, require: true },
  },
  emits: ['freshList'],
  setup(props, { emit }) {
    const { type, tabOptions } = toRefs(props)
    const optionFormRef = ref(null)
    const optionFormData = reactive({
      name: '',
      type: '',
      orderNum: null,
      position: '',
      duration: null,
      icon: '',
      color: '',
    })

    const {
      dialogVisible,
      openAddDialog,
      openEditDialog,
      closeDialog,
      clearForm,
    } = useEditDialog(optionFormRef, optionFormData)

    const openAddCallback = () => (optionFormData.type = type.value)

    const { postForm } = usePostForm(optionFormRef, optionFormData)

    const handlePost = () => {
      postForm(addOption, () => {
        clearForm()
        dialogVisible.value = false
        nextTick(() => {
          emit('freshList')
        })
      })
    }

    return {
      tabOptions,
      optionFormRef,
      optionFormData,
      dialogVisible,
      openAddDialog,
      openEditDialog,
      closeDialog,
      clearForm,
      openAddCallback,
      handlePost,
      positionList: [
        { label: '北半球', key: '北半球' },
        { label: '南半球', key: '南半球' },
      ],
      optionFormRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        orderNum: [{ required: true, message: '请输入序号', trigger: 'blur' }],
      },
      isActivity: computed(() => optionFormData.type === 'activity'),
      isTopic: computed(() => optionFormData.type === 'topic'),
    }
  },
})
</script>
