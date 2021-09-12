<template>
  <div class="app-container">
    <el-row class="search-box" type="flex" justify="space-between">
      <el-col :span="16">
        <el-row :gutter="24">
          <el-col :span="16">
            <el-input
              v-model="queryInfo.query"
              placeholder="请输入岛民名字关键字"
              class="input-with-select"
              clearable
              @clear="fetchData"
              @keyup.enter.native="fetchData('refresh')"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="fetchData('refresh')"
              />
            </el-input>
          </el-col>
          <el-col :span="8">
            <el-button
              type="primary"
              @click="() => commonApi.openAddForm('islander', this)"
              >添加岛民</el-button
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
      />
      <el-table-column align="center" label="序号" width="55">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="照片">
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
        label="名字"
        align="center"
        prop="name"
        sortable="custom"
      >
        <template #default="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column
        label="性别"
        align="center"
        width="70"
        column-key="sex"
        :filters="sexList"
      >
        <template #default="scope">
          {{ scope.row.sex === 0 ? '♀' : '♂' }}
        </template>
      </el-table-column>
      <el-table-column
        label="生日"
        align="center"
        width="90"
        prop="birth"
        column-key="monthStr"
        :filters="monthList"
      >
        <template #default="scope">
          {{ scope.row.birth }}
        </template>
      </el-table-column>
      <el-table-column
        label="种族"
        align="center"
        prop="breed"
        column-key="breed"
        :filters="breedList"
      >
        <template #default="scope">
          {{ scope.row.breed }}
        </template>
      </el-table-column>
      <el-table-column label="英文名" width="90" align="center">
        <template #default="scope">
          <span>{{ scope.row.engName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日文名" width="100" align="center">
        <template #default="scope">
          {{ scope.row.jpnName }}
        </template>
      </el-table-column>
      <!-- <el-table-column width="100px" label="受欢迎级别">
        <template #default="scope">
          <svg-icon v-for="n in +scope.row.importance" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column> -->
      <el-table-column
        label="性格"
        width="80"
        align="center"
        prop="character"
        column-key="character"
        :filters="characterList"
      >
        <template #default="scope">
          {{ scope.row.character }}
        </template>
      </el-table-column>
      <el-table-column label="口头禅" align="center">
        <template #default="scope">
          {{ scope.row.petPhrase }}
        </template>
      </el-table-column>
      <el-table-column label="座右铭" width="160">
        <template #default="scope">
          {{ scope.row.motto }}
        </template>
      </el-table-column>
      <el-table-column
        label="amiibo"
        align="center"
        prop="amiibo"
        sortable="custom"
      >
        <template #default="scope">
          {{ scope.row.amiibo }}
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
    <!-- <el-pagination
      :current-page="queryInfo.page"
      :page-sizes="[5, 8, 10]"
      :page-size="queryInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination> -->
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="listQuery.page"
      v-model:limit="listQuery.pageSize"
    />
    <el-dialog
      title="添加岛民"
      v-model="dialogVisible"
      width="60%"
      :close-on-click-modal="false"
      :before-close="closeDialog"
    >
      <el-form
        ref="newIslanderRef"
        :inline="false"
        :model="newIslander"
        :rules="newIslanderRules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="名字" prop="name">
              <el-input v-model="newIslander.name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="newIslander.sex">
                <el-radio v-for="(item, i) in sexList" :label="item.value">{{
                  item.text
                }}</el-radio>
                <!-- <el-radio :label="0">♀</el-radio> -->
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="种族" prop="breed">
              <el-select v-model="newIslander.breed" placeholder="请选择种族">
                <el-option
                  v-for="(item, i) in breedList"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="生日" required>
              <el-col :span="10">
                <el-form-item prop="month">
                  <el-input
                    v-model.number="newIslander.month"
                    placeholder="请输入月份"
                    style="width: 100"
                    @input="changeVal($event)"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="2" class="birth-text">月</el-col>
              <el-col :span="10">
                <el-form-item prop="date">
                  <el-input
                    v-model.number="newIslander.date"
                    placeholder="输入日期"
                    style="width: 100"
                    @input="changeVal($event)"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="2" class="birth-text">日</el-col>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="英文名" prop="engName">
              <el-input v-model="newIslander.engName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="日文名" prop="jpnName">
              <el-input v-model="newIslander.jpnName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性格" prop="character">
              <el-select
                v-model="newIslander.character"
                placeholder="请选择性格"
              >
                <el-option
                  v-for="(item, i) in characterList"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性格亚型" prop="subtype">
              <el-select
                v-model="newIslander.subtype"
                placeholder="请选择性格亚型"
              >
                <el-option
                  v-for="(item, i) in subtypeList"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="爱好" prop="hobby">
              <el-select v-model="newIslander.hobby" placeholder="请选择爱好">
                <el-option
                  v-for="(item, i) in hobbyList"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="音高" prop="voice">
              <el-select v-model="newIslander.voice" placeholder="请选择音高">
                <el-option
                  v-for="(item, i) in voiceList"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="amiibo" prop="amiibo">
              <el-input v-model="newIslander.amiibo" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="口头禅" prop="petPhrase">
              <el-input v-model="newIslander.petPhrase" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="座右铭" prop="motto">
              <el-input v-model="newIslander.motto" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="目标" prop="ideal">
              <el-input v-model="newIslander.ideal" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="照片" prop="photoSrc">
              <upload-single v-model="newIslander.photoSrc" drag />
              <!-- <el-upload
                ref="upload"
                :action="uploadUrl"
                name="photoSrc"
                :multiple="false"
                :with-credentials="true"
                :show-file-list="true"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :on-error="handleError"
              >
                <el-button size="small" type="success" v-if="this.newIslander.photoSrc">已上传，可点击修改</el-button>
                <el-button size="small" type="primary" v-else><i class="el-icon-upload el-icon--left"></i>点击上传</el-button>
              </el-upload> -->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="postIslander">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getIslanders,
  addIslander,
  getIslander,
  deleteIslander,
} from '@api/islander'
import getOption from '@utils/get-option'
import { nextTick } from 'vue'

export default {
  name: 'Islander',
  data() {
    const checkMonth = (rule, value, callback) => {
      if (!value) {
        callback(new Error('月份不能为空'))
      } else if (!Number.isInteger(value)) {
        callback(new Error('请输入数字'))
      } else if (value < 1 || value > 12) {
        callback(new Error('请输入合理的月份'))
      } else {
        callback()
      }
    }
    const checkDate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('月份不能为空'))
      } else if (!Number.isInteger(value)) {
        callback(new Error('请输入数字'))
      } else if (value < 1 || value > 31) {
        callback(new Error('请输入合理的月份'))
      } else {
        callback()
      }
    }
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
      newIslander: {
        name: '',
        sex: null,
        breed: '',
        month: null,
        date: null,
        birth: '',
        monthStr: '',
        engName: '',
        jpnName: '',
        character: '',
        subtype: '',
        petPhrase: '',
        motto: '',
        ideal: '',
        amiibo: null,
        voice: '',
        hobby: '',
        photoSrc: '',
      },
      sexList: [
        { text: '♀', value: 0 },
        { text: '♂', value: 1 },
      ],
      characterList: [],
      subtypeList: [
        { text: 'A型', value: 'A型' },
        { text: 'B型', value: 'B型' },
      ],
      monthList: [
        { text: '一月', value: '1月' },
        { text: '二月', value: '2月' },
        { text: '三月', value: '3月' },
        { text: '四月', value: '4月' },
        { text: '五月', value: '5月' },
        { text: '六月', value: '6月' },
        { text: '七月', value: '7月' },
        { text: '八月', value: '8月' },
        { text: '九月', value: '9月' },
        { text: '十月', value: '10月' },
        { text: '十一月', value: '11月' },
        { text: '十二月', value: '12月' },
      ],
      breedList: [],
      voiceList: [],
      hobbyList: [],
      newIslanderRules: {
        name: [
          { required: true, message: '请输入岛民名字', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' },
        ],
        sex: [{ required: true, message: '请选择岛民性别', trigger: 'change' }],
        month: [{ validator: checkMonth, trigger: 'blur' }],
        date: [{ validator: checkDate, trigger: 'blur' }],
        breed: [
          { required: true, message: '请选择岛民种族', trigger: 'change' },
        ],
      },
      multipleSelection: [],
    }
  },
  created() {
    this.fetchData()
    this.getOptions()
  },
  methods: {
    fetchData(param) {
      this.commonApi.getList(param, getIslanders, this)
    },
    getOptions() {
      getOption('breed', list => {
        this.breedList = list
      })
      getOption('character', list => {
        this.characterList = list
      })
      getOption('voice', list => {
        this.voiceList = list
      })
      getOption('hobby', list => {
        this.hobbyList = list
      })
    },
    changeVal(e) {
      this.$forceUpdate()
    },
    postIslander() {
      this.newIslander.birth =
        this.newIslander.month + '月' + this.newIslander.date + '日'
      this.newIslander.monthStr = this.newIslander.month + '月'
      this.commonApi.postForm('islander', addIslander, this)
    },
    handleEdit(id) {
      if (this.$refs['newIslanderRef']) {
        this.$refs['newIslanderRef'].resetFields()
      }
      getIslander(id)
        .then(res => {
          this.dialogVisible = true

          nextTick(() => {
            // /*DOM已更新*/
            this.newIslander = res.data
            const birth = res.data.birth
            this.newIslander.month = parseInt(birth.split('月')[0])
            let date = birth.split('月')[1]
            date = parseInt(date.substring(0, date.length - 1))
            this.newIslander.date = date
          })
        })
        .catch(err => this.$message.error(err.message))
    },
    handleDelete(id) {
      this.commonApi.deleteById(id, deleteIslander, this.fetchData)
    },
    handelMultipleDelete() {
      this.commonApi.multipleDelete(
        this.multipleSelection,
        deleteIslander,
        this.fetchData
      )
    },
  },
}
</script>

<style scoped>
.birth-text {
  text-align: center;
}
</style>
