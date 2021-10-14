<template>
  <div class="app-container">
    <el-row class="search-box" type="flex" justify="space-between">
      <el-col :span="16">
        <el-row :gutter="24">
          <el-col :span="16">
            <search-bar v-model:query="listQuery.query" keyword="艺术品" />
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="openAddDialog"
              >添加艺术品</el-button
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
      <el-table-column type="selection" width="36"> </el-table-column>
      <el-table-column align="center" label="序号" width="55">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="照片" width="60" prop="photoSrc">
        <template #default="scope">
          <img
            v-if="scope.row.photoSrc.length > 0 && scope.row.photoSrc[0].src"
            :src="apiUrl + scope.row.photoSrc[0].src"
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
        prop="price"
        sortable="custom"
      >
        <template #default="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column label="英文名" align="center">
        <template #default="scope">
          {{ scope.row.engName }}
        </template>
      </el-table-column>
      <el-table-column label="日文名" align="center">
        <template #default="scope">
          {{ $filters.textFilter(scope.row.jpnName, 5) }}
        </template>
      </el-table-column>
      <el-table-column label="真名" align="center">
        <template #default="scope">
          {{ scope.row.realName }}
        </template>
      </el-table-column>
      <el-table-column label="售出价格" align="center">
        <template #default="scope">
          {{ scope.row.salePrice }}（赝品为0）
        </template>
      </el-table-column>
      <el-table-column label="占地面积" align="center">
        <template #default="scope">
          {{ scope.row.size }}
        </template>
      </el-table-column>
      <el-table-column label="赝品特征" align="center">
        <template #default="scope">
          {{ $filters.textFilter(scope.row.fakeCharacter, 10) }}
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
      title="添加艺术品"
      v-model="dialogVisible"
      width="60%"
      :close-on-click-modal="false"
      :before-close="closeDialog"
    >
      <el-form
        ref="artworkFormRef"
        :inline="false"
        :model="artworkFormData"
        :rules="artworkFormRules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="名称" prop="name">
              <el-input v-model="artworkFormData.name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="英文名" prop="engName">
              <el-input v-model="artworkFormData.engName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="日文名" prop="jpnName">
              <el-input v-model="artworkFormData.jpnName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="真名" prop="realName">
              <el-input v-model="artworkFormData.realName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="价格" prop="price">
              <el-input v-model.number="artworkFormData.price" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="售出价格" prop="salePrice">
              <el-input v-model.number="artworkFormData.salePrice" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="占地面积" prop="size" required>
              <el-select
                v-model="artworkFormData.size"
                collapse-tags
                placeholder="请选择尺寸"
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
          <el-col :span="24">
            <el-form-item label="照片" prop="photoSrc">
              <upload-multi
                ref="uploadRef"
                drag
                :list="artworkFormData.photoSrc"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="赝品特征" prop="fakeCharacter">
              <el-input
                v-model="artworkFormData.fakeCharacter"
                type="textarea"
                placeholder="请输入赝品特征"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="相关信息" prop="introduction">
              <el-input
                v-model="artworkFormData.introduction"
                type="textarea"
                placeholder="请输入详细信息与描述"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handlePost(true, beforePostProcess)"
            >确 定</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted, computed } from 'vue'
import {
  getArtworkList,
  addArtwork,
  getArtwork,
  deleteArtwork,
} from '@api/artwork'
import useMix from '@composables/useMix'
import getOption from '@utils/get-option'

export default defineComponent({
  name: 'Artwork',
  inject: ['apiUrl'],
  setup() {
    const artworkFormRef = ref(null)
    const artworkFormData = reactive({
      name: '',
      engName: '',
      jpnName: '',
      realName: '',
      price: 4980,
      salePrice: 1245,
      size: '',
      hasFake: null,
      fakeCharacter: '',
      introduction: '',
      photoSrc: [],
    })

    const apiOption = {
      getListApi: getArtworkList,
      getInfoApi: getArtwork,
      deleteApi: deleteArtwork,
      addApi: addArtwork,
    }
    const uploadRef = ref(null)
    const mixProps = useMix(
      apiOption,
      artworkFormRef,
      artworkFormData,
      uploadRef
    )

    const sizeList = ref([])

    const getOptions = () => {
      getOption('size', list => {
        sizeList.value = list
      })
    }

    onMounted(getOptions)

    const isSale = computed(() => artworkFormData.orderType === '订购')

    return {
      ...mixProps,
      artworkFormRef,
      artworkFormData,
      artworkFormRules: {
        name: [
          { required: true, message: '请输入服饰名', trigger: 'blur' },
          {
            min: 1,
            max: 16,
            message: '长度在 1 到 16 个字符',
            trigger: 'blur',
          },
        ],
      },
      uploadRef,
      isSale,
      sizeList,
      beforePostProcess: formData =>
        formData.fakeCharacter
          ? (formData.hasFake = true)
          : (formData.hasFake = false),
    }
  },
})
</script>

<style scoped></style>
