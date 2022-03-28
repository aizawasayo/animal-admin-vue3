<template>
  <div class="app-container">
    <el-row class="search-box" type="flex" justify="space-between">
      <el-col :span="16">
        <el-row :gutter="24">
          <el-col :span="16">
            <search-bar v-model:query="listQuery.query" keyword="家具" />
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="openAddDialog"
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
            :src="realUrl + scope.row.photoSrc[0].src"
            width="25"
            height="25"
          />
          <img
            v-else-if="scope.row.photoSrc.length > 0 && scope.row.photoSrc[0]"
            :src="realUrl + scope.row.photoSrc"
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
        ref="furnitureFormRef"
        :inline="false"
        :model="furnitureFormData"
        :rules="furnitureFormRules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="名称" prop="name">
              <el-input v-model="furnitureFormData.name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="英文名" prop="engName" required>
              <el-input v-model="furnitureFormData.engName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="日文名" prop="jpnName">
              <el-input v-model="furnitureFormData.jpnName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="类型" prop="type" required>
              <el-select
                v-model="furnitureFormData.type"
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
              <el-input v-model.number="furnitureFormData.price" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="尺寸" prop="size" required>
              <el-select
                v-model="furnitureFormData.size"
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
                v-model="furnitureFormData.remould"
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
                v-model="furnitureFormData.orderType"
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
                v-model="furnitureFormData.channels"
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
                v-model="furnitureFormData.series"
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
                v-model="furnitureFormData.activity"
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
              <upload-multi
                ref="uploadRef"
                drag
                :list="furnitureFormData.photoSrc"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="途径说明" prop="channelDetail">
              <el-input
                v-model="furnitureFormData.channelDetail"
                type="textarea"
                placeholder="请输入具体途径说明"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24"> </el-col>
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
import { defineComponent, ref, reactive, onMounted } from 'vue'
import {
  getFurnitureList,
  addFurniture,
  getFurniture,
  deleteFurniture,
} from '@api/furniture'
import getOption from '@utils/get-option'
import useMix from '@composables/useMix'

export default defineComponent({
  name: 'Furniture',
  inject: ['realUrl'],
  setup() {
    const furnitureFormRef = ref(null)
    const furnitureFormData = reactive({
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
    })

    const apiOption = {
      getListApi: getFurnitureList,
      getInfoApi: getFurniture,
      deleteApi: deleteFurniture,
      addApi: addFurniture,
    }

    const uploadRef = ref(null)
    const loadingRef = ref(null)
    const mixProps = useMix(
      apiOption,
      furnitureFormRef,
      furnitureFormData,
      uploadRef,
      loadingRef
    )

    const typeList = ref([])
    const sizeList = ref([])
    const seriesList = ref([])
    const activityList = ref([])
    const channelList = ref([])

    const getOptions = () => {
      getOption('furnitureChannels', list => {
        channelList.value = list
      })
      getOption('furnitureType', list => {
        typeList.value = list
      })
      getOption('series', list => {
        seriesList.value = list
      })
      getOption('size', list => {
        sizeList.value = list
      })
      getOption('activity', list => {
        activityList.value = list
      })
    }

    onMounted(getOptions)

    return {
      ...mixProps,
      furnitureFormRef,
      furnitureFormData,
      furnitureFormRules: {
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
      uploadRef,
      loadingRef,
      typeList,
      sizeList,
      seriesList,
      activityList,
      channelList,
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
    }
  },
})
</script>

<style scoped></style>
