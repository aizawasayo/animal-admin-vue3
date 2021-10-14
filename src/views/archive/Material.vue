<template>
  <div class="app-container">
    <el-row class="search-box" type="flex" justify="space-between">
      <el-col :span="16">
        <el-row :gutter="24">
          <el-col :span="16">
            <search-bar v-model:query="listQuery.query" keyword="素材" />
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="openAddDialog"
              >添加素材</el-button
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
        width="80"
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
      <el-table-column label="日文名" align="center" column-key="price">
        <template #default="scope">
          {{ scope.row.jpnName }}
        </template>
      </el-table-column>
      <el-table-column
        label="堆叠数量"
        width="80"
        align="center"
        column-key="maxNum"
      >
        <template #default="scope">
          {{ scope.row.maxNum }}
        </template>
      </el-table-column>
      <el-table-column
        label="来源"
        align="center"
        prop="channels"
        sortable="custom"
      >
        <template #default="scope">
          <span v-if="scope.row.season && scope.row.season.length !== 0">{{
            scope.row.season.join('/')
          }}</span>
          <span v-if="scope.row.activity">{{ scope.row.activity }}期间</span>
          <span>{{ scope.row.channels.join('/') }}</span>
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
      title="添加素材"
      v-model="dialogVisible"
      width="60%"
      :close-on-click-modal="false"
      :before-close="closeDialog"
    >
      <el-form
        ref="materialFormRef"
        :inline="false"
        :model="materialFormData"
        :rules="materialFormRules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="名称" prop="name">
              <el-input v-model="materialFormData.name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="英文名" prop="engName">
              <el-input v-model="materialFormData.engName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="日文名" prop="jpnName">
              <el-input v-model="materialFormData.jpnName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="价格" prop="price">
              <el-input v-model.number="materialFormData.price" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属活动" prop="activity">
              <el-select
                v-model="materialFormData.activity"
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
          <el-col :span="8">
            <el-form-item label="所属季节" prop="season">
              <el-select
                v-model="materialFormData.season"
                multiple
                placeholder="请选择出现季节"
              >
                <el-option
                  v-for="item in seasonList"
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
                v-model="materialFormData.channels"
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
            <el-form-item label="堆叠数量" prop="maxNum">
              <el-input v-model.number="materialFormData.maxNum" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="照片" prop="photoSrc">
              <upload-single
                v-model="materialFormData.photoSrc"
                dialog-width="30%"
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
import { defineComponent, ref, reactive, onMounted } from 'vue'
import {
  getMaterials,
  addMaterial,
  getMaterial,
  deleteMaterial,
} from '@api/material'
import getOption from '@utils/get-option'
import useMix from '@composables/useMix'

export default defineComponent({
  name: 'Material',
  inject: ['apiUrl'],
  setup() {
    const materialFormRef = ref(null)
    const materialFormData = reactive({
      name: '',
      price: null,
      engName: '',
      jpnName: '',
      activity: '',
      season: [],
      maxNum: null,
      channels: [],
      photoSrc: '',
    })

    const apiOption = {
      getListApi: getMaterials,
      getInfoApi: getMaterial,
      deleteApi: deleteMaterial,
      addApi: addMaterial,
    }
    const mixProps = useMix(apiOption, materialFormRef, materialFormData)

    const activityList = ref([])
    const seasonList = ref([])

    const getOptions = () => {
      getOption('activity', list => {
        activityList.value = list
      })
      getOption('season', list => {
        seasonList.value = list
      })
    }

    onMounted(getOptions)

    return {
      ...mixProps,
      materialFormRef,
      materialFormData,
      materialFormRules: {
        name: [
          { required: true, message: '请输入素材名字', trigger: 'blur' },
          {
            min: 1,
            max: 16,
            message: '长度在 2 到 16 个字符',
            trigger: 'blur',
          },
        ],
      },
      activityList,
      seasonList,
      channelList: [
        { text: '商店购买', value: '商店购买' },
        { text: '狸端机订购', value: '狸端机订购' },
        { text: '岛民赠送', value: '岛民赠送' },
        { text: 'npc赠送', value: 'npc赠送' },
        { text: '素材岛挖掘', value: '素材岛挖掘' },
        { text: '花卉杂交', value: '花卉杂交' },
        { text: '星座当月许愿', value: '星座当月许愿' },
        { text: '对流星许愿次日', value: '对流星许愿次日' },
        { text: '海滩拾取', value: '海滩拾取' },
        { text: '海滩喷水处挖掘', value: '海滩喷水处挖掘' },
        { text: '树边采集', value: '树边采集' },
        { text: '砍树掉落', value: '砍树掉落' },
        { text: '摇晃树干', value: '摇晃树干' },
        { text: '砍竹子', value: '砍竹子' },
        { text: '敲石头', value: '敲石头' },
        { text: '钓鱼', value: '钓鱼' },
        { text: '挖掘地面', value: '挖掘地面' },
        { text: '打落气球', value: '打落气球' },
        { text: '果树掉落', value: '果树掉落' },
        { text: '非果树掉落', value: '非果树掉落' },
        { text: '针叶树掉落', value: '针叶树掉落' },
        { text: '阔叶树掉落', value: '阔叶树掉落' },
        { text: '打落蓝色气球', value: '打落蓝色气球' },
        { text: '捕虫网捕捉', value: '捕虫网捕捉' },
        { text: '潜水打捞', value: '潜水打捞' },
        { text: '与阿獭交换帆立贝随机获得', value: '与阿獭交换帆立贝随机获得' },
      ],
    }
  },
})
</script>

<style scoped></style>
