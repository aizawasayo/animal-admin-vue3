<template>
  <div class="app-container">
    <el-row class="search-box" type="flex" justify="space-between">
      <el-col :span="16">
        <el-row :gutter="24">
          <el-col :span="16">
            <search-bar v-model:query="listQuery.query" keyword="唱片" />
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="openAddDialog"
              >添加唱片</el-button
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
      <el-table-column align="center" label="封面" width="60" prop="photoSrc">
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
        label="买入价格"
        align="center"
        prop="price"
        sortable="custom"
      >
        <template #default="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column label="售出价格" align="center">
        <template #default="scope">
          {{ scope.row.salePrice }}
        </template>
      </el-table-column>
      <el-table-column label="来源" align="center">
        <template #default="scope">
          {{ scope.row.channel.join('/') }}
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
      title="添加唱片"
      v-model="dialogVisible"
      width="60%"
      :close-on-click-modal="false"
      :before-close="closeDialog"
    >
      <el-form
        ref="recordFormRef"
        :inline="false"
        :model="recordFormData"
        :rules="recordFormRules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="名称" prop="name">
              <el-input v-model="recordFormData.name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="英文名" prop="engName">
              <el-input v-model="recordFormData.engName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="日文名" prop="jpnName">
              <el-input v-model="recordFormData.jpnName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="买入价格" prop="price">
              <el-input v-model.number="recordFormData.price" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="售出价格" prop="salePrice">
              <el-input v-model.number="recordFormData.salePrice" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="来源" prop="channel" required>
              <el-select
                v-model="recordFormData.channel"
                multiple
                collapse-tags
                placeholder="请选择获取方式"
              >
                <el-option
                  v-for="item in channelList"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="封面" prop="photoSrc">
              <upload-multi
                ref="uploadRef"
                drag
                :list="recordFormData.photoSrc"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handlePost(true)">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, computed } from 'vue'
import { getRecords, addRecord, getRecord, deleteRecord } from '@api/record'
import useMix from '@composables/useMix'

export default defineComponent({
  name: 'Record',
  inject: ['apiUrl'],
  setup() {
    const recordFormRef = ref(null)
    const recordFormData = reactive({
      name: '',
      engName: '',
      jpnName: '',
      price: 3200,
      salePrice: 800,
      channel: [],
      photoSrc: [],
    })

    const apiOption = {
      getListApi: getRecords,
      getInfoApi: getRecord,
      deleteApi: deleteRecord,
      addApi: addRecord,
    }
    const uploadRef = ref(null)
    const loadingRef = ref(null)
    const mixProps = useMix(
      apiOption,
      recordFormRef,
      recordFormData,
      uploadRef,
      loadingRef
    )

    return {
      ...mixProps,
      recordFormRef,
      recordFormData,
      recordFormRules: {
        name: [
          { required: true, message: '请输入唱片名', trigger: 'blur' },
          {
            min: 1,
            max: 16,
            message: '长度在 1 到 16 个字符',
            trigger: 'blur',
          },
        ],
      },
      loadingRef,
      uploadRef,
      channelList: [
        { text: 'Nook购物', value: 'Nook购物' },
        { text: 'KK赠送', value: 'KK赠送' },
        { text: '第一次KK演唱会后', value: '第一次KK演唱会后' },
        { text: '生日当天KK赠送', value: '生日当天KK赠送' },
        { text: '隐藏歌曲', value: '隐藏歌曲' },
      ],
      isSale: computed(() => recordFormData.orderType === '订购'),
    }
  },
})
</script>

<style scoped></style>
