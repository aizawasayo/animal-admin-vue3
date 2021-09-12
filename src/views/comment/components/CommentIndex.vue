<template>
  <div class="app-container">
    <el-row class="search-box" type="flex" justify="space-between">
      <el-col :span="16">
        <el-row :gutter="24">
          <el-col :span="16">
            <el-input
              v-model="queryKey"
              placeholder="请输入评论关键字"
              class="input-with-select"
              clearable
              @clear="fetchCommentData"
              @keyup.enter.native="fetchCommentData"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="fetchCommentData"
              ></el-button>
            </el-input>
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
        <span slot="label"> {{ item.label }} </span>
        <keep-alive>
          <comment-list
            ref="designList"
            :type="item.key"
            :query-key="queryKey"
          />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import CommentList from '../components/CommentList'

export default {
  name: 'CommentIndex',
  components: { CommentList },
  props: ['tabOptions', 'activeTab'],
  data() {
    return {
      activeName: this.activeTab,
      queryKey: '',
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
  },
  created() {
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {
    handelMultipleDelete() {
      this.$refs.designList[this.tabIndex].handelMultipleDelete()
    },
    fetchCommentData() {
      this.$refs.optionList.forEach(item => item.fetchData())
    },
    hideDialog() {
      this.dialogAddVisible = false
    },
  },
}
</script>

<style scoped></style>
