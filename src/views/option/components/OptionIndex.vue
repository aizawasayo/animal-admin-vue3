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
              @clear="fetchOptionData"
              @keyup.enter.native="fetchOptionData"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="fetchOptionData"
              ></el-button>
            </el-input>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="openAddOption"
              >添加选项</el-button
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
        <keep-alive>
          <option-list
            ref="optionList"
            :type="item.key"
            :query-key="queryKey"
            @paneEdit="handleEdit(arguments)"
          />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
    <add-option
      ref="addOptionRef"
      v-model="dialogAddVisible"
      :option="newOption"
      :tab-list="tabOptions"
      @fresh-data="fetchOptionData"
      @close-dialog="hideDialog"
    ></add-option>
  </div>
</template>

<script>
import OptionList from '../components/OptionList'
import AddOption from '../components/AddOption'
import { getOption } from '@api/option'

export default {
  name: 'OptionIndex',
  components: { OptionList, AddOption },
  props: ['tabOptions', 'activeTab'],
  data() {
    return {
      activeName: this.activeTab,
      queryKey: '',
      dialogAddVisible: false,
      newOption: {
        name: '',
        type: '',
        orderNum: null,
        position: '',
        duration: null,
        icon: '',
        color: '',
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
  },
  created() {
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {
    openAddOption() {
      this.dialogAddVisible = true
      const type = this.tabOptions[this.tabIndex].key
      this.newOption = {
        name: '',
        type: type,
        orderNum: null,
        position: '',
        duration: null,
        icon: '',
        color: '',
      }
    },
    handleEdit(arg) {
      this.commonApi.openEditForm(arg[0], 'option', getOption, this)
    },
    handelMultipleDelete() {
      this.$refs.optionList[this.tabIndex].handelMultipleDelete()
    },
    fetchOptionData() {
      this.$refs.optionList.forEach(item => item.fetchData())
    },
    hideDialog() {
      this.dialogAddVisible = false
    },
  },
}
</script>

<style scoped></style>
