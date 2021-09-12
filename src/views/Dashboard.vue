<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎， {{ username }}</div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
    >
    </el-pagination>
    {{ (size, $ELEMENT.size) }}
    <el-checkbox-group v-model="checkList">
      <el-checkbox label="复选框 A"></el-checkbox>
      <el-checkbox label="复选框 B"></el-checkbox>
      <el-checkbox label="复选框 C"></el-checkbox>
      <el-checkbox label="禁用" disabled></el-checkbox>
      <el-checkbox label="选中且禁用" disabled></el-checkbox>
    </el-checkbox-group>
    <!-- <div class="test-title">这是页面引入图片，图片小于url-loader的limit值</div>
    <img src="@assets/denglun.jpg" class="test-image" />
    <div class="test-bg">这是引入背景图，css在组件内，图片大于url-loader的limit值</div>
    <div class="test-index-bg">这是引入背景图，css在index.scss，图片大于url-loader的limit值</div>
    <div class="test-limit-bg">这是引入背景图，css在index.scss，图片小于url-loader的limit值</div> -->
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'

export default defineComponent({
  name: 'Home',
  data() {
    return { currentPage4: 4, checkList: ['选中且禁用', '复选框 A'] }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
  },
  computed: { ...mapGetters(['username', 'size']) },
})
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.test-bg {
  width: 600px;
  height: 150px;
  line-height: 100px;
  text-align: center;
  color: goldenrod;
  background-image: url('../../assets/denglun-bg.jpg');
  background-size: contain;
}
</style>
