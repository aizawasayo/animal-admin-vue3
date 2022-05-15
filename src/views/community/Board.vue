<template>
  <div class="app-container">
    <el-row class="search-box" type="flex" justify="space-between">
      <el-col :span="16">
        <el-row :gutter="24">
          <el-col :span="16">
            <search-bar v-model:query="listQuery.query" />
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="openAddDialog">添加</el-button>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8" class="flex-right">
        <el-button type="danger" plain @click="multiDelete">批量删除</el-button>
      </el-col>
    </el-row>
    <el-table
      ref="loadingRef"
      :data="list"
      border
      fit
      highlight-current-row
      empty-text="没有相关数据"
      @selection-change="selection => selectionChange(selection)"
      @filter-change="filters => filterChange(filters)"
      @sort-change="sortInfo => sortChange(sortInfo)"
    >
      <el-table-column type="selection" width="36"> </el-table-column>
      <el-table-column align="center" label="序号" width="55">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="照片" width="60" prop="photoSrc">
        <template #default="scope">
          <img
            v-if="scope.row.photoSrc.length > 0 && scope.row.photoSrc[0].src"
            :src="realUrl + scope.row.photoSrc[0].src"
            width="25"
            height="25"
          />
          <span v-else>未上传</span>
        </template>
      </el-table-column>
      <el-table-column
        label="话题"
        align="center"
        column-key="topic"
        :filters="topicList"
      >
        <template #default="scope">
          {{ scope.row.topic }}
        </template>
      </el-table-column>
      <el-table-column label="详情" align="center">
        <template #default="scope">
          {{ $filters.textFilter(scope.row.content) }}
        </template>
      </el-table-column>
      <el-table-column
        class-name="status-col"
        label="操作"
        width="150"
        align="center"
      >
        <template #default="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            @click="handleEdit(scope.row._id)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            @click="handleDelete(scope.row._id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="listQuery.page"
      v-model:limit="listQuery.pageSize"
    />
    <el-dialog
      title="发布信息"
      v-model="dialogVisible"
      width="60%"
      :close-on-click-modal="false"
      :before-close="closeDialog"
    >
      <el-form
        ref="boardFormRef"
        :inline="false"
        :model="boardFormData"
        :rules="boardFormRules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="话题" prop="topic">
              <el-select
                v-model="boardFormData.topic"
                collapse-tags
                placeholder="请选择话题"
              >
                <el-option
                  v-for="item in topicList"
                  :label="item.text"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="照片" prop="photoSrc">
              <template #default>
                <upload-multi
                  ref="uploadRef"
                  drag
                  :list="boardFormData.photoSrc"
                  dialog-width="50%"
                />
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="content">
              <el-input
                v-model="boardFormData.content"
                type="textarea"
                placeholder="把你想分享的说出来吧"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handlePost(true, beforePostProcess)"
            >确 定</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { getBoardList, addBoard, getBoard, deleteBoard } from '@api/board'
import { getOptionList } from '@api/option'
import getOption from '@utils/get-option'
import useMix from '@composables/useMix'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'Board',
  inject: ['realUrl'],
  setup() {
    const store = useStore()

    const boardFormRef = ref(null)
    const boardFormData = reactive({
      user: '',
      topic: '',
      content: '',
      photoSrc: [],
      icon: '',
      color: '',
      comments: [],
      likes: [],
    })

    const apiOption = {
      getListApi: getBoardList,
      getInfoApi: getBoard,
      deleteApi: deleteBoard,
      addApi: addBoard,
    }
    const uploadRef = ref(null)
    const loadingRef = ref(null)
    const mixProps = useMix(
      apiOption,
      boardFormRef,
      boardFormData,
      uploadRef,
      loadingRef
    )

    const topicList = ref([])
    const topicOption = ref([])
    const getOptions = () => {
      getOption('topic', list => {
        topicList.value = list
      })
      getOptionList({ type: 'topic' })
        .then(response => {
          topicOption.value = response.data
        })
        .catch(err => ElMessage.error(err.message))
    }

    const userId = computed(() => store.getters.userId)
    const roles = computed(() => store.getters.roles)

    onMounted(() => {
      getOptions()
      if (roles.value.length === 1 && roles.value.includes('normal')) {
        mixProps.listQuery.user = userId
      }
    })

    const addTopicInfo = () => {
      const topicName = boardFormData.topic
      const topicInfo = topicOption.value.filter(
        item => item.name === topicName
      )
      boardFormData.icon = topicInfo[0].icon
      boardFormData.color = topicInfo[0].color
    }

    const beforePostProcess = formData => {
      addTopicInfo()
      formData.user = userId.value
    }

    return {
      ...mixProps,
      boardFormRef,
      boardFormData,
      boardFormRules: {
        topic: [{ required: true, message: '请选择话题', trigger: 'change' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
      },
      uploadRef,
      loadingRef,
      topicList,
      beforePostProcess,
    }
  },
})
</script>

<style scoped>
.el-date-editor {
  width: 100% !important;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
.el-input-number--medium {
  width: 50%;
}
</style>
