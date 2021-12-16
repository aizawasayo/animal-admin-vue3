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
      <el-table-column label="交易方式" align="center" prop="exchangeType">
        <template #default="scope">
          {{ scope.row.exchangeType }}
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
        ref="tradeFormRef"
        :inline="false"
        :model="tradeFormData"
        :rules="tradeFormRules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="交易类型" prop="exchangeType" required>
              <el-cascader
                v-model="tradeFormData.exchangeType"
                :options="exchangeOption"
                separator="-"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="截止时间" prop="validTime">
              <el-time-picker
                v-model="tradeFormData.validTime"
                :disabled-hours="disabledHours"
                :disabled-minutes="disabledMinutes"
                :disabled-seconds="disabledSeconds"
                style="width: 100%"
              >
              </el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="排队模式" prop="isLineup">
              <el-switch v-model="tradeFormData.isLineup"></el-switch>
            </el-form-item>
          </el-col>
          <el-col v-show="isLineBL" :span="8">
            <el-form-item label="是否公开" prop="isPublic">
              <el-switch v-model="tradeFormData.isPublic"></el-switch>
            </el-form-item>
          </el-col>
          <el-col v-show="isLineBL" :span="8">
            <el-form-item label="自动叫号" prop="isAuto">
              <el-switch v-model="tradeFormData.isAuto"></el-switch>
            </el-form-item>
          </el-col>
          <el-col v-show="isLineBL && isAutoBL" :span="8">
            <el-form-item
              label="最大登岛人数限制"
              prop="maxPeople"
              label-width="120"
              style="width: 100%"
            >
              <el-input-number
                v-model="tradeFormData.maxPeople"
                :min="1"
                label="描述文字"
                style="width: 100%"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col v-show="isLineBL && isAutoBL" :span="8">
            <el-form-item label="登岛超时时间" prop="maxTime" label-width="120">
              <el-input-number
                v-model="tradeFormData.maxTime"
                :min="1"
                label="描述文字"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col v-show="!isLineBL" :span="16">
            <el-form-item label="联系方式" prop="contact">
              <el-radio-group v-model="tradeFormData.contact">
                <el-radio label="SW">SW</el-radio>
                <el-radio label="微信">微信</el-radio>
                <el-radio label="QQ">QQ</el-radio>
                <el-radio label="开岛密码">开岛密码</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-show="!isLineBL" :span="8">
            <el-form-item :label="tradeFormData.contact" prop="contactDetail">
              <el-input
                v-model="tradeFormData.contactDetail"
                :placeholder="'请输人' + contact"
              />
            </el-form-item>
          </el-col>
          <el-col v-show="isLineBL" :span="8">
            <el-form-item label="开岛密码" prop="psw">
              <el-input
                v-model="tradeFormData.psw"
                placeholder="请输入开岛密码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="上岛说明" prop="detail">
              <el-input
                v-model="tradeFormData.detail"
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
            @click="handlePost(false, beforePostProcess)"
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
import { getTradeList, addTrade, getTrade, deleteTrade } from '@api/trade'
import { timestamp, parseTime, standardTime } from '@utils'
import useMix from '@composables/useMix'
import useDisabledTime from './composables/useDisabledTime'

export default defineComponent({
  name: 'Trade',
  setup() {
    const store = useStore()

    const tradeFormRef = ref(null)
    const tradeFormData = reactive({
      user: '',
      exchangeType: '',
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
      getListApi: getTradeList,
      getInfoApi: getTrade,
      deleteApi: deleteTrade,
      addApi: addTrade,
    }
    const loadingRef = ref(null)
    const mixProps = useMix(
      apiOption,
      tradeFormRef,
      tradeFormData,
      null,
      loadingRef
    )

    const userId = computed(() => store.getters.userId)
    const roles = computed(() => store.getters.roles)

    const isLineBL = computed(() => (tradeFormData.isLineup ? true : false))
    const isAutoBL = computed(() => (tradeFormData.isAuto ? true : false))
    const contact = computed(() =>
      tradeFormData.contact !== 'SW'
        ? '联系方式'
        : '直接输入12位好友编号(无需-分割)'
    )

    const nowTime = computed(() => timestamp())

    const { nowVaildTime } = useDisabledTime()

    const statusFilter = time => (time > timestamp() ? 'success' : 'info')

    onMounted(() => {
      if (roles.value.length === 1 && roles.value.includes('normal')) {
        mixProps.listQuery.user = userId.value
      }
    })

    const openAddCallback = () => {
      if (!tradeFormData._id) {
        tradeFormData.validTime = nowVaildTime().val
      }
    }
    const openEditCallback = () => {
      tradeFormData.exchangeType = tradeFormData.exchangeType.split('-')
      if (tradeFormData.validTime > nowTime.value) {
        tradeFormData.validTime = standardTime(tradeFormData.validTime)
      } else {
        tradeFormData.validTime = nowVaildTime().val
      }
    }
    const beforePostProcess = formData => {
      const timeString = parseTime(formData.validTime)
      formData.validTime = timestamp(timeString)
      formData.user = userId.value
      if (formData.isLineup === false) {
        formData.isPublic = false
        formData.isAuto = false
      }
      formData.exchangeType = formData.exchangeType.join('-')
    }

    return {
      ...mixProps,
      ...useDisabledTime(),
      tradeFormRef,
      tradeFormData,
      tradeFormRules: {
        exchangeType: [
          { required: true, message: '请选择交易类型', trigger: 'change' },
        ],
      },
      loadingRef,
      exchangeOption: [
        {
          value: '交易',
          label: '交易',
          children: [
            { value: '家具相关', label: '家具相关' },
            { value: '服饰相关', label: '服饰相关' },
            { value: '材料相关', label: '材料相关' },
            { value: 'DIY手册相关', label: 'DIY手册相关' },
            { value: '活动相关', label: '活动相关' },
            { value: '花卉相关', label: '花卉相关' },
            { value: '其他', label: '其他' },
          ],
        },
        {
          value: '特殊NPC',
          label: '特殊NPC',
          children: [
            { value: '傅珂(妹妹)', label: '傅珂(妹妹)' },
            { value: '骆岚(壁纸地板)', label: '骆岚(壁纸地板)' },
            { value: '薛革(鞋袜包包)', label: '薛革(鞋袜包包)' },
            { value: '绢儿(服装)', label: '绢儿(服装)' },
            { value: '狐利(艺术品)', label: '狐利(艺术品)' },
            { value: '然然(园艺)', label: '然然(园艺)' },
            { value: '其他', label: '其他' },
          ],
        },
      ],
      isLineBL,
      isAutoBL,
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
