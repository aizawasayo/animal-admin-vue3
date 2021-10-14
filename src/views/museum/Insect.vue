<template>
  <div class="app-container">
    <el-row class="search-box" type="flex" justify="space-between">
      <el-col :span="16">
        <el-row :gutter="24">
          <el-col :span="16">
            <search-bar v-model:query="listQuery.query" keyword="昆虫" />
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="openAddDialog"
              >添加昆虫</el-button
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
      <el-table-column type="selection" width="36"> </el-table-column>
      <el-table-column align="center" label="序号" width="50">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="照片" width="60">
        <template #default="scope">
          <img
            v-if="scope.row.photoSrc"
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
        column-key="price"
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
          {{ scope.row.jpnName }}
        </template>
      </el-table-column>
      <el-table-column label="出现月份" align="center">
        <el-table-column label="北半球" align="center">
          <template #default="scope">
            <span v-if="scope.row.activeTime.north[0] === '全年'">全年</span>
            <span v-else>
              {{
                scope.row.activeTime.north[0] +
                '-' +
                scope.row.activeTime.north[
                  scope.row.activeTime.north.length - 1
                ]
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="南半球" align="center">
          <template #default="scope">
            <span v-if="scope.row.activeTime.south[0] === '全年'">全年</span>
            <span v-else>
              {{
                scope.row.activeTime.south[0] +
                '-' +
                scope.row.activeTime.south[
                  scope.row.activeTime.south.length - 1
                ]
              }}
            </span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="场所"
        align="center"
        column-key="locale"
        :filters="localeList"
      >
        <template #default="scope">
          <span v-for="(item, index) in scope.row.locale">{{
            index === scope.row.locale.length - 1 ? item : item + '、'
          }}</span>
          <span v-for="(item, index) in scope.row.elseCondition">
            ({{ item }})
          </span>
        </template>
      </el-table-column>
      <el-table-column label="时间段" align="center">
        <template #default="scope">
          {{ scope.row.period === '1点-24点' ? '全天' : scope.row.period }}
        </template>
      </el-table-column>
      <el-table-column
        label="出现天气"
        align="center"
        column-key="weatherCondition"
        :filters="weatherList"
      >
        <template #default="scope">
          {{ scope.row.weatherCondition }}
        </template>
      </el-table-column>
      <el-table-column label="解锁条件" align="center" width="50">
        <template #default="scope">
          {{ scope.row.unlockCondition ? '有' : '无' }}
        </template>
      </el-table-column>
      <el-table-column
        label="稀有度"
        align="center"
        prop="rarity"
        sortable="custom"
        column-key="rarity"
        :filters="rarityList"
      >
        <template #default="scope">
          {{ scope.row.rarity }}
        </template>
      </el-table-column>
      <el-table-column label="简介">
        <template #default="scope">
          {{ $filters.textFilter(scope.row.introduction, 10) }}
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
      title="添加昆虫"
      v-model="dialogVisible"
      width="60%"
      :close-on-click-modal="false"
      :before-close="closeDialog"
    >
      <el-form
        ref="insectFormDataRef"
        :inline="false"
        :model="insectFormData"
        :rules="insectFormDataRules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="名称" prop="name">
              <el-input v-model="insectFormData.name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="英文名" prop="engName">
              <el-input v-model="insectFormData.engName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="日文名" prop="jpnName">
              <el-input v-model="insectFormData.jpnName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="价格" prop="price">
              <el-input v-model.number="insectFormData.price" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="场所" prop="locale">
              <el-select
                v-model="insectFormData.locale"
                multiple
                placeholder="请选择出现场所"
              >
                <el-option
                  v-for="item in localeList"
                  :label="item.text"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出现天气" prop="weatherCondition">
              <el-select
                v-model="insectFormData.weatherCondition"
                placeholder="请选择出现天气"
              >
                <el-option
                  v-for="item in weatherList"
                  :label="item.text"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="出现月份(多选)：" label-width="160px">
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="北半球" prop="activeTime.north">
              <el-select
                v-model="insectFormData.activeTime.north"
                multiple
                collapse-tags
                clearable
                placeholder="请选择月份"
                style="width: 100%"
                @change="
                  val => {
                    selectAll(val, 'north')
                  }
                "
              >
                <el-option
                  v-for="item in monthList"
                  :label="item.text"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="南半球" prop="activeTime.south">
              <el-select
                v-model="insectFormData.activeTime.south"
                multiple
                collapse-tags
                clearable
                placeholder="请选择月份"
                style="display: block"
                @change="
                  val => {
                    selectAll(val, 'south')
                  }
                "
              >
                <el-option
                  v-for="item in monthList"
                  :label="item.text"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="出现时间段："
              prop="period"
              label-width="160px"
            >
              <!-- <el-select v-model="insectFormData.period" placeholder="请选择活跃时间">
                <el-option v-for="item in periodList"  :label="item.text" :value="item.value"> </el-option>
              </el-select> -->
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="开始时间" prop="periodStart">
              <el-time-select
                v-model="insectFormData.periodStart"
                :picker-options="periodOptions"
                placeholder="请选择开始时间"
              >
              </el-time-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="结束时间" prop="periodEnd">
              <el-time-select
                v-model="insectFormData.periodEnd"
                :picker-options="periodOptions"
                placeholder="请选择结束时间"
              >
              </el-time-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="解锁要求" prop="unlockCondition">
              <el-select
                v-model="insectFormData.unlockCondition"
                placeholder="请选择解锁条件"
              >
                <el-option
                  v-for="item in unlockConditionList"
                  :label="item.text"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="稀有度" prop="rarity">
              <el-select
                v-model="insectFormData.rarity"
                placeholder="请选择稀有程度"
              >
                <el-option
                  v-for="item in rarityList"
                  :label="item.text"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="其他选项" prop="elseCondition">
              <el-checkbox-group v-model="insectFormData.elseCondition">
                <el-checkbox label="飞行"></el-checkbox>
                <el-checkbox label="跳跃"></el-checkbox>
                <el-checkbox label="爬行"></el-checkbox>
                <el-checkbox label="会逃走"></el-checkbox>
                <el-checkbox label="挖掘"></el-checkbox>
                <el-checkbox label="敲击"></el-checkbox>
                <el-checkbox label="摇晃"></el-checkbox>
                <el-checkbox label="异色花"></el-checkbox>
                <el-checkbox label="白色花"></el-checkbox>
                <el-checkbox label="腐烂的大头菜"></el-checkbox>
                <el-checkbox label="会主动攻击"></el-checkbox>
                <el-checkbox label="椰子树"></el-checkbox>
                <el-checkbox label="椰子树除外"></el-checkbox>
                <el-checkbox label="椰子和香蕉树除外"></el-checkbox>
                <el-checkbox label="户外灯光附近"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="照片" prop="photoSrc">
              <upload-single
                v-model="insectFormData.photoSrc"
                dialog-width="30%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="简介" prop="introduction">
              <el-input v-model="insectFormData.introduction" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="handlePost(false, beforePostProcess)"
            >确 定</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from 'vue'
import getOption from '@utils/get-option'
import { getInsects, addInsect, getInsect, deleteInsect } from '@api/insect'
import useMix from '@composables/useMix'
import useSelectMonth from '@composables/useSelectMonth'
import usePeriodProcess from '@composables/usePeriodProcess'

export default defineComponent({
  name: 'Insect',
  inject: ['apiUrl', 'monthList', 'periodOptions'],
  setup() {
    const insectFormRef = ref(null)
    const insectFormData = reactive({
      name: '',
      price: null,
      engName: '',
      jpnName: '',
      activeTime: { north: [], south: [] },
      locale: [],
      period: '',
      periodStart: '',
      periodEnd: '',
      weatherCondition: '',
      unlockCondition: '',
      elseCondition: [],
      rarity: '',
      introduction: '',
      photoSrc: '',
    })

    const apiOption = {
      getListApi: getInsects,
      getInfoApi: getInsect,
      deleteApi: deleteInsect,
      addApi: addInsect,
    }
    const mixProps = useMix(apiOption, insectFormRef, insectFormData)

    const localeList = ref([])
    const rarityList = ref([])
    const unlockConditionList = ref([])
    const getOptions = () => {
      getOption('insectLocale', list => {
        localeList.value = list
      })
      getOption('rarity', list => {
        rarityList.value = list
      })
      getOption('insectUnlock', list => {
        unlockConditionList.value = list
      })
    }

    onMounted(getOptions)

    const { selectAll } = useSelectMonth(insectFormData)

    const beforePostProcess = () => usePeriodProcess(insectFormData)

    return {
      ...mixProps,
      insectFormRef,
      insectFormData,
      insectFormRules: {
        name: [
          { required: true, message: '请输入昆虫名称', trigger: 'blur' },
          {
            min: 2,
            max: 16,
            message: '长度在 2 到 16 个字符',
            trigger: 'blur',
          },
        ],
      },
      weatherList: [
        { text: '无限制', value: '' },
        { text: '雨雪天除外', value: '雨雪天除外' },
      ],
      localeList,
      rarityList,
      unlockConditionList,
      selectAll,
      beforePostProcess,
    }
  },
  methods: {
    dialogAddClose() {
      this.oldOptions.north = []
      this.oldOptions.south = []
    },
  },
})
</script>
<style scoped></style>
