<template>
  <div class="app-container">
    <el-row class="search-box" type="flex" justify="space-between">
      <el-col :span="16">
        <el-row :gutter="24">
          <el-col :span="16">
            <el-input
              v-model="queryInfo.query"
              placeholder="请输入关键字"
              class="input-with-select"
              clearable
              @clear="fetchData"
              @keyup.enter.native="fetchData('refresh')"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="fetchData('refresh')"
              ></el-button>
            </el-input>
          </el-col>
          <el-col :span="8">
            <el-button
              type="primary"
              @click="() => commonApi.openAddForm('board', this)"
              >添加</el-button
            >
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8" class="flex-right">
        <el-button type="danger" plain @click="multiDelete">批量删除</el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="加载中"
      border
      fit
      highlight-current-row
      empty-text="没有相关数据"
      @selection-change="selection => selectionChange(selection, this)"
      @filter-change="filters => filterChange(filters, this)"
      @sort-change="sortInfo => commonApi.sortChange(sortInfo, this)"
    >
      <el-table-column
        type="selection"
        width="40"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column align="center" label="序号" width="55">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="照片" width="60" prop="photoSrc">
        <template #default="scope">
          <img
            v-if="scope.row.photoSrc.length > 0 && scope.row.photoSrc[0].src"
            :src="apiUrl + scope.row.photoSrc[0].src"
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
        ref="newBoardRef"
        :inline="false"
        :model="newBoard"
        :rules="newBoardRules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="话题" prop="topic">
              <el-select
                v-model="newBoard.topic"
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
              <upload-multi
                ref="upload"
                drag
                :list="newBoard.photoSrc"
                dialog-width="50%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="content">
              <el-input
                v-model="newBoard.content"
                type="textarea"
                placeholder="把你想分享的说出来吧"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="postBoard">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getBoardList, addBoard, getBoard, deleteBoard } from '@api/board'
import { getOptionList } from '@api/option'
import getOption from '@utils/get-option'

export default {
  name: 'Board',
  data() {
    return {
      list: null,
      listLoading: true,
      queryInfo: {
        query: '',
        page: 1,
        pageSize: 10,
        sortJson: {},
        sort: '',
      },
      total: 0,
      dialogVisible: false,
      emptyText: '没有相关数据',
      topicList: [],
      topicOption: [],
      newBoard: {
        user: '',
        topic: '',
        content: '',
        photoSrc: [],
        icon: '',
        color: '',
      },
      newBoardRules: {
        topic: [{ required: true, message: '请选择话题', trigger: 'change' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
      },
      multipleSelection: [],
    }
  },
  computed: {
    ...mapGetters(['userId', 'roles']),
  },
  created() {
    this.fetchData()
    this.getOptions()
  },
  methods: {
    fetchData(param) {
      if (this.roles.length === 1 && this.roles.includes('normal')) {
        this.queryInfo.user = this.userId
      }
      this.commonApi.getList(param, getBoardList, this)
    },
    getOptions() {
      getOption('topic', list => {
        this.topicList = list
      })
      getOptionList({ type: 'topic' })
        .then(response => {
          this.topicOption = response.data
        })
        .catch(err => this.$message.error(err.message))
    },
    postBoard() {
      this.addTopicInfo()
      this.newBoard.user = this.$store.getters.userId
      this.commonApi.postUploadForm('board', addBoard, this)
    },
    handleEdit(id) {
      this.commonApi.openEditForm(id, 'board', getBoard, this)
    },
    addTopicInfo() {
      const topicName = this.newBoard.topic
      const topicInfo = this.topicOption.filter(item => item.name === topicName)
      this.newBoard.icon = topicInfo[0].icon
      this.newBoard.color = topicInfo[0].color
    },
    handleDelete(id) {
      this.commonApi.deleteById(id, deleteBoard, this.fetchData)
    },
    handelMultipleDelete() {
      this.commonApi.multipleDelete(
        this.multipleSelection,
        deleteBoard,
        this.fetchData
      )
    },
  },
}
</script>

<style scoped>
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
.el-input-number--medium {
  width: 50%;
}
</style>
