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
import { computed, defineComponent, watch, toRefs, reactive } from 'vue'
import { useStore } from 'vuex'
import useDelete from '@composables/useDelete'
import useFilter from '@composables/useFilter'
import useList from '@composables/useList'
import useSort from '@composables/useSort'
import { getDesignList, deleteDesign } from '@api/design'

export default defineComponent({
  name: 'DesignList',
  inject: ['apiUrl'],
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

    const { type, queryKey } = toRefs(props)

    const { sort, sortJson, sortChange } = useSort()

    const listQuery = reactive({
      query: queryKey.value,
      page: 1,
      pageSize: 10,
      type: type.value,
      sort,
      sortJson,
    })

    watch(queryKey, val => (listQuery.query = val))

    watch(roles, val => {
      if (roles.value.length === 1 && roles.value.includes('normal'))
        listQuery.user = userId.value
    })

    const { list, total, listLoading, refreshList } = useList(
      listQuery,
      getDesignList
    )

    const { filterChange } = useFilter(listQuery)

    const { selectionChange, handleDelete, multiDelete } = useDelete(
      deleteDesign,
      refreshList
    )

    return {
      list,
      total,
      listLoading,
      listQuery,
      refreshList,
      filterChange,
      sortChange,
      selectionChange,
      handleDelete,
      multiDelete,
    }
  },
})
</script>
