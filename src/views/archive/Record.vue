<template>
  <div class="app-container">
    <el-row class="search-box" type="flex" justify="space-between">
      <el-col :span="16">
        <el-row :gutter="24">
          <el-col :span="16">
            <el-input
              v-model="queryInfo.query"
              placeholder="请输入唱片关键字"
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
              @click="() => commonApi.openAddForm('record', this)"
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
          {{ scope.row.jpnName | textFilter(5) }}
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
      :visible.sync="dialogVisible"
      width="60%"
      :close-on-click-modal="false"
      :before-close="closeDialog"
    >
      <el-form
        ref="newRecordRef"
        :inline="false"
        :model="newRecord"
        :rules="newRecordRules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="名称" prop="name">
              <el-input v-model="newRecord.name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="英文名" prop="engName">
              <el-input v-model="newRecord.engName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="日文名" prop="jpnName">
              <el-input v-model="newRecord.jpnName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="买入价格" prop="price">
              <el-input v-model.number="newRecord.price" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="售出价格" prop="salePrice">
              <el-input v-model.number="newRecord.salePrice" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="来源" prop="channel" required>
              <el-select
                v-model="newRecord.channel"
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
              <upload-multi ref="upload" drag :list="newRecord.photoSrc" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="postRecord">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRecords, addRecord, getRecord, deleteRecord } from '@api/record'
import getOption from '@utils/get-option'

export default {
  name: 'Record',
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
      newRecord: {
        name: '',
        engName: '',
        jpnName: '',
        price: 3200,
        salePrice: 800,
        channel: [],
        photoSrc: [],
      },
      channelList: [
        { text: 'Nook购物', value: 'Nook购物' },
        { text: 'KK赠送', value: 'KK赠送' },
        { text: '第一次KK演唱会后', value: '第一次KK演唱会后' },
        { text: '生日当天KK赠送', value: '生日当天KK赠送' },
        { text: '隐藏歌曲', value: '隐藏歌曲' },
      ],
      newRecordRules: {
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
      multipleSelection: [],
    }
  },
  computed: {
    isSale() {
      const isSaleBl = this.newRecord.orderType === '订购'
      return isSaleBl
    },
  },
  created() {
    this.fetchData()
    this.getOptions()
  },
  methods: {
    fetchData(param) {
      this.commonApi.getList(param, getRecords, this)
    },
    getOptions() {
      getOption('size', list => {
        this.sizeList = list
      })
    },
    postRecord() {
      this.commonApi.postUploadForm('record', addRecord, this)
    },
    handleEdit(id) {
      this.commonApi.openEditForm(id, 'record', getRecord, this)
    },
    handleDelete(id) {
      this.commonApi.deleteById(id, deleteRecord, this.fetchData)
    },
    handelMultipleDelete() {
      this.commonApi.multipleDelete(
        this.multipleSelection,
        deleteRecord,
        this.fetchData
      )
    },
  },
}
</script>

<style scoped></style>
