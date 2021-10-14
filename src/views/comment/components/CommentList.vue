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
      <el-table-column label="评论用户" width="160" align="center">
        <template #default="scope">
          {{ scope.row.uid.username }}
        </template>
      </el-table-column>
      <el-table-column label="评论内容" align="center" prop="content">
        <template #default="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>
      <el-table-column
        label="评论时间"
        width="200"
        align="center"
        prop="created_time"
      >
        <template #default="scope">
          {{
            $filters.parseTime(scope.row.created_time, '{y}-{m}-{d} {h}:{i}')
          }}
        </template>
      </el-table-column>
      <el-table-column label="点赞数" width="100" align="center" prop="like">
        <template #default="scope">
          {{ scope.row.like }}
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
import { defineComponent, reactive, watch, toRefs } from 'vue'
import { useStore } from 'vuex'
import useDelete from '@composables/useDelete'
import useFilter from '@composables/useFilter'
import useList from '@composables/useList'
import useSort from '@composables/useSort'
import { getComments, deleteComment } from '@api/comment'

export default defineComponent({
  name: 'CommentList',
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
    const store = useStore()
    const userId = store.getters.userId

    const { sort, sortJson, sortChange } = useSort({ created_time: 1 }) // 列表排序

    const listQuery = reactive({
      query: queryKey.value,
      page: 1,
      pageSize: 10,
      sort,
      sortJson,
    })

    watch(queryKey, val => (listQuery.query = val))

    const { list, total, listLoading, refreshList } = useList(
      listQuery,
      getComments,
      type
    )

    const { filterChange } = useFilter(listQuery) // 列表筛选

    const { selectionChange, handleDelete, multiDelete } = useDelete(
      deleteComment,
      refreshList,
      type
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
