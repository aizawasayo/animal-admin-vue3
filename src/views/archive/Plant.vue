<template>
  <div class="app-container">
    <el-row class="search-box" type="flex" justify="space-between">
      <el-col :span="16">
        <el-row :gutter="24">
          <el-col :span="16">
            <search-bar v-model:query="listQuery.query" keyword="植物" />
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="openAddDialog"
              >添加植物</el-button
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
        width="100"
        column-key="price"
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
      <!-- <el-table-column label="日文名" align="center">
        <template #default="scope">
          {{ scope.row.jpnName }}
        </template>
      </el-table-column> -->
      <el-table-column
        label="种类"
        align="center"
        column-key="type"
        :filters="typeList"
      >
        <template #default="scope">
          {{ scope.row.type.join('/') }}
        </template>
      </el-table-column>
      <el-table-column
        label="来源"
        align="center"
        column-key="channel"
        :filters="channelList"
      >
        <template #default="scope">
          {{ scope.row.channel }}
        </template>
      </el-table-column>
      <el-table-column label="成长阶段" align="center">
        <template #default="scope">
          <span
            v-if="
              !(
                scope.row.type.includes('种子') ||
                scope.row.type.includes('树苗')
              )
            "
          >
            <span>{{ scope.row.growStage.join('-') }}</span>
          </span>
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
      title="添加植物"
      v-model="dialogVisible"
      width="60%"
      :close-on-click-modal="false"
      :before-close="closeDialog"
    >
      <el-form
        ref="plantFormRef"
        :inline="false"
        :model="plantFormData"
        :rules="plantFormRules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="名称" prop="name">
              <el-input v-model="plantFormData.name" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="英文名" prop="engName">
              <el-input v-model="plantFormData.engName" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="日文名" prop="jpnName">
              <el-input v-model="plantFormData.jpnName" />
            </el-form-item>
          </el-col> -->
          <el-col :span="5">
            <el-form-item label="价格" prop="price">
              <el-input v-model.number="plantFormData.price" />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="种类" prop="type">
              <el-select
                v-model="plantFormData.type"
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
        </el-row>
        <el-row v-show="notSeed">
          <el-col :span="8">
            <el-form-item label="来源" prop="channel">
              <el-radio-group v-model="plantFormData.channel">
                <el-radio label="种子">种子</el-radio>
                <el-radio label="花卉杂交">花卉杂交</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="plantFormData.channel == '种子'" :span="16">
            <el-form-item label="种子名称" prop="seed">
              <el-select
                v-model="plantFormData.seed"
                :remote-method="query => getPlantList(query, 'seed')"
                filterable
                default-first-option
                remote
                value-key="name"
                placeholder="查询种子"
              >
                <el-option
                  v-for="item in seedList"
                  :label="item.name"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <div v-if="plantFormData.channel == '花卉杂交'"> -->
          <el-col
            v-show="plantFormData.channel == '花卉杂交'"
            v-for="(item, i) in plantFormData.mixPlant"
            :span="8"
          >
            <el-form-item :label="'花卉' + (i + 1)" prop="" label-width="80px">
              <el-select
                v-model="plantFormData.mixPlant[i]"
                :remote-method="query => getPlantList(query, 'mix')"
                filterable
                default-first-option
                remote
                value-key="name"
                placeholder="查询花卉"
              >
                <el-option
                  v-for="item1 in mixList"
                  :label="item1.name"
                  :value="item1"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- </div> -->
          <el-col :span="2">
            <el-form-item label="成长阶段" label-width="80px"> </el-form-item>
          </el-col>
          <el-col v-for="(item, i) in plantFormData.growStage" :span="7">
            <el-form-item :label="'阶段' + (i + 1)" prop="" label-width="80px">
              <el-select v-model="plantFormData.growStage[i]">
                <el-option
                  v-for="item1 in growList[i]"
                  :label="item1"
                  :value="item1"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="照片" prop="photoSrc">
              <upload-single
                v-model="plantFormData.photoSrc"
                dialog-width="30%"
                drag
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handlePost">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getPlants,
  addPlant,
  getPlant,
  deletePlant,
  searchPlant,
} from '@api/plant'
import { searchMaterial } from '@api/material'
import useMix from '@composables/useMix'

