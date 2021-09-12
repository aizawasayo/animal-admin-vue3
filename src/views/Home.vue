<template>
  <div class="home">
    <!-- <HelloWorld msg1="Hello Vue 3 + Vite" /> -->
    <img alt="Vue logo" src="../assets/logo.png" />
    <div class="block">
      <span class="demonstration">完整功能</span>
      <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryInfo.page"
        v-model:limit="queryInfo.pageSize"
        @pagination="fetchData"
      />
    </div>
    <div class="block">
      <el-button>默认按钮</el-button>
      <el-button type="primary" @click="this.$message('哈哈')"
        >主要按钮</el-button
      >
      <el-button type="success" @click="showMsg">成功按钮</el-button>
      <el-button type="warning">警告按钮</el-button>
      <el-button type="danger">危险按钮</el-button>
      <div>{{ user }}</div>
    </div>
    <el-dropdown>
      <span class="el-dropdown-link">
        下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item disabled>双皮奶</el-dropdown-item>
          <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-date-picker v-model="value1" type="date" placeholder="选择日期">
    </el-date-picker>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import { ref, reactive, getCurrentInstance } from 'vue'
// import Pagination from '@globalComponents/Pagination/Pagination.vue'
export default {
  name: 'Home',
  inject: ['user'],
  // components: { Pagination },
  setup(props, { attrs }) {
    const value1 = ref('')
    const total = ref(100)
    const queryInfo = reactive({
      page: 1, // 当前的页数
      pageSize: 10, // 当前每页显示多少条数据
    })
    const fetchData = () => {
      console.log(`第 ${queryInfo.page} 页，每页 ${queryInfo.pageSize} 条`)
    }

    const internalInstance = getCurrentInstance()
    const showMsg = () => {
      console.log(attrs)
      ElMessage.success('好吧') // 方式三
      // internalInstance.appContext.config.globalProperties.$message('啊啊')
    }
    return {
      showMsg,
      value1,
      total,
      queryInfo,
      fetchData,
    }
  },
}
</script>
