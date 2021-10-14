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
          {{ scope.row.orderNum ? scope.row.orderNum : scope.$index + 1 }}
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
        v-if="isActivity"
        label="所属半球"
        align="center"
        prop="position"
        sortable="custom"
      >
        <template #default="scope">
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
        <template #default="scope">
          {{ scope.row.duration }}
        </template>
      </el-table-column>
      <el-table-column v-if="isTopic" label="图标" align="center" prop="icon">
        <template #default="scope">
          {{ scope.row.icon }}
        </template>
      </el-table-column>
      <el-table-column v-if="isTopic" label="颜色" align="center" prop="color">
        <template #default="scope">
          {{ scope.row.color }}
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
      v-model:page="listQuery.page"
      v-model:limit="listQuery.pageSize"
    />
  </div>
</template>

<script>
import { defineComponent, reactive, computed, watch, toRefs } from 'vue'
import useDelete from '@composables/useDelete'
import useFilter from '@composables/useFilter'
import useList from '@composables/useList'
import useSort from '@composables/useSort'
import { getOptions, deleteOption } from '@api/option'

export default defineComponent({
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
  setup(props) {
    const { type, queryKey } = toRefs(props)

    const { sort, sortJson, sortChange } = useSort() // 列表排序

    const listQuery = reactive({
      query: queryKey.value,
      page: 1,
      pageSize: 10,
      type: type.value,
      sort,
      sortJson,
    })

    watch(queryKey, val => (listQuery.query = val))

    // 列表请求返回数据及列表刷新方法
    const { list, total, listLoading, refreshList } = useList(
      listQuery,
      getOptions
    )

    const { filterChange } = useFilter(listQuery) // 列表筛选

    const { selectionChange, handleDelete, multiDelete } = useDelete(
      deleteOption,
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
      isActivity: computed(() => type.value === 'activity'),
      isTopic: computed(() => type.value === 'topic'),
    }
  },
})
</script>
