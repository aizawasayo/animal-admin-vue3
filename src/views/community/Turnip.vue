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
            <el-button type="primary" @click="openAddTurnip">添加</el-button>
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
        ref="newTurnipRef"
        :inline="false"
        :model="newTurnip"
        :rules="newTurnipRules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="菜价" prop="price" required>
              <el-input
                v-model.number="newTurnip.price"
                placeholder="请输入大头菜报价"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="交易类型" prop="exchangeType" required>
              <el-radio-group v-model="newTurnip.exchangeType">
                <el-radio label="我有菜">我有菜</el-radio>
                <el-radio label="我有价">我有价</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="截止时间" prop="validTime">
              <el-time-picker
                v-model="newTurnip.validTime"
                :picker-options="{
                  selectableRange: '18:30:00 - 20:30:00',
                }"
              >
              </el-time-picker>
            </el-form-item>
          </el-col>
          <el-col v-show="isPrice" :span="8">
            <el-form-item label="排队模式" prop="isLineup">
              <el-switch v-model="newTurnip.isLineup"></el-switch>
            </el-form-item>
          </el-col>
          <el-col v-show="isLineBL" :span="8">
            <el-form-item label="是否公开" prop="isPublic">
              <el-switch v-model="newTurnip.isPublic"></el-switch>
            </el-form-item>
          </el-col>
          <el-col v-show="isLineBL" :span="8">
            <el-form-item label="自动叫号" prop="isAuto">
              <el-switch v-model="newTurnip.isAuto"></el-switch>
            </el-form-item>
          </el-col>
          <el-col v-show="isLineBL && isAutoBL" :span="8">
            <el-form-item
              label="最大登岛人数限制"
              prop="maxPeople"
              label-width="120"
            >
              <el-input-number
                v-model="newTurnip.maxPeople"
                :min="1"
                label="描述文字"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col v-show="isLineBL && isAutoBL" :span="8">
            <el-form-item label="登岛超时时间" prop="maxTime" label-width="120">
              <el-input-number
                v-model="newTurnip.maxTime"
                :min="1"
                label="描述文字"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item v-show="!isPsw" label="联系方式" prop="contact">
              <el-radio-group v-model="newTurnip.contact">
                <el-radio label="SW">SW</el-radio>
                <el-radio label="微信">微信</el-radio>
                <el-radio label="QQ">QQ</el-radio>
                <el-radio label="开岛密码">开岛密码</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-show="!isPsw" :span="8">
            <el-form-item :label="newTurnip.contact" prop="contactDetail">
              <el-input
                v-model="newTurnip.contactDetail"
                :placeholder="'请输人' + contact"
              />
            </el-form-item>
          </el-col>
          <el-col v-show="isPsw" :span="8">
            <el-form-item label="开岛密码" prop="psw">
              <el-input v-model="newTurnip.psw" placeholder="请输入开岛密码" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="上岛说明" prop="detail">
              <el-input
                v-model="newTurnip.detail"
                type="textarea"
                placeholder="门票、报酬等等，需要补充的内容都填这里"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="postTurnip">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getTurnipList, addTurnip, getTurnip, deleteTurnip } from '@api/turnip'
import { timestamp, parseTime } from '@utils'
import { nextTick } from 'vue'

export default {
  name: 'Turnip',
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
      exchangeList: [
        { value: '我有菜', text: '我有菜' },
        { value: '我有价', text: '我有价' },
      ],
      newTurnip: {
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
      },
      newTurnipRules: {
        price: [{ required: true, message: '请输入菜价', trigger: 'blur' }],
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
      this.newTurnip.isLineup === true &&
      this.newTurnip.exchangeType === '我有价'
        ? (bl = true)
        : (bl = false)
      return bl
    },
    contact() {
      let text = '直接输入12位好友编号(无需-分割)'
      this.newTurnip.contact !== 'SW'
        ? (text = '联系方式')
        : '直接输入12位好友编号(无需-分割)'
      return text
    },
    isAutoBL() {
      let bl = false
      this.newTurnip.isAuto === true ? (bl = true) : (bl = false)
      return bl
    },
    isPrice() {
      let bl = false
      this.newTurnip.exchangeType === '我有菜' ? (bl = false) : (bl = true)
      return bl
    },
    isPsw() {
      let bl = true
      this.newTurnip.exchangeType === '我有价' &&
      this.newTurnip.isLineup === true
        ? (bl = true)
        : (bl = false)
      return bl
    },
    nowTime() {
      return timestamp()
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
      this.commonApi.getList(param, getTurnipList, this)
    },
    openAddTurnip() {
      this.dialogVisible = true
      nextTick(() => {
        this.$refs['newTurnipRef'].resetFields()
        if (!this.newTurnip._id) {
          this.newTurnip.validTime = this.nowVaildTime()
          this.$forceUpdate()
        }
      })
    },
    nowVaildTime() {
      const time = new Date()
      const yy = time.getFullYear()
      const month = time.getMonth()
      const dd = time.getDate()
      const hh = time.getHours() + 2
      const mm = time.getMinutes()
      const val = new Date(yy, month, dd, hh, mm)
      return val
    },
    statusFilter(time) {
      const status = time > timestamp() ? 'success' : 'info'
      return status
    },
    postTurnip() {
      const timeString = parseTime(this.newTurnip.validTime)
      this.newTurnip.validTime = timestamp(timeString)
      this.newTurnip.user = this.$store.getters.userId
      if (this.newTurnip.exchangeType === '我有菜') {
        this.newTurnip.isLineup = false
        this.isPublic = false
        this.isAuto = false
      }
      this.commonApi.postForm('turnip', addTurnip, this)
    },
    handleEdit(id) {
      if (this.$refs['newTurnipRef']) {
        this.$refs['newTurnipRef'].resetFields()
      }
      getTurnip(id)
        .then(res => {
          this.dialogVisible = true
          nextTick(() => {
            this.newTurnip = res.data
            this.newTurnip.validTime = this.nowVaildTime()
          })
        })
        .catch(err => this.$message.error(err.message))
    },
    handleDelete(id) {
      this.commonApi.deleteById(id, deleteTurnip, this.fetchData)
    },
    handelMultipleDelete() {
      this.commonApi.multipleDelete(
        this.multipleSelection,
        deleteTurnip,
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
