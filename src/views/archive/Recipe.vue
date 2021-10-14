<template>
  <div class="app-container">
    <el-row class="search-box" type="flex" justify="space-between">
      <el-col :span="16">
        <el-row :gutter="24">
          <el-col :span="16">
            <search-bar v-model:query="listQuery.query" keyword="DIY配方" />
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="openAddDialog"
              >添加DIY配方</el-button
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
        align="center"
        label="照片"
        width="60"
        prop="photoSrc"
        sortable="custom"
      >
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
      <el-table-column label="英文名" align="center">
        <template #default="scope">
          <span>{{ scope.row.engName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日文名" align="center">
        <template #default="scope">
          {{ $filters.textFilter(scope.row.jpnName, 5) }}
        </template>
      </el-table-column>
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
        column-key="channels"
        :filters="channelList"
      >
        <template #default="scope">
          <span v-if="scope.row.season">{{ scope.row.season }}</span>
          <span v-if="scope.row.activity">{{ scope.row.activity }}期间</span>
          <span v-if="scope.row.character"
            >({{ scope.row.character }}性格)</span
          >
          <span v-for="(item, index) in scope.row.channels">
            <span v-if="item === '岛民' || item === 'NPC'">
              {{
                index === scope.row.channels.length - 1
                  ? item + '赠送'
                  : item + '赠送 /'
              }}
            </span>
            <span v-else>
              {{ index === scope.row.channels.length - 1 ? item : item + ' /' }}
            </span>
          </span>
          <span v-if="scope.row.npc">({{ scope.row.npc }})</span>
        </template>
      </el-table-column>
      <el-table-column
        label="占地面积"
        align="center"
        prop="size"
        sortable="custom"
        column-key="size"
        :filters="sizeList"
      >
        <template #default="scope">
          {{ scope.row.size }}
        </template>
      </el-table-column>
      <el-table-column label="合成材料" align="center">
        <template #default="scope">
          <span v-for="(item, index) in scope.row.materials">{{
            index === scope.row.materials.length - 1
              ? item.name + '*' + item.num
              : item.name + '*' + item.num + '+'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="解锁条件" width="50" align="center">
        <template #default="scope">
          {{ scope.row.unlockCondition ? '有' : '无' }}
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
      title="添加DIY配方"
      v-model="dialogVisible"
      width="60%"
      :close-on-click-modal="false"
      :before-close="closeDialog"
    >
      <el-form
        ref="recipeFormRef"
        :inline="false"
        :model="recipeFormData"
        :rules="recipeFormRules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="名称" prop="name">
              <el-input v-model="recipeFormData.name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="英文名" prop="engName">
              <el-input v-model="recipeFormData.engName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="日文名" prop="jpnName">
              <el-input v-model="recipeFormData.jpnName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="种类" prop="type">
              <el-select
                v-model="recipeFormData.type"
                multiple
                collapse-tags
                placeholder="请选择种类"
                clearable
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
          <el-col :span="8">
            <el-form-item label="来源(多选)" prop="channels">
              <el-select
                v-model="recipeFormData.channels"
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
          <el-col v-show="isNpc" :span="8">
            <el-form-item label="NPC" prop="npc">
              <el-select
                v-model="recipeFormData.npc"
                placeholder="请选择来源npc"
              >
                <el-option
                  v-for="item in npcList"
                  :label="item.text"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-show="isIslander" :span="8">
            <el-form-item label="岛民性格" prop="character">
              <el-select
                v-model="recipeFormData.character"
                placeholder="请选择来源岛民性格"
              >
                <el-option
                  v-for="item in characterList"
                  :label="item.text"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="季节限定" prop="season">
              <el-select
                v-model="recipeFormData.season"
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
            <el-form-item label="所属活动" prop="activity">
              <el-select
                v-model="recipeFormData.activity"
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
            <el-form-item label="占地面积" prop="size">
              <el-select
                v-model="recipeFormData.size"
                placeholder="请选择占地面积"
              >
                <el-option
                  v-for="item in sizeList"
                  :label="item.text"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="解锁要求" prop="unlockCondition">
              <el-select
                v-model="recipeFormData.unlockCondition"
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
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-form-item label="合成配方" prop="materials" label-width="80px">
            </el-form-item>
          </el-col>
          <el-col v-for="(item, i) in recipeFormData.materials" :span="10">
            <el-form-item :label="'材料' + (i + 1)" prop="" label-width="80px">
              <el-col :span="12">
                <el-select
                  v-model="recipeFormData.materials[i]"
                  :remote-method="getMaterialList"
                  filterable
                  default-first-option
                  remote
                  value-key="name"
                  placeholder="查询材料"
                  @focus="clearMaterialList"
                >
                  <el-option
                    v-for="item1 in materialList"
                    :label="item1.name"
                    :value="item1"
                  />
                </el-select>
              </el-col>
              <el-col :span="12">
                <el-input-number
                  v-model="item.num"
                  size="medium"
                  style="width: 90%; margin-left: 10px"
                ></el-input-number>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="addMaterialsBtn">
            <el-button
              size="mini"
              round
              style="margin-top: 0.3rem; margin-left: 0.5rem"
              @click="addMaterials"
              ><i class="el-icon-plus el-icon--left"></i>增加材料</el-button
            >
          </el-col>
          <el-col :span="24">
            <el-form-item label="照片" prop="photoSrc">
              <upload-single
                v-model="recipeFormData.photoSrc"
                dialog-width="30%"
                drag
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="途径说明" prop="channelDetail">
              <el-input
                v-model="recipeFormData.channelDetail"
                type="textarea"
                placeholder="请输入具体途径说明"
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
import { defineComponent, ref, reactive, computed, onMounted } from 'vue'
import {
  getRecipes,
  addRecipe,
  getRecipe,
  deleteRecipe,
  searchRecipe,
} from '@api/recipe'
import { searchMaterial } from '@api/material'
import { searchFurniture } from '@api/furniture'
import { searchClothing } from '@api/clothing'
import getOption from '@utils/get-option'
import useMix from '@composables/useMix'

export default defineComponent({
  name: 'Recipe',
  inject: ['apiUrl'],
  setup() {
    const recipeFormRef = ref(null)
    const recipeFormData = reactive({
      name: '',
      engName: '',
      jpnName: '',
      type: '',
      activity: '',
      npc: '',
      season: '',
      character: '',
      materials: [
        { photoSrc: '', num: 1, name: '' },
        { photoSrc: '', num: 1, name: '' },
        { photoSrc: '', num: 1, name: '' },
      ],
      size: '',
      channels: [],
      channelDetail: '',
      unlockCondition: null,
      photoSrc: '',
    })

    const apiOption = {
      getListApi: getRecipes,
      getInfoApi: getRecipe,
      deleteApi: deleteRecipe,
      addApi: addRecipe,
    }
    const mixProps = useMix(apiOption, recipeFormRef, recipeFormData)

    const materialList = ref([])
    const sizeList = ref([])
    const typeList = ref([])
    const activityList = ref([])
    const seasonList = ref([])
    const characterList = ref([])
    const channelList = ref([])

    const getOptions = () => {
      getOption('diyType', list => {
        typeList.value = list
      })
      getOption('diyChannels', list => {
        channelList.value = list
      })
      getOption('size', list => {
        sizeList.value = list
      })

      getOption('season', list => {
        seasonList.value = list
      })
      getOption('character', list => {
        characterList.value = list
      })
      getOption('activity', list => {
        activityList.value = list
      })
    }

    onMounted(getOptions)

    const getMaterialList = async query => {
      if (!query.trim()) return
      const resMaterial = await searchMaterial(query)
      if (resMaterial.data.length === 0) {
        const resFurniture = await searchFurniture(query)
        if (resFurniture.data.length === 0) {
          const resClothing = await searchClothing(query)
          if (resClothing.data.length === 0) {
            const resRecipe = await searchRecipe(query)
            if (resRecipe.data.length === 0) return
            materialList.value = resRecipe.data.map(w => {
              return { name: w.name, _id: w._id, photoSrc: w.photoSrc, num: 1 }
            })
          } else {
            materialList.value = resClothing.data.map(w => {
              return { name: w.name, _id: w._id, photoSrc: w.photoSrc, num: 1 }
            })
          }
        } else {
          materialList.value = resFurniture.data.map(w => {
            return { name: w.name, _id: w._id, photoSrc: w.photoSrc, num: 1 }
          })
        }
      } else {
        materialList.value = resMaterial.data.map(w => {
          return { name: w.name, _id: w._id, photoSrc: w.photoSrc, num: 1 }
        })
      }
    }
    const clearMaterialList = () => {
      materialList.value = []
    }
    const addMaterials = () => {
      recipeFormData.materials.push({ photoSrc: '', num: 1, name: '' })
    }

    const openEditCallback = () => {
      materialList.value = recipeFormData.materials
    }
    const beforePostProcess = formData => {
      formData.materials = formData.materials.filter(m => m.name !== '')
    }

    return {
      ...mixProps,
      recipeFormRef,
      recipeFormData,
      recipeFormRules: {
        name: [
          { required: true, message: '请输入配方名', trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' },
        ],
      },
      materialList,
      sizeList,
      typeList,
      activityList,
      seasonList,
      characterList,
      channelList,
      npcList: [
        { text: '狸克', value: '狸克' },
        { text: '西施惠', value: '西施惠' },
        { text: '傅珂', value: '傅珂' },
        { text: '傅达', value: '傅达' },
        { text: '雪人', value: '雪人' },
        { text: '巴猎', value: '巴猎' },
        { text: '蹦蹦', value: '蹦蹦' },
        { text: '健兆', value: '健兆' },
        { text: '阿獭', value: '阿獭' },
      ],
      unlockConditionList: [
        { text: '无', value: '' },
        { text: '总DIY数量满50次', value: '50' },
        { text: '总DIY数量满100次', value: '100' },
        { text: '总DIY数量满200次', value: '200' },
      ],
      isNpc: computed(() => recipeFormData.channels.includes('NPC')),
      isIslander: computed(() => recipeFormData.channels.includes('岛民')),
      getMaterialList,
      clearMaterialList,
      addMaterials,
      openEditCallback,
      beforePostProcess,
    }
  },
  methods: {
    dialogAddClose() {
      $refs.recipeFormDataRef.resetFields()
      delete recipeFormData._id
      delete recipeFormData.__v
      materialList = []
    },
  },
})
</script>

<style scoped></style>
