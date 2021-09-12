<template>
  <el-dialog
    title="添加选项"
    v-model="dialogAddVisible"
    width="60%"
    :close-on-click-modal="false"
    @close="dialogAddClose"
  >
    <el-form
      ref="newOptionRef"
      :inline="false"
      :model="newOption"
      :rules="newOptionRules"
      label-width="80px"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="序号" prop="orderNum">
            <el-input v-model.number="newOption.orderNum" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="名称" prop="name">
            <el-input v-model="newOption.name" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="类型" prop="type">
            <el-select
              v-model="newOption.type"
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
              v-model="newOption.position"
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
            <el-input v-model="newOption.duration" />
          </el-form-item>
        </el-col>
        <el-col v-show="isTopic" :span="8">
          <el-form-item label="图标" prop="icon">
            <el-input v-model="newOption.icon" />
          </el-form-item>
        </el-col>
        <el-col v-show="isTopic" :span="8">
          <el-form-item label="颜色" prop="color">
            <el-input v-model="newOption.color" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('closeDialog')">取 消</el-button>
      <!-- <el-button @click="dialogAddVisible = false">取 消</el-button> -->
      <el-button type="primary" @click="postOption">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addOption } from '@api/option'
import { nextTick } from 'vue'

export default {
  name: 'OptionAdd',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    option: {
      type: Object,
      default: function () {
        return {
          name: '',
          type: '',
          orderNum: null,
          position: '',
          duration: null,
          icon: '',
          color: '',
        }
      },
    },
    tabList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      newOption: {
        name: '',
        type: '',
        orderNum: null,
        position: '',
        duration: null,
        icon: '',
        color: '',
      },
      dialogAddVisible: false,
      tabOptions: this.tabList,
      positionList: [
        { label: '北半球', key: '北半球' },
        { label: '南半球', key: '南半球' },
      ],
      newOptionRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        orderNum: [{ required: true, message: '请输入序号', trigger: 'blur' }],
      },
    }
  },
  computed: {
    isActivity() {
      return this.newOption.type === 'activity'
    },
    isTopic() {
      return this.newOption.type === 'topic'
    },
  },
  watch: {
    option: {
      handler(val) {
        if (val.name) {
          this.newOption = val
        }
        if (val.type) {
          this.newOption.type = val.type
        }
      },
    },
    visible: {
      handler(val) {
        if (val) {
          this.dialogAddVisible = true
        } else {
          this.dialogAddVisible = false
        }
      },
    },
  },
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  emits: ['freshData', 'closeDialog'],
  methods: {
    dialogAddClose() {
      this.$refs['newOptionRef'].resetFields()
      delete this.newOption._id
      delete this.newOption.__v
      this.$emit('closeDialog')
    },
    postOption() {
      this.$refs.newOptionRef.validate(valid => {
        if (!valid) return this.$message.error('请修改有误的表单项')
        addOption(this.newOption)
          .then(res => {
            this.$message.success(res.message)
            this.resetForm()
            this.$emit('closeDialog')
            this.$emit('freshData')
          })
          .catch(err => this.$message.error(err.message))
      })
    },
    resetForm() {
      nextTick(() => {
        this.$refs.newOptionRef.resetFields()
      })
    },
  },
}
</script>
