<template>
  <div class="app-container">
    <el-row class="search-box" type="flex" justify="space-between">
      <el-col :span="16">
        <el-row :gutter="24">
          <el-col :span="16">
            <el-input
              v-model="queryInfo.query"
              placeholder="请输入服饰关键字"
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
              @click="() => commonApi.openAddForm('clothing', this)"
              >添加服饰</el-button
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
      <el-table-column align="center" label="照片" width="60" prop="photoSrc">
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
          {{ scope.row.type }}
        </template>
      </el-table-column>
      <el-table-column
        label="获取途径"
        align="center"
        column-key="channels"
        :filters="channelList"
      >
        <template #default="scope">
          {{
            scope.row.activity
              ? scope.row.activity + '/' + scope.row.channels.join('/')
              : scope.row.channels.join('/')
          }}
        </template>
      </el-table-column>
      <el-table-column
        label="颜色"
        align="center"
        prop="color"
        column-key="color"
        :filters="colorList"
      >
        <template #default="scope">
          {{ scope.row.color.length }}种颜色
          <!-- span v-for="(item, index) in scope.row.color">{{ index === scope.row.color.length - 1 ? item : item + '、' }}</span -->
        </template>
      </el-table-column>
      <el-table-column
        label="风格"
        align="center"
        prop="style"
        sortable="custom"
        column-key="style"
        :filters="styleList"
      >
        <template #default="scope">
          {{ scope.row.style.join() }}
        </template>
      </el-table-column>
      <el-table-column
        label="主题"
        align="center"
        prop="theme"
        column-key="theme"
        :filters="themeList"
      >
        <template #default="scope">
          {{ scope.row.theme.join() }}
        </template>
      </el-table-column>
      <el-table-column
        label="售卖时间"
        align="center"
        prop="saleTime"
        sortable="custom"
        column-key="saleTime"
        :filters="seasonList"
      >
        <template #default="scope">
          {{ scope.row.saleTime }}
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
      title="添加服饰"
      v-model="dialogVisible"
      width="60%"
      :close-on-click-modal="false"
      :before-close="closeDialog"
    >
      <el-form
        ref="newClothingRef"
        :inline="false"
        :model="newClothing"
        :rules="newClothingRules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="名称" prop="name">
              <el-input v-model="newClothing.name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="英文名" prop="engName">
              <el-input v-model="newClothing.engName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="日文名" prop="jpnName">
              <el-input v-model="newClothing.jpnName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="类型" prop="type" required>
              <el-select
                v-model="newClothing.type"
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
            <el-form-item label="价格" prop="price">
              <el-input v-model.number="newClothing.price" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="颜色" prop="color">
              <el-select
                v-model="newClothing.color"
                multiple
                collapse-tags
                placeholder="请选择颜色"
              >
                <el-option
                  v-for="item in colorList"
                  :label="item.text"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="风格" prop="style">
              <el-select
                v-model="newClothing.style"
                multiple
                collapse-tags
                placeholder="请选择风格"
              >
                <el-option
                  v-for="item in styleList"
                  :label="item.text"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主题" prop="theme">
              <el-select
                v-model="newClothing.theme"
                multiple
                collapse-tags
                placeholder="请选择主题"
              >
                <el-option
                  v-for="item in themeList"
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
                v-model="newClothing.orderType"
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
                v-model="newClothing.channels"
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
          <el-col v-show="isSale" :span="8">
            <el-form-item label="售卖时间" prop="saleTime">
              <el-select
                v-model="newClothing.saleTime"
                placeholder="请选择售卖时间"
              >
                <el-option
                  v-for="item in seasonList"
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
                v-model="newClothing.activity"
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
              <upload-multi ref="upload" drag :list="newClothing.photoSrc" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="途径说明" prop="channelDetail">
              <el-input
                v-model="newClothing.channelDetail"
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
        <el-button type="primary" @click="postClothing">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getClothingList,
  addClothing,
  getClothing,
  deleteClothing,
} from '@api/clothing'
import getOption from '@utils/get-option'
import { ref, onMounted, watch, toRefs, computed } from 'vue'

export default {
  name: 'Clothing',
  data() {
    return {
      list: null,
      listLoading: true,
      queryInfo: {
        query: '',
        page: 1, // 当前的页数
        pageSize: 10, // 当前每页显示多少条数据
        sortJson: {},
        sort: '',
      },
      total: 0,
      dialogVisible: false,
      emptyText: '没有相关数据',
      newClothing: {
        name: '',
        engName: '',
        jpnName: '',
        price: null,
        type: '',
        color: [], // 颜色
        style: [], // 风格
        theme: [], // 主题
        saleTime: '',
        orderType: '', // 订购类型
        channels: [], // 获取途径
        channelDetail: '', // 获取途径详情
        photoSrc: [],
        activity: '',
      },
      typeList: [],
      channelList: [],
      colorList: [],
      styleList: [],
      orderTypeList: [
        { text: '订购', value: '订购' },
        { text: '不可订购', value: '不可订购' },
        { text: '里数兑换', value: '里数兑换' },
        { text: '非卖品', value: '非卖品' },
      ],
      themeList: [],
      seasonList: [],
      activityList: [],
      newClothingRules: {
        name: [
          { required: true, message: '请输入服饰名', trigger: 'blur' },
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
    // isNpc() {
    //   let isNpc = this.newClothing.channels.includes('npc赠送')
    //   return isNpc
    // },
    isSale() {
      const isSaleBl = this.newClothing.orderType === '订购'
      return isSaleBl
    },
  },
  created() {
    this.fetchData()
    this.getOptions()
  },
  methods: {
    fetchData(param) {
      this.commonApi.getList(param, getClothingList, this)
    },
    getOptions() {
      getOption('clothingType', list => {
        this.typeList = list
      })
      getOption('clothingChannels', list => {
        this.channelList = list
      })
      getOption('clothingColor', list => {
        this.colorList = list
      })
      getOption('clothingStyle', list => {
        this.styleList = list
      })
      getOption('clothingTheme', list => {
        this.themeList = list
      })
      getOption('activity', list => {
        this.activityList = list
      })
      getOption('season', list => {
        this.seasonList = list
      })
    },
    postClothing() {
      this.commonApi.postUploadForm('clothing', addClothing, this)
    },
    handleEdit(id) {
      this.commonApi.openEditForm(id, 'clothing', getClothing, this)
    },
    handleDelete(id) {
      this.commonApi.deleteById(id, deleteClothing, this.fetchData)
    },
    handelMultipleDelete() {
      this.commonApi.multipleDelete(
        this.multipleSelection,
        deleteClothing,
        this.fetchData
      )
    },
  },
}
</script>

<style scoped></style>
