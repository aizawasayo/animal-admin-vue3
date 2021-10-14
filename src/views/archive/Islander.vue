<template>
  <div class="app-container">
    <el-row class="search-box" type="flex" justify="space-between">
      <el-col :span="16">
        <el-row :gutter="24">
          <el-col :span="16">
            <search-bar v-model:query="listQuery.query" keyword="岛民" />
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="openAddDialog"
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
      @selection-change="selection => selectionChange(selection)"
      @filter-change="filters => filterChange(filters)"
      @sort-change="sortInfo => sortChange(sortInfo)"
    >
      <el-table-column type="selection" width="36" />
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
      title="添加岛民"
      v-model="dialogVisible"
      width="60%"
      :close-on-click-modal="false"
      :before-close="closeDialog"
    >
      <el-form
        ref="islanderFormRef"
        :inline="false"
        :model="islanderFormData"
        :rules="islanderFormRules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="名字" prop="name">
              <el-input v-model="islanderFormData.name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="islanderFormData.sex">
                <el-radio v-for="(item, i) in sexList" :label="item.value">{{
                  item.text
                }}</el-radio>
                <!-- <el-radio :label="0">♀</el-radio> -->
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="种族" prop="breed">
              <el-select
                v-model="islanderFormData.breed"
                placeholder="请选择种族"
              >
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
                    v-model.number="islanderFormData.month"
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
                    v-model.number="islanderFormData.date"
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
              <el-input v-model="islanderFormData.engName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="日文名" prop="jpnName">
              <el-input v-model="islanderFormData.jpnName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性格" prop="character">
              <el-select
                v-model="islanderFormData.character"
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
                v-model="islanderFormData.subtype"
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
              <el-select
                v-model="islanderFormData.hobby"
                placeholder="请选择爱好"
              >
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
              <el-select
                v-model="islanderFormData.voice"
                placeholder="请选择音高"
              >
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
              <el-input v-model="islanderFormData.amiibo" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="口头禅" prop="petPhrase">
              <el-input v-model="islanderFormData.petPhrase" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="座右铭" prop="motto">
              <el-input v-model="islanderFormData.motto" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="目标" prop="ideal">
              <el-input v-model="islanderFormData.ideal" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="照片" prop="photoSrc">
              <upload-single v-model="islanderFormData.photoSrc" drag />
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
                <el-button size="small" type="success" v-if="islanderFormData.photoSrc">已上传，可点击修改</el-button>
                <el-button size="small" type="primary" v-else><i class="el-icon-upload el-icon--left"></i>点击上传</el-button>
              </el-upload> -->
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
import { defineComponent, nextTick, reactive, ref, onMounted, watch } from 'vue'
import {
  getIslanders,
  addIslander,
  getIslander,
  deleteIslander,
} from '@api/islander'
import getOption from '@utils/get-option'
import useMix from '@composables/useMix'

export default defineComponent({
  name: 'Islander',
  inject: ['apiUrl', 'monthList'],
  setup() {
    const islanderFormRef = ref(null)
    const islanderFormData = reactive({
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
    })

    const apiOption = {
      getListApi: getIslanders,
      getInfoApi: getIslander,
      deleteApi: deleteIslander,
      addApi: addIslander,
    }

    const mixProps = useMix(apiOption, islanderFormRef, islanderFormData)

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
    const characterList = ref([])
    const breedList = ref([])
    const voiceList = ref([])
    const hobbyList = ref([])
    const getOptions = () => {
      getOption('breed', list => {
        breedList.value = list
      })
      getOption('character', list => {
        characterList.value = list
      })
      getOption('voice', list => {
        voiceList.value = list
      })
      getOption('hobby', list => {
        hobbyList.value = list
      })
    }

    onMounted(getOptions)

    const openEditCallback = () => {
      const birth = islanderFormData.birth
      islanderFormData.month = parseInt(birth.split('月')[0])
      let date = birth.split('月')[1]
      date = parseInt(date.substring(0, date.length - 1))
      islanderFormData.date = date
    }

    const beforePostProcess = formData => {
      formData.birth = formData.month + '月' + formData.date + '日'
      formData.monthStr = formData.month + '月'
    }

    return {
      islanderFormRef,
      islanderFormData,
      ...mixProps,
      sexList: [
        { text: '♀', value: 0 },
        { text: '♂', value: 1 },
      ],
      subtypeList: [
        { text: 'A型', value: 'A型' },
        { text: 'B型', value: 'B型' },
      ],
      characterList,
      breedList,
      voiceList,
      hobbyList,
      islanderFormRules: {
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
      changeVal: e => $forceUpdate(),
      openEditCallback,
      beforePostProcess,
    }
  },
})
</script>

<style scoped>
.birth-text {
  text-align: center;
}
</style>
