<template>
  <el-dialog
    title="添加设计"
    v-model="dialogAddVisible"
    width="60%"
    :close-on-click-modal="false"
    @close="dialogAddClose"
  >
    <el-form
      ref="newDesignRef"
      :inline="false"
      :model="newDesign"
      :rules="newDesignRules"
      label-width="80px"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="名称" prop="name">
            <el-input v-model="newDesign.name" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="类型" prop="type">
            <el-select
              v-model="newDesign.type"
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
              ref="upload"
              drag
              :list="newDesign.photoSrc"
              dialog-width="50%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="" prop="content">
            <el-input
              v-model="newDesign.content"
              type="textarea"
              placeholder="灵感来源，设计思路等等，畅所欲言"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('closeDialog')">取 消</el-button>
      <!-- <el-button @click="dialogAddVisible = false">取 消</el-button> -->
      <el-button type="primary" @click="postDesign">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { addDesign } from '@api/design'
import { nextTick } from 'vue'

export default {
  name: 'DesignAdd',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    design: {
      type: Object,
      default: function () {
        return {
          name: '',
          type: '',
          photoSrc: [],
          content: '',
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
      newDesign: {
        name: '',
        type: '',
        photoSrc: [],
        content: '',
      },
      dialogAddVisible: false,
      tabOptions: this.tabList,
      newDesignRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
      },
    }
  },
  computed: {
    ...mapGetters(['userId']),
  },
  watch: {
    design: {
      handler(val) {
        if (val.name) {
          this.newDesign = val
        }
        if (val.type) {
          this.newDesign.type = val.type
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
  emits: ['freshData', 'closeDialog'],
  methods: {
    dialogAddClose() {
      this.$refs['newDesignRef'].resetFields()
      delete this.newDesign._id
      delete this.newDesign.__v
      this.$emit('closeDialog')
    },
    postDesign() {
      this.$refs.newDesignRef.validate(valid => {
        this.$refs.upload.getUploadedList().then(uploads => {
          this.newDesign.photoSrc = uploads.map(obj => ({ ...obj }))
          if (!valid) return this.$message.error('请修改有误的表单项')
          if (this.newDesign.photoSrc.length === 0)
            return this.$message.error('请上传图片！')
          this.newDesign.user = this.userId
          addDesign(this.newDesign)
            .then(res => {
              this.$message.success(res.message)
              this.resetForm()
              this.$emit('closeDialog')
              this.$emit('freshData')
            })
            .catch(err => this.$message.error(err.message))
        })
      })
    },
    resetForm() {
      nextTick(() => {
        this.$refs.newDesignRef.resetFields()
      })
    },
  },
}
</script>
