<template>
  <div class="app-container">
    <el-row class="search-box" type="flex" justify="space-between">
      <el-col :span="16">
        <el-row :gutter="24">
          <el-col :span="16">
            <search-bar v-model:query="listQuery.query" keyword="用户" />
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="openAddDialog"
              >添加用户</el-button
            >
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8" class="flex-right">
        <!-- <el-select v-model="listQuery.breed" clearable placeholder="筛选种族" style="margin-right: 10px" @change="getList('refresh')">
          <el-option v-for="item in breedList" :label="item.text" :value="item.value" />
        </el-select> -->
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
      <el-table-column align="center" label="头像" width="80">
        <template #default="scope">
          <img
            v-if="scope.row.avatar"
            :src="realUrl + scope.row.avatar"
            width="25"
            height="25"
          />
          <span v-else>未上传</span>
        </template>
      </el-table-column>
      <el-table-column
        label="用户名"
        align="center"
        prop="username"
        sortable="custom"
        width="100"
      >
        <template #default="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="邮箱"
        align="center"
        prop="email"
        sortable="custom"
        width="200"
      >
        <template #default="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column> -->
      <el-table-column label="昵称" align="center" width="90">
        <template #default="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>
      <el-table-column
        label="登岛日期"
        align="center"
        width="110"
        prop="startDate"
        sortable="custom"
      >
        <template #default="scope">
          {{ $filters.parseTime(scope.row.startDate, '{y}-{m}-{d}') }}
        </template>
      </el-table-column>
      <el-table-column label="动森ID" align="center" prop="gameId" width="180">
        <template #default="scope">
          {{ scope.row.gameId }}
        </template>
      </el-table-column>
      <el-table-column label="岛屿名称" align="center" prop="islandName">
        <template #default="scope">
          {{ scope.row.islandName }}
        </template>
      </el-table-column>
      <el-table-column
        label="岛屿位置"
        width="100"
        align="center"
        column-key="position"
        :filters="positionList"
      >
        <template #default="scope">
          <span>{{
            scope.row.position
              ? scope.row.position === 'North'
                ? '北半球'
                : '南半球'
              : ''
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="角色"
        width="90"
        align="center"
        column-key="roles"
        :filters="roleList"
      >
        <template #default="scope">
          {{ scope.row.roles.includes('admin') ? '管理员' : '普通用户' }}
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        width="90"
        align="center"
        prop="state"
        column-key="state"
        :filters="stateList"
        sortable="custom"
      >
        <template #default="scope">
          {{ scope.row.state === 0 ? '启用' : '禁用' }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="个性签名" align="center">
        <template #default="scope">
          {{ scope.row.signature }}
        </template>
      </el-table-column> -->
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
            @click="handleDelete(scope.row._id, scope.row.roles)"
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
      title="添加用户"
      v-model="dialogVisible"
      width="60%"
      :close-on-click-modal="false"
      :before-close="closeDialog"
    >
      <el-form
        ref="userFormRef"
        :inline="false"
        :model="userFormData"
        :rules="userFormRules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="用户名" prop="username">
              <el-input
                v-if="userFormData._id"
                v-model="userFormData.username"
                disabled
              />
              <el-input v-else v-model="userFormData.username" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="userFormData.nickname" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="游戏ID" prop="gameId">
              <el-input v-model="userFormData.gameId" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="岛屿名称" prop="islandName">
              <el-input v-model="userFormData.islandName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="岛屿位置" prop="position">
              <el-radio-group v-model="userFormData.position">
                <el-radio label="North">北半球</el-radio>
                <el-radio label="South">南半球</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="登岛日期" prop="startDate">
              <el-date-picker
                v-model="userFormData.startDate"
                type="date"
                placeholder="选择日期"
                style="width: 100%"
                :disabledDate="disabledDate"
                value-format="x"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="角色" prop="roles">
              <el-checkbox-group v-model="userFormData.roles">
                <el-checkbox label="admin">管理员</el-checkbox>
                <el-checkbox label="normal">普通用户</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态" prop="state">
              <el-radio-group v-model="userFormData.state">
                <el-radio :label="0">启用</el-radio>
                <el-radio :label="1">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-if="userFormData._id" label="密码" prop="psw">
              <el-input
                v-model="userFormData.password"
                type="password"
                show-password
                disabled
              />
            </el-form-item>
            <el-form-item v-else label="密码" prop="password">
              <el-input
                v-model="userFormData.password"
                type="password"
                show-password
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="头像" prop="avatar">
              <upload-single v-model="userFormData.avatar" drag />
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
import { ref, reactive, defineComponent } from 'vue'
import { getUsers, addUser, getUser, editUser, deleteUser } from '@api/user'
import useMix from '@composables/useMix'

export default defineComponent({
  name: 'User',
  inject: ['realUrl'],
  setup() {
    // 用户信息表单
    const userFormRef = ref(null)
    const userFormData = reactive({
      username: '',
      nickname: '',
      email: '',
      gameId: '',
      islandName: '',
      position: '',
      startDate: '',
      password: '',
      avatar: '',
      roles: [],
      state: 0,
      signature: '',
    })

    const apiOption = {
      getListApi: getUsers,
      getInfoApi: getUser,
      deleteApi: deleteUser,
      editApi: editUser,
      addApi: addUser,
    }

    const loadingRef = ref(null)
    const mixProps = useMix(
      apiOption,
      userFormRef,
      userFormData,
      null,
      loadingRef
    )

    const checkPass = (rule, value, callback) => {
      // 至少8个字符，至少1个大写字母，1个小写字母和1个数字,不能包含特殊字符（非数字字母）：
      // ^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$
      const reg = new RegExp(/^[a-zA-Z0-9]{8,16}$/)
      if (!value) {
        callback(new Error('密码不能为空'))
      } else if (!reg.test(value)) {
        callback(new Error('密码不符合规则'))
      } else {
        callback()
      }
    }
    return {
      ...mixProps,
      userFormRef,
      userFormData,
      userFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 2,
            max: 12,
            message: '长度在 2 到 12 个字符',
            trigger: 'blur',
          },
        ],
        gameId: [{ required: true, message: '请输入游戏ID', trigger: 'blur' }],
        password: [{ validator: checkPass, trigger: 'blur' }],
        roles: [
          { required: true, message: '请选择用户角色', trigger: 'change' },
        ],
      },
      loadingRef,
      stateList: [
        { text: '启用', value: 0 },
        { text: '禁用', value: 1 },
      ],
      positionList: [
        { text: '北半球', value: 'North' },
        { text: '南半球', value: 'South' },
      ],
      roleList: [
        { text: '管理员', value: 'admin' },
        { text: '普通用户', value: 'normal' },
      ],
      disabledDate(time) {
        // 禁用当前日期后面的日期
        return time.getTime() > Date.now()
      },
    }
  },
})
</script>
