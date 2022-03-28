<template>
  <div class="app-container">
    <el-row class="search-box" type="flex" justify="space-between">
      <el-col :span="16">
        <el-row :gutter="24">
          <el-col :span="16">
            <search-bar v-model:query="listQuery.query" keyword="工具" />
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="openAddDialog"
              >添加工具</el-button
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
      <el-table-column align="center" label="照片" width="60" prop="photoSrc">
        <template #default="scope">
          <img
            v-if="scope.row.photoSrc"
            :src="realUrl + scope.row.photoSrc"
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
      <el-table-column
        label="耐久度"
        align="center"
        prop="durability"
        sortable="custom"
      >
        <template #default="scope">
          {{ scope.row.durability ? scope.row.durability : '永久' }}
        </template>
      </el-table-column>
      <el-table-column
        label="可否DIY"
        align="center"
        column-key="isDIY"
        :filters="isDIYList"
      >
        <template #default="scope">
          {{ scope.row.isDIY ? '可DIY制作' : '不可DIY制作' }}
        </template>
      </el-table-column>
      <el-table-column
        label="获取途径"
        align="center"
        column-key="channels"
        :filters="channelList"
      >
        <template #default="scope">
          <span v-if="scope.row.activity">{{ scope.row.activity }}/</span>
          <span>{{ scope.row.channels.join('/') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="途径详情" align="center">
        <template #default="scope">
          {{ scope.row.channelDetail ? '有' : '无' }}
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
      title="添加工具"
      v-model="dialogVisible"
      width="60%"
      :close-on-click-modal="false"
      :before-close="closeDialog"
    >
      <el-form
        ref="toolFormRef"
        :inline="false"
        :model="toolFormData"
        :rules="toolFormRules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="可否DIY" prop="isDIY" required>
              <el-radio-group v-model="toolFormData.isDIY" @change="changeDIY">
                <el-radio :label="true">可以DIY制作</el-radio>
                <el-radio :label="false">不可以DIY制作</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="工具名称" prop="name" required>
              <el-input v-model="toolFormData.name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="英文名" prop="engName">
              <el-input v-model="toolFormData.engName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="日文名" prop="jpnName">
              <el-input v-model="toolFormData.jpnName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="价格" prop="price">
              <el-input v-model.number="toolFormData.price" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="耐久度" prop="durability">
              <el-input v-model.number="toolFormData.durability" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="来源(多选)" prop="channels">
              <el-select
                v-model="toolFormData.channels"
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
            <el-form-item label="所属活动" prop="activity">
              <el-select
                v-model="toolFormData.activity"
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
          <el-col :span="24">
            <el-form-item label="照片" prop="photoSrc">
              <upload-single
                v-model="toolFormData.photoSrc"
                dialog-width="30%"
                drag
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="途径说明" prop="channelDetail">
              <el-input
                v-model="toolFormData.channelDetail"
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
          <el-button type="primary" @click="handlePost">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { computed, defineComponent, ref, reactive, onMounted } from 'vue'
import getOption from '@utils/get-option'
import { getTools, addTool, getTool, deleteTool } from '@api/tool'
import useMix from '@composables/useMix'

export default defineComponent({
  name: 'Tool',
  inject: ['realUrl'],
  setup() {
    const toolFormRef = ref(null)
    const toolFormData = reactive({
      name: '',
      price: null,
      engName: '',
      jpnName: '',
      durability: null,
      isDIY: null,
      activity: '',
      channels: [],
      channelDetail: '',
      photoSrc: '',
    })
    const apiOption = {
      getListApi: getTools,
      getInfoApi: getTool,
      deleteApi: deleteTool,
      addApi: addTool,
    }
    const loadingRef = ref(null)
    const mixProps = useMix(
      apiOption,
      toolFormRef,
      toolFormData,
      null,
      loadingRef
    )

    const channelList = ref([])
    const activityList = ref([])

    const getOptions = () => {
      getOption('toolChannels', list => {
        channelList.value = list
      })
      getOption('activity', list => {
        activityList.value = list
      })
    }

    onMounted(getOptions)

    return {
      ...mixProps,
      toolFormRef,
      toolFormData,
      toolFormRules: {
        name: [{ required: true, message: '请填写工具名', trigger: 'blur' }],
      },
      loadingRef,
      channelList,
      activityList,
      isDIYList: [
        { text: '可以DIY制作', value: true },
        { text: '不可以DIY制作', value: false },
      ],
      isDIYBL: computed(
        () => toolFormData.isDIY !== null && toolFormData.isDIY === true
      ),
      notDIY: computed(
        () => toolFormData.isDIY !== null && toolFormData.isDIY === false
      ),
      changeDIY: val => {
        val
          ? toolFormData.channels.push('DIY制作')
          : (toolFormData.channels = [])
      },
    }
  },
})
</script>

<style scoped></style>
