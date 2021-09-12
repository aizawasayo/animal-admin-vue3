<template>
  <div class="app-container">
    <el-row class="search-box" type="flex" justify="space-between">
      <el-col :span="16">
        <el-row :gutter="24">
          <el-col :span="16">
            <el-input
              v-model="queryInfo.query"
              placeholder="请输入工具关键字"
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
              @click="() => commonApi.openAddForm('tool', this)"
              >添加工具</el-button
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
            v-if="scope.row.photoSrc"
            :src="apiUrl + scope.row.photoSrc"
            width="25"
            height="25"
          />
          <span v-else>未上传</span>
        </template>
      </el-table-column>
      <el-table-column
        label="名称"
        align="center"
        prop="name"
        sortable="custom"
      >
        <template #default="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column
        label="价格"
        align="center"
        prop="price"
        sortable="custom"
      >
        <template #default="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column label="英文名" align="center">
        <template #default="scope">
          {{ scope.row.engName }}
        </template>
      </el-table-column>
      <el-table-column label="日文名" align="center">
        <template #default="scope">
          {{ $filters.textFilter(scope.row.jpnName, 5) }}
        </template>
      </el-table-column>
      <el-table-column
        label="耐久度"
        align="center"
        prop="durability"
        sortable="custom"
      >
        <template #default="scope">
          {{ scope.row.durability ? scope.row.durability : '永久' }}
        </template>
      </el-table-column>
      <el-table-column
        label="可否DIY"
        align="center"
        column-key="isDIY"
        :filters="isDIYList"
      >
        <template #default="scope">
          {{ scope.row.isDIY ? '可DIY制作' : '不可DIY制作' }}
        </template>
      </el-table-column>
      <el-table-column
        label="获取途径"
        align="center"
        column-key="channels"
        :filters="channelList"
      >
        <template #default="scope">
          <span v-if="scope.row.activity">{{ scope.row.activity }}/</span>
          <span>{{ scope.row.channels.join('/') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="途径详情" align="center">
        <template #default="scope">
          {{ scope.row.channelDetail ? '有' : '无' }}
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
      title="添加工具"
      v-model="dialogVisible"
      width="60%"
      :close-on-click-modal="false"
      :before-close="closeDialog"
    >
      <el-form
        ref="newToolRef"
        :inline="false"
        :model="newTool"
        :rules="newToolRules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="可否DIY" prop="isDIY" required>
              <el-radio-group v-model="newTool.isDIY" @change="changeDIY">
                <el-radio :label="true">可以DIY制作</el-radio>
                <el-radio :label="false">不可以DIY制作</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="工具名称" prop="name" required>
              <el-input v-model="newTool.name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="英文名" prop="engName">
              <el-input v-model="newTool.engName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="日文名" prop="jpnName">
              <el-input v-model="newTool.jpnName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="价格" prop="price">
              <el-input v-model.number="newTool.price" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="耐久度" prop="durability">
              <el-input v-model.number="newTool.durability" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="来源(多选)" prop="channels">
              <el-select
                v-model="newTool.channels"
                multiple
                collapse-tags
                placeholder="请选择获取途径"
              >
                <el-option
                  v-for="item in channelList"
                  :label="item.text"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属活动" prop="activity">
              <el-select
                v-model="newTool.activity"
                placeholder="请选择所属活动"
              >
                <el-option
                  v-for="item in activityList"
                  :label="item.text"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="照片" prop="photoSrc">
              <upload-single
                v-model="newTool.photoSrc"
                dialog-width="30%"
                drag
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="途径说明" prop="channelDetail">
              <el-input
                v-model="newTool.channelDetail"
                type="textarea"
                placeholder="请输入具体途径说明"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="postTool">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import getOption from '@utils/get-option'
import { getTools, addTool, getTool, deleteTool } from '@api/tool'

export default {
  name: 'Tool',
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
      newTool: {
        name: '',
        price: null,
        engName: '',
        jpnName: '',
        durability: null,
        isDIY: null,
        activity: '',
        channels: [],
        channelDetail: '',
        photoSrc: '',
      },
      isDIYList: [
        { text: '可以DIY制作', value: true },
        { text: '不可以DIY制作', value: false },
      ],
      channelList: [],
      activityList: [],
      newToolRules: {
        name: [{ required: true, message: '请填写工具名', trigger: 'blur' }],
      },
      multipleSelection: [],
    }
  },
  computed: {
    isDIYBL() {
      let bl = false
      if (this.newTool.isDIY !== null && this.newTool.isDIY === true) bl = true
      return bl
    },
    notDIY() {
      let bl = false
      if (this.newTool.isDIY !== null && this.newTool.isDIY === false) bl = true
      return bl
    },
  },
  created() {
    this.fetchData()
    this.getOptions()
  },
  methods: {
    fetchData(param) {
      this.commonApi.getList(param, getTools, this)
    },
    getOptions() {
      getOption('toolChannels', list => {
        this.channelList = list
      })
      getOption('activity', list => {
        this.activityList = list
      })
    },
    postTool() {
      this.commonApi.postForm('tool', addTool, this)
    },
    handleEdit(id) {
      this.commonApi.openEditForm(id, 'tool', getTool, this)
    },
    changeDIY(val) {
      if (val) {
        this.newTool.channels.push('DIY制作')
      } else {
        this.newTool.channels = []
      }
    },
    handleDelete(id) {
      this.commonApi.deleteById(id, deleteTool, this.fetchData)
    },
    handelMultipleDelete() {
      this.commonApi.multipleDelete(
        this.multipleSelection,
        deleteTool,
        this.fetchData
      )
    },
  },
}
</script>

<style scoped></style>
