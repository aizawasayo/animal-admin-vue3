<template>
  <div class="tabPane-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="加载中"
      border
      fit
      highlight-current-row
      :empty-text="emptyText"
      @selection-change="
        selection => commonApi.handleSelectionChange(selection, this)
      "
      @filter-change="filters => commonApi.filterChange(filters, this)"
      @sort-change="sortInfo => commonApi.sortChange(sortInfo, this)"
    >
      <el-table-column
        type="selection"
        width="40"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column align="center" label="序号" width="55">
        <template slot-scope="scope">
          {{ scope.row.orderNum ? scope.row.orderNum : scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        label="名称"
        align="center"
        prop="name"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="isActivity"
        label="所属半球"
        align="center"
        prop="position"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span v-for="(item, index) in scope.row.position">{{
            index === scope.row.position.length - 1 ? item : item + '/'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="isActivity"
        label="所在时期"
        align="center"
        prop="duration"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ scope.row.duration }}
        </template>
      </el-table-column>
      <el-table-column v-if="isTopic" label="图标" align="center" prop="icon">
        <template slot-scope="scope">
          {{ scope.row.icon }}
        </template>
      </el-table-column>
      <el-table-column v-if="isTopic" label="颜色" align="center" prop="color">
        <template slot-scope="scope">
          {{ scope.row.color }}
        </template>
      </el-table-column>
      <el-table-column
        class-name="status-col"
        label="操作"
        width="150"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            @click="$emit('paneEdit', scope.row._id, 'notDIY')"
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
      v-model:page="queryInfo.page"
      v-model:limit="queryInfo.pageSize"
      @pagination="fetchData"
    />
  </div>
</template>

<script>
import { getOptions, deleteOption } from '@api/option'

export default {
  name: 'OptionList',
  props: {
    type: {
      type: String,
      default: '',
    },
    queryKey: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      list: null,
      listLoading: true,
      queryInfo: {
        query: this.queryKey,
        page: 1,
        pageSize: 10,
        type: this.type,
        sortJson: {},
        sort: '',
      },
      total: 0,
      emptyText: '没有相关数据',
      multipleSelection: [],
    }
  },
  computed: {
    isActivity() {
      return this.type === 'activity'
    },
    isTopic() {
      return this.type === 'topic'
    },
  },
  watch: {
    queryKey(newVal) {
      this.queryInfo.query = newVal
    },
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData(param) {
      this.commonApi.getList(param, getOptions, this)
    },
    handleDelete(id) {
      this.commonApi.deleteById(id, deleteOption, this.fetchData)
    },
    handelMultipleDelete() {
      this.commonApi.multipleDelete(
        this.multipleSelection,
        deleteOption,
        this.fetchData
      )
    },
  },
}
</script>
