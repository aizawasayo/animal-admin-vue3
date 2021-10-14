<template>
  <div class="app-container">
    <el-row class="search-box" type="flex" justify="space-between">
      <el-col :span="16">
        <el-row :gutter="24">
          <el-col :span="16">
            <search-bar v-model:query="listQuery.query" />
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="openAddDialog(openAddCallback)"
              >添加</el-button
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
        label="交易方式"
        align="center"
        prop="exchangeType"
        column-key="exchangeType"
        :filters="exchangeList"
      >
        <template #default="scope">
          {{ scope.row.exchangeType }}
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
      <el-table-column label="详情" align="center">
        <template #default="scope">
          {{ $filters.textFilter(scope.row.detail, 10) }}
        </template>
      </el-table-column>
      <el-table-column label="联系方式" align="center">
        <template #default="scope">
          {{
            scope.row.contactDetail
              ? scope.row.contact + ':' + scope.row.contactDetail
              : ''
          }}
        </template>
      </el-table-column>
      <el-table-column label="有效时间" align="center">
        <template #default="scope">
          {{ $filters.parseTime(scope.row.validTime, '{y}-{m}-{d} {h}:{i}') }}
        </template>
      </el-table-column>
      <el-table-column label="登岛人数限制" align="center" prop="maxPeople">
        <template #default="scope">
          {{ scope.row.isLineup ? scope.row.maxPeople : '' }}
        </template>
      </el-table-column>
      <el-table-column label="登岛时间限制" align="center" prop="maxTime">
        <template #default="scope">
          {{ scope.row.isLineup ? scope.row.maxTime : '' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="发布状态" width="110">
        <template #default="{ row }">
          <el-tag :type="statusFilter(row.validTime)">
            {{ row.validTime > nowTime ? '有效' : '失效' }}
          </el-tag>
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
            @click="handleEdit(scope.row._id, openEditCallback)"
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
      title="发布信息"
      v-model="dialogVisible"
      width="60%"
      :close-on-click-modal="false"
      :before-close="closeDialog"
    >
      <el-form
        ref="turnipFormRef"
        :inline="false"
        :model="turnipFormData"
        :rules="turnipFormRules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="菜价" prop="price" required>
              <el-input
                v-model.number="turnipFormData.price"
                placeholder="请输入大头菜报价"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="交易类型" prop="exchangeType" required>
              <el-radio-group v-model="turnipFormData.exchangeType">
                <el-radio label="我有菜">我有菜</el-radio>
                <el-radio label="我有价">我有价</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="截止时间" prop="validTime">
              <el-time-picker
                v-model="turnipFormData.validTime"
                :disabled-hours="disabledHours"
                :disabled-minutes="disabledMinutes"
                :disabled-seconds="disabledSeconds"
                style="width: 100%"
              >
              </el-time-picker>
            </el-form-item>
          </el-col>
          <el-col v-show="isPrice" :span="8">
            <el-form-item label="排队模式" prop="isLineup">
              <el-switch v-model="turnipFormData.isLineup"></el-switch>
            </el-form-item>
          </el-col>
          <el-col v-show="isLineBL" :span="8">
            <el-form-item label="是否公开" prop="isPublic">
              <el-switch v-model="turnipFormData.isPublic"></el-switch>
            </el-form-item>
          </el-col>
          <el-col v-show="isLineBL" :span="8">
            <el-form-item label="自动叫号" prop="isAuto">
              <el-switch v-model="turnipFormData.isAuto"></el-switch>
            </el-form-item>
          </el-col>
          <el-col v-show="isLineBL && isAutoBL" :span="8">
            <el-form-item
              label="最大登岛人数"
              prop="maxPeople"
              label-width="100"
            >
              <el-input-number
                v-model="turnipFormData.maxPeople"
                :min="1"
                label="描述文字"
                style="width: 100%"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col v-show="isLineBL && isAutoBL" :span="8">
            <el-form-item label="登岛超时时间" prop="maxTime" label-width="120">
              <el-input-number
                v-model="turnipFormData.maxTime"
                :min="1"
                label="描述文字"
                style="width: 100%"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item v-show="!isLineBL" label="联系方式" prop="contact">
              <el-radio-group v-model="turnipFormData.contact">
                <el-radio label="SW">SW</el-radio>
                <el-radio label="微信">微信</el-radio>
                <el-radio label="QQ">QQ</el-radio>
                <el-radio label="开岛密码">开岛密码</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-show="!isLineBL" :span="8">
            <el-form-item :label="turnipFormData.contact" prop="contactDetail">
              <el-input
                v-model="turnipFormData.contactDetail"
                :placeholder="'请输人' + contact"
              />
            </el-form-item>
          </el-col>
          <el-col v-show="isLineBL" :span="8">
            <el-form-item label="开岛密码" prop="psw">
              <el-input
                v-model="turnipFormData.psw"
                placeholder="请输入开岛密码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="上岛说明" prop="detail">
              <el-input
                v-model="turnipFormData.detail"
                type="textarea"
                placeholder="门票、报酬等等，需要补充的内容都填这里"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="() => handlePost(false, beforePostProcess)"
            >确 定</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { getTurnipList, addTurnip, getTurnip, deleteTurnip } from '@api/turnip'
import { timestamp, parseTime } from '@utils'
import useMix from '@composables/useMix'
import useDisabledTime from './composables/useDisabledTime'

export default defineComponent({
  name: 'Turnip',
  setup() {
    const store = useStore()

    const turnipFormRef = ref(null)
    const turnipFormData = reactive({
      price: null,
      user: '',
      exchangeType: '我有价',
      validTime: null,
      isLineup: true,
      isPublic: true,
      isAuto: true,
      maxPeople: 2,
      maxTime: 10,
      contact: 'SW',
      contactDetail: '',
      detail: '',
      psw: '',
    })

    const apiOption = {
      getListApi: getTurnipList,
      getInfoApi: getTurnip,
      deleteApi: deleteTurnip,
      addApi: addTurnip,
    }
    const mixProps = useMix(apiOption, turnipFormRef, turnipFormData)

    const userId = computed(() => store.getters.userId)
    const roles = computed(() => store.getters.roles)

    const isLineBL = computed(() =>
      turnipFormData.isLineup === true &&
      turnipFormData.exchangeType === '我有价'
        ? true
        : false
    )
    const isAutoBL = computed(() => (turnipFormData.isAuto ? true : false))
    const isPrice = computed(() =>
      turnipFormData.exchangeType === '我有菜' ? false : true
    )
    const contact = computed(() =>
      turnipFormData.contact !== 'SW'
        ? '联系方式'
        : '直接输入12位好友编号(无需-分割)'
    )

    const nowTime = computed(() => timestamp())

    const statusFilter = time => (time > nowTime.value ? 'success' : 'info')

    onMounted(() => {
      if (roles.value.length === 1 && roles.value.includes('normal')) {
        mixProps.listQuery.user = userId
      }
    })

    const { nowVaildTime } = useDisabledTime()

    const openAddCallback = () => {
      if (!turnipFormData._id) {
        turnipFormData.validTime = nowVaildTime().val
      }
    }

    const openEditCallback = () => {
      if (turnipFormData.validTime > nowTime.value) {
        turnipFormData.validTime = standardTime(turnipFormData.validTime)
      } else {
        turnipFormData.validTime = nowVaildTime().val
      }
    }

    const beforePostProcess = formData => {
      const timeString = parseTime(formData.validTime)
      formData.validTime = timestamp(timeString)
      formData.user = userId.value
      if (formData.exchangeType === '我有菜') {
        formData.isLineup = false
        formData.isPublic = false
        formData.isAuto = false
      }
    }

    return {
      ...mixProps,
      ...useDisabledTime(),
      turnipFormRef,
      turnipFormData,
      turnipFormRules: {
        price: [{ required: true, message: '请输入菜价', trigger: 'blur' }],
        exchangeType: [
          { required: true, message: '请选择交易类型', trigger: 'change' },
        ],
      },
      exchangeList: [
        { value: '我有菜', text: '我有菜' },
        { value: '我有价', text: '我有价' },
      ],
      isLineBL,
      isAutoBL,
      isPrice,
      contact,
      nowTime,
      statusFilter,
      openAddCallback,
      openEditCallback,
      beforePostProcess,
    }
  },
})
</script>

<style scoped></style>
