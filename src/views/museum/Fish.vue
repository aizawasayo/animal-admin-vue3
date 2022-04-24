<template>
  <div class="app-container">
    <el-row class="search-box" type="flex" justify="space-between">
      <el-col :span="16">
        <el-row :gutter="24">
          <el-col :span="16">
            <search-bar v-model:query="listQuery.query" keyword="鱼类" />
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="openAddDialog"
              >添加鱼类</el-button
            >
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
      <el-table-column align="center" label="序号" width="50">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="照片" width="60">
        <template #default="scope">
          <img
            v-if="scope.row.photoSrc"
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
        </template>
      </el-table-column>
      <el-table-column label="时间段" align="center">
        <template #default="scope">
          {{ scope.row.period === '1点-24点' ? '全天' : scope.row.period }}
        </template>
      </el-table-column>
      <el-table-column
        label="鱼影"
        align="center"
        width="50"
        prop="shadow"
        sortable="custom"
        column-key="shadow"
        :filters="shadowList"
      >
        <template #default="scope">
          {{ scope.row.shadow }}
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
      title="添加鱼类"
      v-model="dialogVisible"
      width="60%"
      :close-on-click-modal="false"
      :before-close="closeDialog"
    >
      <el-form
        ref="fishFormRef"
        :inline="false"
        :model="fishFormData"
        :rules="fishFormRules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="名称" prop="name">
              <el-input v-model="fishFormData.name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="英文名" prop="engName">
              <el-input v-model="fishFormData.engName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="日文名" prop="jpnName">
              <el-input v-model="fishFormData.jpnName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="价格" prop="price">
              <el-input v-model.number="fishFormData.price" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="场所" prop="locale">
              <el-select
                v-model="fishFormData.locale"
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
            <el-form-item label="鱼影" prop="shadow">
              <el-select
                v-model="fishFormData.shadow"
                placeholder="请选择鱼影大小"
              >
                <el-option
                  v-for="item in shadowList"
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
                v-model="fishFormData.activeTime.north"
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
                v-model="fishFormData.activeTime.south"
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
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="开始时间" prop="periodStart">
              <el-time-select
                v-model="fishFormData.periodStart"
                :picker-options="periodOptions"
                placeholder="请选择开始时间"
              >
              </el-time-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="结束时间" prop="periodEnd">
              <el-time-select
                v-model="fishFormData.periodEnd"
                :picker-options="periodOptions"
                placeholder="请选择结束时间"
              >
              </el-time-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="解锁要求" prop="unlockCondition">
              <el-select
                v-model="fishFormData.unlockCondition"
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
                v-model="fishFormData.rarity"
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
            <el-form-item label="照片" prop="photoSrc">
              <upload-single
                v-model="fishFormData.photoSrc"
                dialog-width="30%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="简介" prop="introduction">
              <el-input v-model="fishFormData.introduction" type="textarea" />
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
import { getFishes, addFish, getFish, deleteFish } from '@api/fish'
import useMix from '@composables/useMix'
import useSelectMonth from '@composables/useSelectMonth'
import usePeriodProcess from '@composables/usePeriodProcess'

export default defineComponent({
  name: 'Fish',
  inject: ['realUrl', 'monthList', 'periodOptions'],
  setup() {
    const fishFormRef = ref(null)
    const fishFormData = reactive({
      name: '',
      price: null,
      engName: '',
      jpnName: '',
      activeTime: { north: [], south: [] },
      locale: [],
      period: '',
      periodStart: '',
      periodEnd: '',
      shadow: '',
      unlockCondition: '',
      rarity: '',
      introduction: '',
      photoSrc: '',
    })

    const apiOption = {
      getListApi: getFishes,
      getInfoApi: getFish,
      deleteApi: deleteFish,
      addApi: addFish,
    }
    const loadingRef = ref(null)
    const mixProps = useMix(
      apiOption,
      fishFormRef,
      fishFormData,
      null,
      loadingRef
    )

    const localeList = ref([])
    const shadowList = ref([])
    const rarityList = ref([])
    const unlockConditionList = ref([])

    const getOptions = () => {
      getOption('fishLocale', list => {
        localeList.value = list
      })
      getOption('shadow', list => {
        shadowList.value = list
      })
      getOption('rarity', list => {
        rarityList.value = list
      })
      getOption('fishUnlock', list => {
        unlockConditionList.value = list
      })
    }

    onMounted(getOptions)

    const { selectAll } = useSelectMonth(fishFormData)

    const beforePostProcess = () => usePeriodProcess(fishFormData)

    return {
      ...mixProps,
      fishFormRef,
      fishFormData,
      fishFormRules: {
        name: [
          { required: true, message: '请输入鱼类名称', trigger: 'blur' },
          {
            min: 1,
            max: 12,
            message: '长度在 1 到 12 个字符',
            trigger: 'blur',
          },
        ],
        price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
      },
      loadingRef,
      localeList,
      shadowList,
      unlockConditionList,
      rarityList,
      selectAll,
      beforePostProcess,
    }
  },
})
</script>
