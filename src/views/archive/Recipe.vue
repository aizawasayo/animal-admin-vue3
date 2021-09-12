<template>
  <div class="app-container">
    <el-row class="search-box" type="flex" justify="space-between">
      <el-col :span="16">
        <el-row :gutter="24">
          <el-col :span="16">
            <el-input
              v-model="queryInfo.query"
              placeholder="请输入DIY配方关键字"
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
            <el-button
              type="primary"
              @click="() => commonApi.openAddForm('recipe', this)"
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
      title="添加DIY配方"
      v-model="dialogVisible"
      width="60%"
      :close-on-click-modal="false"
      :before-close="closeDialog"
    >
      <el-form
        ref="newRecipeRef"
        :inline="false"
        :model="newRecipe"
        :rules="newRecipeRules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="名称" prop="name">
              <el-input v-model="newRecipe.name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="英文名" prop="engName">
              <el-input v-model="newRecipe.engName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="日文名" prop="jpnName">
              <el-input v-model="newRecipe.jpnName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="种类" prop="type">
              <el-select
                v-model="newRecipe.type"
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
                v-model="newRecipe.channels"
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
              <el-select v-model="newRecipe.npc" placeholder="请选择来源npc">
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
                v-model="newRecipe.character"
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
                v-model="newRecipe.season"
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
                v-model="newRecipe.activity"
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
              <el-select v-model="newRecipe.size" placeholder="请选择占地面积">
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
                v-model="newRecipe.unlockCondition"
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
          <el-col v-for="(item, i) in newRecipe.materials" :span="10">
            <el-form-item :label="'材料' + (i + 1)" prop="" label-width="80px">
              <el-col :span="12">
                <el-select
                  v-model="newRecipe.materials[i]"
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
                v-model="newRecipe.photoSrc"
                dialog-width="30%"
                drag
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="途径说明" prop="channelDetail">
              <el-input
                v-model="newRecipe.channelDetail"
                type="textarea"
                placeholder="请输入具体途径说明"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="postRecipe">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
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
import { nextTick } from 'vue'

export default {
  name: 'Recipe',
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
      newRecipe: {
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
      },
      materialList: [],
      sizeList: [],
      typeList: [],
      activityList: [],
      seasonList: [],
      characterList: [],
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
      channelList: [],
      unlockConditionList: [
        { text: '无', value: '' },
        { text: '总DIY数量满50次', value: '50' },
        { text: '总DIY数量满100次', value: '100' },
        { text: '总DIY数量满200次', value: '200' },
      ],
      newRecipeRules: {
        name: [
          { required: true, message: '请输入配方名', trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' },
        ],
      },
      multipleSelection: [],
    }
  },
  computed: {
    isNpc() {
      return this.newRecipe.channels.includes('NPC')
    },
    isIslander() {
      return this.newRecipe.channels.includes('岛民')
    },
  },
  created() {
    this.fetchData()
    this.getOptions()
  },
  methods: {
    fetchData(param) {
      this.commonApi.getList(param, getRecipes, this)
    },
    getOptions() {
      getOption('diyType', list => {
        this.typeList = list
      })
      getOption('diyChannels', list => {
        this.channelList = list
      })
      getOption('size', list => {
        this.sizeList = list
      })
      getOption('diyUnlock', list => {})
      getOption('season', list => {
        this.seasonList = list
      })
      getOption('character', list => {
        this.characterList = list
      })
      getOption('activity', list => {
        this.activityList = list
      })
    },
    async getMaterialList(query) {
      if (!query.trim()) return
      const resMaterial = await searchMaterial(query)
      if (resMaterial.data.length === 0) {
        const resFurniture = await searchFurniture(query)
        if (resFurniture.data.length === 0) {
          const resClothing = await searchClothing(query)
          if (resClothing.data.length === 0) {
            const resRecipe = await searchRecipe(query)
            if (resRecipe.data.length === 0) return
            this.materialList = resRecipe.data.map(w => {
              return { name: w.name, _id: w._id, photoSrc: w.photoSrc, num: 1 }
            })
          } else {
            this.materialList = resClothing.data.map(w => {
              return { name: w.name, _id: w._id, photoSrc: w.photoSrc, num: 1 }
            })
          }
        } else {
          this.materialList = resFurniture.data.map(w => {
            return { name: w.name, _id: w._id, photoSrc: w.photoSrc, num: 1 }
          })
        }
      } else {
        this.materialList = resMaterial.data.map(w => {
          return { name: w.name, _id: w._id, photoSrc: w.photoSrc, num: 1 }
        })
      }
    },
    clearMaterialList() {
      this.materialList = []
    },
    addMaterials() {
      this.newRecipe.materials.push({ photoSrc: '', num: 1, name: '' })
    },
    dialogAddClose() {
      this.$refs.newRecipeRef.resetFields()
      delete this.newRecipe._id
      delete this.newRecipe.__v
      this.materialList = []
    },
    postRecipe() {
      this.newRecipe.materials = this.newRecipe.materials.filter(
        m => m.name !== ''
      )
      this.commonApi.postForm('recipe', addRecipe, this)
    },
    handleEdit(id) {
      if (this.$refs['newRecipeRef']) {
        this.$refs['newRecipeRef'].resetFields()
      }
      getRecipe(id)
        .then(res => {
          this.dialogVisible = true
          nextTick(() => {
            this.newRecipe = res.data
            this.materialList = this.newRecipe.materials
          })
        })
        .catch(err => this.$message.error(err.message))
    },
    handleDelete(id) {
      this.commonApi.deleteById(id, deleteRecipe, this.fetchData)
    },

    handelMultipleDelete() {
      this.commonApi.multipleDelete(
        this.multipleSelection,
        deleteRecipe,
        this.fetchData
      )
    },
  },
}
</script>

<style scoped></style>
