<template>
  <el-card class="card" shadow="never" style="border-radius: 8px">
    <div>
      <span>依赖信息</span>
      <div style="float: right">部署时间:{{ updateTime }}</div>
    </div>

    <div class="bottom-btn">
      <a target="_blank" href="https://github.com/vuejs/vue-next">
        <el-button type="success"> vue3.x </el-button>
      </a>
      <a target="_blank" href="https://element-plus.gitee.io/#/zh-CN">
        <el-button type="primary"> element-plus </el-button>
      </a>
      <!-- <a target="_blank" href="https://github.com/koajs/koa">
        <el-button type="info"> koa2.x </el-button>
      </a> -->
      <a target="_blank" href="https://github.com/apache/echarts">
        <el-button type="info">echarts5</el-button>
      </a>
      <!-- <a target="_blank" href="https://github.com/intlify/vue-i18n-next">
        <el-button type="warning">vue-i18n-next</el-button>
      </a> -->
      <a target="_blank" href="https://www.tslang.cn/docs/home.html">
        <el-button type="danger">typescript</el-button>
      </a>
    </div>
    <table class="deps-table">
      <tr>
        <td colspan="4" class="deps-table-header">运行依赖</td>
      </tr>
      <tr>
        <td>axios 版本</td>
        <td>{{ dependencies['axios'] }}</td>
        <td>vue 版本</td>
        <td>{{ dependencies['vue'] }}</td>
      </tr>
      <tr>
        <td>vue-router 版本</td>
        <td>{{ dependencies['vue-router'] }}</td>
        <td>vuex 版本</td>
        <td>{{ dependencies['vuex'] }}</td>
      </tr>
      <tr>
        <td>tinymce 版本</td>
        <td>{{ dependencies['tinymce'] }}</td>
        <td>tinymce-vue 版本</td>
        <td>{{ dependencies['@tinymce/tinymce-vue'] }}</td>
      </tr>
      <tr>
        <td>element-plus 版本</td>
        <td>{{ dependencies['element-plus'] }}</td>
        <td>echarts 版本</td>
        <td>{{ dependencies['echarts'] }}</td>
      </tr>
      <tr>
        <td>dayjs 版本</td>
        <td>{{ dependencies['dayjs'] }}</td>
        <td>nprogress 版本</td>
        <td>{{ dependencies['nprogress'] }}</td>
      </tr>
      <tr>
        <td>js-cookie 版本</td>
        <td>{{ dependencies['js-cookie'] }}</td>
        <td>path-browserify 版本</td>
        <td>{{ dependencies['path-browserify'] }}</td>
      </tr>
      <tr>
        <td colspan="4" class="deps-table-header">开发依赖</td>
      </tr>
      <tr>
        <td>typescript 版本</td>
        <td>{{ devDependencies['typescript'] }}</td>
        <td>vite 版本</td>
        <td>{{ devDependencies['vite'] }}</td>
      </tr>
      <tr>
        <td>sass 版本</td>
        <td>{{ devDependencies['sass'] }}</td>
        <td>vite-plugin-svg-icons</td>
        <td>{{ devDependencies['vite-plugin-svg-icons'] }}</td>
      </tr>
    </table>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, inject } from 'vue'
import { dependencies, devDependencies } from '../../../../../package.json'
export default defineComponent({
  name: 'DependsTable',
  setup() {
    const state = reactive({
      updateTime: inject('update_time'),
    })
    return {
      dependencies,
      devDependencies,
      ...toRefs(state),
    }
  },
})
</script>

<style lang="scss" scoped>
.deps-table {
  width: 100%;
  color: $grey;
  border-collapse: collapse;
  background-color: #fff;
  td {
    min-height: 20px;
    padding: 9px 15px;
    font-size: 14px;
    line-height: 20px;
    border: 1px solid #e6e6e6;
    &:nth-child(odd) {
      width: 25%;
      text-align: right;
      background-color: #f7f7f7;
    }
    &.deps-table-header {
      color: $green;
      text-align: left;
      font-weight: bold;
      background-color: $white;
    }
  }
}

.bottom-btn {
  button {
    margin: 16px 10px 15px 0;
  }
}
</style>
