<template>
  <div class="tabPane-container">
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
        label="名称"
        align="center"
        prop="name"
        sortable="custom"
      >
        <template #default="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="介绍" align="center" prop="content">
        <template #default="scope">
          {{ scope.row.content }}
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
            @click="$emit('paneEdit', scope.row._id)"
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
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue'
import { mapGetters, useStore } from 'vuex'
import useList from '@composables/useList'
import useSearch from '@composables/useSearch'
import useFilter from '@composables/useFilter'
import { getDesignList, deleteDesign } from '@api/design'

export default defineComponent({
  name: 'DesignList',
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
  setup(props) {
    const store = useStore()
    const userId = computed(() => store.getters.userId)
    const roles = computed(() => store.getters.roles)
    watch(queryKey, newKey => (queryInfo.query = newVal))
    const filter = useFilter()
    const search = useSearch()
    const { list, total } = useList()
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

  created() {
    // this.fetchData()
  },
  methods: {
    fetchData(param) {
      if (this.roles.length === 1 && this.roles.includes('normal')) {
        this.queryInfo.user = this.userId
      }
      this.commonApi.getList(param, getDesignList, this)
    },
    handleDelete(id) {
      this.commonApi.deleteById(id, deleteDesign, this.fetchData)
    },
    handelMultipleDelete() {
      this.commonApi.multipleDelete(
        this.multipleSelection,
        deleteDesign,
        this.fetchData
      )
    },
  },
})
</script>
