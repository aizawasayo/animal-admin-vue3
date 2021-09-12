<template>
  <div class="app-container">
    <el-row class="search-box" type="flex" justify="space-between">
      <el-col :span="16">
        <el-row :gutter="24">
          <el-col :span="16">
            <el-input
              v-model="queryInfo.query"
              placeholder="请输入关键字"
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
            <el-button type="primary" @click="openAddTrade">添加</el-button>
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
        <template slot-scope="{ row }">
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
      title="发布信息"
      v-model="dialogVisible"
      width="60%"
      :close-on-click-modal="false"
      :before-close="closeDialog"
    >
      <el-form
        ref="newTradeRef"
        :inline="false"
        :model="newTrade"
        :rules="newTradeRules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="交易类型" prop="exchangeType" required>
              <el-cascader
                v-model="newTrade.exchangeType"
                :options="exchangeOption"
                separator="-"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="截止时间" prop="validTime">
              <el-time-picker
                v-model="newTrade.validTime"
                :picker-options="{
                  selectableRange: '18:30:00 - 20:30:00',
                }"
              >
              </el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="排队模式" prop="isLineup">
              <el-switch v-model="newTrade.isLineup"></el-switch>
            </el-form-item>
          </el-col>
          <el-col v-show="isLineBL" :span="8">
            <el-form-item label="是否公开" prop="isPublic">
              <el-switch v-model="newTrade.isPublic"></el-switch>
            </el-form-item>
          </el-col>
          <el-col v-show="isLineBL" :span="8">
            <el-form-item label="自动叫号" prop="isAuto">
              <el-switch v-model="newTrade.isAuto"></el-switch>
            </el-form-item>
          </el-col>
          <el-col v-show="isLineBL && isAutoBL" :span="8">
            <el-form-item
              label="最大登岛人数限制"
              prop="maxPeople"
              label-width="120"
            >
              <el-input-number
                v-model="newTrade.maxPeople"
                :min="1"
                label="描述文字"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col v-show="isLineBL && isAutoBL" :span="8">
            <el-form-item label="登岛超时时间" prop="maxTime" label-width="120">
              <el-input-number
                v-model="newTrade.maxTime"
                :min="1"
                label="描述文字"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item v-show="!isLineBL" label="联系方式" prop="contact">
              <el-radio-group v-model="newTrade.contact">
                <el-radio label="SW">SW</el-radio>
                <el-radio label="微信">微信</el-radio>
                <el-radio label="QQ">QQ</el-radio>
                <el-radio label="开岛密码">开岛密码</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-show="!isLineBL" :span="8">
            <el-form-item :label="newTrade.contact" prop="contactDetail">
              <el-input
                v-model="newTrade.contactDetail"
                :placeholder="'请输人' + contact"
              />
            </el-form-item>
          </el-col>
          <el-col v-show="isLineBL" :span="8">
            <el-form-item label="开岛密码" prop="psw">
              <el-input v-model="newTrade.psw" placeholder="请输入开岛密码" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="上岛说明" prop="detail">
              <el-input
                v-model="newTrade.detail"
                type="textarea"
                placeholder="门票、报酬等等，需要补充的内容都填这里"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="postTrade">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getTradeList, addTrade, getTrade, deleteTrade } from '@api/trade'
import { timestamp, parseTime, standardTime } from '@utils'
import { nextTick } from 'vue'

export default {
  name: 'Trade',
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
      newTrade: {
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
      },
      newTradeRules: {
        exchangeType: [
          { required: true, message: '请选择交易类型', trigger: 'change' },
        ],
      },
      multipleSelection: [],
    }
  },
  computed: {
    ...mapGetters(['userId', 'roles']),
    isLineBL() {
      let bl = false
      this.newTrade.isLineup === true ? (bl = true) : (bl = false)
      return bl
    },
    isAutoBL() {
      let bl = false
      this.newTrade.isAuto === true ? (bl = true) : (bl = false)
      return bl
    },
    contact() {
      let text = '直接输入12位好友编号(无需-分割)'
      this.newTrade.contact !== 'SW'
        ? (text = '联系方式')
        : '直接输入12位好友编号(无需-分割)'
      return text
    },
    nowTime() {
      return timestamp()
    },
    statusFilter(time) {
      return time > timestamp() ? 'success' : 'info'
    },
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData(param) {
      if (this.roles.length === 1 && this.roles.includes('normal')) {
        this.queryInfo.user = this.userId
      }
      this.commonApi.getList(param, getTradeList, this)
    },
    openAddTrade() {
      this.dialogVisible = true
      nextTick(() => {
        this.$refs['newTradeRef'].resetFields()
        if (!this.newTrade._id) {
          const time = new Date()
          const yy = time.getFullYear()
          const month = time.getMonth()
          const dd = time.getDate()
          const hh = time.getHours() + 2
          const mm = time.getMinutes()
          const val = new Date(yy, month, dd, hh, mm)
          this.newTrade.validTime = val
          this.$forceUpdate()
        }
      })
    },
    postTrade() {
      const timeString = parseTime(this.newTrade.validTime)
      this.newTrade.validTime = timestamp(timeString)
      this.newTrade.user = this.$store.getters.userId
      if (this.newTrade.isLineup === false) {
        this.newTrade.isPublic = false
        this.newTrade.isAuto = false
      }
      this.newTrade.exchangeType = this.newTrade.exchangeType.join('-')
      this.commonApi.postForm('trade', addTrade, this)
    },
    handleEdit(id) {
      if (this.$refs['newTradeRef']) {
        this.$refs['newTradeRef'].resetFields()
      }
      getTrade(id)
        .then(res => {
          this.dialogVisible = true
          nextTick(() => {
            this.newTrade = res.data
            this.newTrade.exchangeType = this.newTrade.exchangeType.split('-')
            this.newTrade.validTime = standardTime(this.newTrade.validTime)
          })
        })
        .catch(err => this.$message.error(err.message))
    },
    handleDelete(id) {
      this.commonApi.deleteById(id, deleteTrade, this.fetchData)
    },
    handelMultipleDelete() {
      this.commonApi.multipleDelete(
        this.multipleSelection,
        deleteTrade,
        this.fetchData
      )
    },
  },
}
</script>

<style scoped>
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
.el-input-number--medium {
  width: 50%;
}
</style>
