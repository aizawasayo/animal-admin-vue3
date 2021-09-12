<template>
  <div class="app-container">
    <el-row class="search-box" type="flex" justify="space-between">
      <el-col :span="16">
        <el-row :gutter="24">
          <el-col :span="16">
            <el-input
              v-model="queryInfo.query"
              placeholder="请输入家具关键字"
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
              @click="() => commonApi.openAddForm('furniture', this)"
              >添加家具</el-button
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
      <el-table-column
        align="center"
        label="照片"
        width="60"
        prop="photoSrc"
        sortable="custom"
      >
        <template #default="scope">
          <img
            v-if="scope.row.photoSrc.length > 0 && scope.row.photoSrc[0].src"
            :src="apiUrl + scope.row.photoSrc[0].src"
            width="25"
            height="25"
          />
          <img
            v-else-if="scope.row.photoSrc.length > 0 && scope.row.photoSrc[0]"
            :src="apiUrl + scope.row.photoSrc"
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
      <el-table-column
        label="价格"
        align="center"
        prop="price"
        sortable="custom"
      >
        <template #default="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column label="英文名" align="center">
        <template #default="scope">
          <span>{{ scope.row.engName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日文名" align="center">
        <template #default="scope">
          {{ $filters.textFilter(scope.row.jpnName, 5) }}
        </template>
      </el-table-column>
      <el-table-column
        label="类型"
        align="center"
        column-key="type"
        :filters="typeList"
      >
        <template #default="scope">
          {{ scope.row.type.join('/') }}
        </template>
      </el-table-column>
      <el-table-column
        label="获取途径"
        align="center"
        column-key="channels"
        :filters="channelList"
      >
        <template #default="scope">
          <span v-if="scope.row.activity">{{ scope.row.activity }}/</span>
          <span> {{ scope.row.channels.join('/') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="系列"
        align="center"
        prop="series"
        column-key="series"
        :filters="seriesList"
      >
        <template #default="scope">
          {{ scope.row.series }}
        </template>
      </el-table-column>
      <el-table-column
        label="占地面积"
        align="center"
        prop="size"
        sortable="custom"
        column-key="size"
        :filters="sizeList"
      >
        <template #default="scope">
          {{ scope.row.size }}
        </template>
      </el-table-column>
      <el-table-column
        label="改造类型"
        align="center"
        prop="remould"
        column-key="remould"
        :filters="remouldList"
      >
        <template #default="scope">
          {{ scope.row.remould }}
        </template>
      </el-table-column>
      <el-table-column
        label="订购类型"
        align="center"
        prop="orderType"
        sortable="custom"
        column-key="orderType"
        :filters="orderTypeList"
      >
        <template #default="scope">
          {{ scope.row.orderType }}
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
      title="添加家具"
      v-model="dialogVisible"
      width="60%"
      :close-on-click-modal="false"
      :before-close="closeDialog"
    >
      <el-form
        ref="newFurnitureRef"
        :inline="false"
        :model="newFurniture"
        :rules="newFurnitureRules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="名称" prop="name">
              <el-input v-model="newFurniture.name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="英文名" prop="engName" required>
              <el-input v-model="newFurniture.engName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="日文名" prop="jpnName">
              <el-input v-model="newFurniture.jpnName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="类型" prop="type" required>
              <el-select
                v-model="newFurniture.type"
                multiple
                collapse-tags
                placeholder="请选择种类"
              >
                <el-option
                  v-for="item in typeList"
                  :label="item.text"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="价格" prop="price" required>
              <el-input v-model.number="newFurniture.price" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="尺寸" prop="size" required>
              <el-select
                v-model="newFurniture.size"
                placeholder="请选择占地面积"
              >
                <el-option
                  v-for="item in sizeList"
                  :label="item.text"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="改造类型" prop="remould">
              <el-select
                v-model="newFurniture.remould"
                placeholder="请选择改造类型"
              >
                <el-option
                  v-for="item in remouldList"
                  :label="item.text"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订购类型" prop="orderType">
              <el-select
                v-model="newFurniture.orderType"
                placeholder="请选择订购类型"
              >
                <el-option
                  v-for="item in orderTypeList"
                  :label="item.text"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="来源(多选)" prop="channels">
              <el-select
                v-model="newFurniture.channels"
                multiple
                collapse-tags
                placeholder="请选择获取途径"
              >
                <el-option
                  v-for="item in channelList"
                  :label="item.text"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属系列" prop="series">
              <el-select
                v-model="newFurniture.series"
                placeholder="请选择所属系列"
              >
                <el-option
                  v-for="item in seriesList"
                  :label="item.text"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属活动" prop="activity">
              <el-select
                v-model="newFurniture.activity"
                placeholder="请选择所属活动"
              >
                <el-option
                  v-for="item in activityList"
                  :label="item.text"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="照片" prop="photoSrc">
              <upload-multi ref="upload" drag :list="newFurniture.photoSrc" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="途径说明" prop="channelDetail">
              <el-input
                v-model="newFurniture.channelDetail"
                type="textarea"
                placeholder="请输入具体途径说明"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24"> </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="postFurniture">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getFurnitureList,
  addFurniture,
  getFurniture,
  deleteFurniture,
} from '@api/furniture'
import getOption from '@utils/get-option'

export default {
  name: 'Furniture',
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
      newFurniture: {
        name: '',
        engName: '',
        jpnName: '',
        price: null,
        type: ['家具'],
        remould: '多颜色',
        orderType: '订购',
        character: '',
        series: '',
        size: '1.0×1.0',
        activity: '',
        channels: ['Nook商店'],
        channelDetail: '',
        photoSrc: [],
      },
      typeList: [],
      sizeList: [],
      remouldList: [
        { text: '可改造', value: '可改造' },
        { text: '不可改造', value: '不可改造' },
        { text: '多颜色', value: '多颜色' },
      ],
      orderTypeList: [
        { text: '订购', value: '订购' },
        { text: '不可订购', value: '不可订购' },
        { text: '里数兑换', value: '里数兑换' },
        { text: '非卖品', value: '非卖品' },
      ],
      seriesList: [],
      activityList: [],
      npcList: [
        { text: '狸克', value: '狸克' },
        { text: '西施惠', value: '西施惠' },
        { text: '傅珂', value: '傅珂' },
        { text: '傅达', value: '傅达' },
        { text: '雪人', value: '雪人' },
        { text: '巴猎', value: '巴猎' },
        { text: '蹦蹦', value: '蹦蹦' },
        { text: '健兆', value: '健兆' },
        { text: '阿獭', value: '阿獭' },
      ],
      channelList: [],
      newFurnitureRules: {
        name: [
          { required: true, message: '请输入家具名', trigger: 'blur' },
          {
            min: 1,
            max: 24,
            message: '长度在 1 到 24 个字符',
            trigger: 'blur',
          },
        ],
      },
      multipleSelection: [],
    }
  },
  computed: {},
  created() {
    this.fetchData()
    this.getOptions()
  },
  methods: {
    fetchData(param) {
      this.commonApi.getList(param, getFurnitureList, this)
    },
    getOptions() {
      getOption('furnitureChannels', list => {
        this.channelList = list
      })
      getOption('furnitureType', list => {
        this.typeList = list
      })
      getOption('series', list => {
        this.seriesList = list
      })
      getOption('size', list => {
        this.sizeList = list
      })
      getOption('activity', list => {
        this.activityList = list
      })
    },
    postFurniture() {
      this.commonApi.postUploadForm('furniture', addFurniture, this)
    },
    handleEdit(id) {
      this.commonApi.openEditForm(id, 'furniture', getFurniture, this)
    },
    handleDelete(id) {
      this.commonApi.deleteById(id, deleteFurniture, this.fetchData)
    },
    handelMultipleDelete() {
      this.commonApi.multipleDelete(
        this.multipleSelection,
        deleteFurniture,
        this.fetchData
      )
    },
  },
}
</script>

<style scoped></style>