export default defineComponent({
  name: 'Plant',
  inject: ['apiUrl'],
  setup() {
    const plantFormRef = ref(null)
    const plantFormData = reactive({
      name: '',
      engName: '',
      jpnName: '',
      price: null,
      type: [],
      channel: '',
      seed: null,
      mixPlant: [
        {
          name: '',
          _id: '',
          photoSrc: '',
        },
        {
          name: '',
          _id: '',
          photoSrc: '',
        },
      ],
      growStage: ['', '', '', '', ''],
      photoSrc: '',
    })

    const apiOption = {
      getListApi: getPlants,
      getInfoApi: getPlant,
      deleteApi: deletePlant,
      addApi: addPlant,
    }
    const loadingRef = ref(null)
    const mixProps = useMix(
      apiOption,
      plantFormRef,
      plantFormData,
      null,
      loadingRef
    )

    const seedList = ref([])
    const mixList = ref([])

    const getPlantList = (query, type) => {
      if (!query.trim()) return
      if (type === 'mix') {
        searchMaterial(query)
          .then(response => {
            if (response.data.length === 0) return
            const listname = type + 'List'
            this[listname] = response.data.map(v => {
              return { name: v.name, _id: v._id, photoSrc: v.photoSrc }
            })
          })
          .catch(err => ElMessage.error(err.message))
      } else {
        searchPlant(query)
          .then(response => {
            if (response.data.length === 0) return
            const listname = type + 'List'
            this[listname] = response.data.map(v => {
              return { name: v.name, _id: v._id, photoSrc: v.photoSrc }
            })
          })
          .catch(err => ElMessage.error(err.message))
      }
    }

    const openEditCallback = () => {
      if (plantFormData.channel === '种子') {
        seedList.value[0] = plantFormData.seed
      } else if (plantFormData.channel === '花卉杂交') {
        mixList.value = plantFormData.mixPlant
      }
    }
    const beforePostProcess = formData => {
      formData.growStage = formData.growStage.filter(m => m.name !== '')
    }

    return {
      ...mixProps,
      plantFormRef,
      plantFormData,
      plantFormRules: {
        name: [
          { required: true, message: '请输入植物名字', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' },
        ],
      },
      loadingRef,
      seedList,
      mixList,
      growList: [
        ['', '幼苗', '种子', '球根', '杂交', '花苗', '树苗', '竹笋苗'],
        ['', 'S', '花芽', '幼苗'],
        ['', 'M', '花茎', '小树'],
        ['', 'L', '花蕾', '树'],
        ['', '树', '花株', '竹子'],
      ],
      typeList: [
        { text: '种子', value: '种子' },
        { text: '水果', value: '水果' },
        { text: '树苗', value: '树苗' },
        { text: '树', value: '树' },
        { text: '花', value: '花' },
        { text: '蘑菇', value: '蘑菇' },
        { text: '灌木', value: '灌木' },
        { text: '其他', value: '其他' },
      ],
      channelList: [
        { text: '种子', value: '种子' },
        { text: '花卉杂交', value: '花卉杂交' },
      ],
      notSeed: computed(() => {
        const isSeed =
          plantFormData.type.includes('种子') ||
          plantFormData.type.includes('树苗')
        return !isSeed
      }),
      getPlantList,
      openEditCallback,
      beforePostProcess,
    }
  },
  methods: {
    dialogAddClose() {
      delete plantFormData._id
      delete plantFormData.__v
      seedList.value = []
      mixList.value = []
      plantFormData.growStage = ['', '', '', '', '']
    },
  },
})
</script>

<style scoped></style>
