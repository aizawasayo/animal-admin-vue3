<template>
  <div class="app-container">
    <el-row class="search-box" type="flex" justify="space-between">
      <el-col :span="16">
        <el-row :gutter="24">
          <el-col :span="16">
            <el-input
              v-model="queryKey"
              placeholder="请输入选项关键字"
              class="input-with-select"
              clearable
              @clear="fetchDesignData"
              @keyup.enter.native="fetchDesignData"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="fetchDesignData"
              ></el-button>
            </el-input>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="openAddDesign"
              >添加设计</el-button
            >
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8" class="flex-right">
        <el-button type="danger" plain @click="handelMultipleDelete"
          >批量删除</el-button
        >
      </el-col>
    </el-row>
    <el-tabs v-model="activeName" style="margin-top: 15px" type="card">
      <el-tab-pane
        v-for="item in tabOptions"
        :label="item.label"
        :name="item.key"
      >
        <span slot="label">
          <svg-icon :icon-class="item.icon" /> {{ item.label }}
        </span>
        <design-list
          ref="designList"
          :type="item.key"
          :query-key="queryKey"
          @paneEdit="handleEdit(arguments)"
        />
      </el-tab-pane>
    </el-tabs>
    <add-design
      ref="addDesignRef"
      v-model="dialogAddVisible"
      :design="newDesign"
      :tab-list="tabOptions"
      @fresh-data="fetchDesignData"
      @close-dialog="hideDialog"
    ></add-design>
  </div>
</template>

<script>
import DesignList from '../components/DesignList.vue'
import AddDesign from '../components/AddDesign.vue'
import { getDesign } from '@api/design'

export default {
  name: 'DesignIndex',
  components: { DesignList, AddDesign },
  props: ['tabOptions', 'activeTab'],
  data() {
    return {
      activeName: this.activeTab,
      queryKey: '',
      addKey: 1,
      dialogAddVisible: false,
      newDesign: {
        name: '',
        type: '',
        photoSrc: [],
        content: '',
      },
      multipleSelection: [],
    }
  },
  computed: {
    tabIndex() {
      return this.tabOptions.findIndex(item => item.key === this.activeName)
    },
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    },
    newDesign() {},
  },
  created() {
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {
    openAddDesign() {
      this.dialogAddVisible = true
      const type = this.tabOptions[this.tabIndex].key
      this.newDesign = {
        name: '',
        type: type,
        photoSrc: [],
        content: '',
      }
    },
    handleEdit(arg) {
      this.commonApi.openEditForm(arg[0], 'design', getDesign, this)
    },
    handelMultipleDelete() {
      this.$refs.designList[this.tabIndex].handelMultipleDelete()
    },
    fetchDesignData() {
      this.$refs.designList[this.tabIndex].fetchData()
    },
    hideDialog() {
      this.dialogAddVisible = false
    },
  },
}
</script>

<style scoped></style>
