<template>
  <div class="app-container">
    <el-row class="search-box" type="flex" justify="space-between">
      <el-col :span="16">
        <el-row :gutter="24">
          <el-col :span="16">
            <search-bar v-model:query="listQuery.query" keyword="焦点图" />
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="openAddDialog"
              >添加焦点图</el-button
            >
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
      <el-table-column align="center" label="图片" width="80">
        <template #default="scope">
          <img
            v-if="scope.row.avatar"
            :src="apiUrl + scope.row.avatar"
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
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column
        label="链接"
        align="center"
        prop="link"
        sortable="custom"
      >
        <template #default="scope">
          {{ scope.row.link }}
        </template>
      </el-table-column>
      <el-table-column
        label="发布日期"
        align="center"
        prop="created_time"
        sortable="custom"
      >
        <template #default="scope">
          {{ $filters.parseTime(scope.row.created_time, '{y}-{m}-{d}') }}
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        width="90"
        align="center"
        prop="state"
        column-key="state"
        :filters="stateList"
        sortable="custom"
      >
        <template #default="scope">
          {{ scope.row.state === 0 ? '启用' : '禁用' }}
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
      title="添加焦点图"
      v-model="dialogVisible"
      width="60%"
      :close-on-click-modal="false"
      :before-close="closeDialog"
    >
      <el-form
        ref="bannerFormRef"
        :inline="false"
        :model="bannerFormData"
        :rules="bannerFormRules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="标题" prop="title">
              <el-input
                v-if="bannerFormData._id"
                v-model="bannerFormData.title"
              />
              <el-input v-else v-model="bannerFormData.title" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="链接" prop="link">
              <el-input v-model="bannerFormData.link" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态" prop="state">
              <el-radio-group v-model="bannerFormData.state">
                <el-radio :label="0">启用</el-radio>
                <el-radio :label="1">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="图片" prop="avatar" required>
              <upload-single
                v-model="bannerFormData.avatar"
                dialog-width="60%"
                drag
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handlePost">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue'
import { getBanners, addBanner, getBanner, deleteBanner } from '@api/banner'
import useMix from '@composables/useMix'

export default defineComponent({
  name: 'Banner',
  inject: ['apiUrl'],
  components: {},
  setup() {
    const bannerFormRef = ref(null)
    const bannerFormData = reactive({
      title: '',
      link: '',
      avatar: '',
      state: 0,
    })
    const apiOption = {
      getListApi: getBanners,
      getInfoApi: getBanner,
      deleteApi: deleteBanner,
      addApi: addBanner,
    }
    const loadingRef = ref(null)
    const mixProps = useMix(
      apiOption,
      bannerFormRef,
      bannerFormData,
      null,
      loadingRef
    )

    return {
      ...mixProps,
      bannerFormRef,
      bannerFormData,
      bannerFormRules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          {
            min: 6,
            max: 30,
            message: '长度在 6 到 30 个字符',
            trigger: 'blur',
          },
        ],
        avatar: [{ required: true, message: '请上传图片', trigger: 'blur' }],
      },
      loadingRef,
      stateList: [
        { text: '启用', value: 0 },
        { text: '禁用', value: 1 },
      ],
    }
  },
})
</script>
<style scoped></style>
