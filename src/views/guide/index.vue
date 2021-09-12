<template>
  <div class="app-container">
    <el-row class="search-box" type="flex" justify="space-between">
      <el-col :span="16">
        <el-row :gutter="24">
          <el-col :span="16">
            <el-input
              v-model="queryInfo.query"
              placeholder="请输入攻略名称关键字"
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
            <router-link :to="'/guide/add/'">
              <el-button type="primary">添加攻略</el-button>
            </router-link>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8" class="flex-right">
        <!-- <el-select v-model="queryInfo.breed" clearable placeholder="筛选种族" style="margin-right: 10px" @change="fetchData('refresh')">
          <el-option v-for="item in breedList" :label="item.text" :value="item.value" />
        </el-select> -->
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
      <el-table-column align="center" label="主图" width="80">
        <template #default="scope">
          <img
            v-if="scope.row.image_uri"
            :src="apiUrl + scope.row.image_uri"
            width="25"
            height="25"
          />
          <span v-else>未上传</span>
        </template>
      </el-table-column>
      <el-table-column
        label="标题"
        align="center"
        prop="title"
        sortable="custom"
      >
        <template #default="scope">
          {{ $filters.textFilter(scope.row.title, 15) }}
        </template>
      </el-table-column>
      <el-table-column
        width="180px"
        align="center"
        label="发布时间"
        prop="display_time"
        sortable="custom"
      >
        <template #default="scope">
          <span>{{
            $filters.parseTime(scope.row.display_time, '{y}-{m}-{d} {h}:{i}')
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        class-name="status-col"
        align="center"
        label="发布状态"
        width="110"
      >
        <template slot-scope="{ row }">
          <el-tag :type="statusFilter(row.status)">
            {{ row.status === 'published' ? '已发布' : '草稿' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        width="120px"
        align="center"
        label="评论开放状态"
        column-key="comment_disabled"
        :filters="commentList"
      >
        <template #default="scope">
          <el-switch :value="!scope.row.comment_disabled" />
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="作者">
        <template #default="scope">
          <span>{{ scope.row.author && scope.row.author.username }}</span>
        </template>
      </el-table-column>
      <el-table-column
        class-name="status-col"
        label="操作"
        width="150"
        align="center"
      >
        <template #default="scope">
          <router-link :to="'/guide/edit/' + scope.row._id">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
            ></el-button>
          </router-link>
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
  </div>
</template>

<script>
import { getGuides, deleteGuide } from '@api/guide'

export default {
  name: 'Guide',
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
      commentList: [
        { text: '开放', value: false },
        { text: '关闭', value: true },
      ],
      newGuideRules: {
        name: [
          { required: true, message: '请输入岛民名字', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' },
        ],
      },
      multipleSelection: [],
    }
  },
  computed: {},
  created() {
    this.fetchData()
  },
  methods: {
    fetchData(param) {
      this.commonApi.getList(param, getGuides, this)
    },
    handleDelete(id) {
      this.commonApi.deleteById(id, deleteGuide, this.fetchData)
    },
    handelMultipleDelete() {
      this.commonApi.multipleDelete(
        this.multipleSelection,
        deleteGuide,
        this.fetchData
      )
    },
    commentHandler(state, id) {},
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger',
      }
      return statusMap[status]
    },
  },
}
</script>

<style scoped></style>
