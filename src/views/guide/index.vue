<template>
  <div class="app-container">
    <el-row class="search-box" type="flex" justify="space-between">
      <el-col :span="16">
        <el-row :gutter="24">
          <el-col :span="16">
            <search-bar v-model:query="listQuery.query" keyword="攻略" />
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
      <el-table-column align="center" label="主图" width="80">
        <template #default="scope">
          <img
            v-if="scope.row.image_uri"
            :src="realUrl + scope.row.image_uri"
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
        <template #default="{ row }">
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
        <template #default="{ row }">
          <span>{{ row.author && row.author.username }}</span>
        </template>
      </el-table-column>
      <el-table-column
        class-name="status-col"
        label="操作"
        width="150"
        align="center"
      >
        <template #default="scope">
          <router-link
            :to="'/guide/edit/' + scope.row._id"
            style="margin-right: 10px"
          >
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

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import useDelete from '@composables/useDelete'
import useFilter from '@composables/useFilter'
import useList from '@composables/useList'
import useSort from '@composables/useSort'
import useLoading from '@composables/useLoading'
import { getGuides, deleteGuide } from '@api/guide'

export default defineComponent({
  name: 'Guide',
  inject: ['realUrl'],
  setup() {
    const loadingRef = ref(null)
    const { sort, sortJson, sortChange } = useSort()

    const listQuery = reactive({
      query: '',
      page: 1,
      pageSize: 10,
      sort,
      sortJson,
    })

    const { list, total, listLoading, refreshList } = useList(
      listQuery,
      getGuides
    )

    useLoading(loadingRef, listLoading)
    const { filterChange } = useFilter(listQuery)

    const { selectionChange, handleDelete, multiDelete } = useDelete(
      deleteGuide,
      refreshList
    )

    const statusFilter = (status: String) => {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger',
      }
      return statusMap[status]
    }

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
      guideFormRules: {
        name: [
          { required: true, message: '请输入岛民名字', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' },
        ],
      },
      loadingRef,
      commentList: [
        { text: '开放', value: false },
        { text: '关闭', value: true },
      ],
      statusFilter,
    }
  },
})
</script>

<style scoped></style>
