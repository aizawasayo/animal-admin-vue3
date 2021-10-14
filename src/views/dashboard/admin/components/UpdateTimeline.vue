<template>
  <el-card class="card" shadow="never">
    <el-timeline>
      <el-timeline-item timestamp="2021/10/02" placement="top">
        <el-card>
          <h4>更新 Github 仓库</h4>
          <p>aizawasayo 提交于 2021/10/02 20:46</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="2021/9/30" placement="top">
        <el-card>
          <h4>更新 Github 仓库</h4>
          <p>aizawasayo 提交于 2021/9/30 10:24</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item center timestamp="2021/9/12" placement="top">
        仓库初始化
      </el-timeline-item>
    </el-timeline>
  </el-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'UpdateTimeline',
  setup() {
    return {}
  },
})
</script>

<style scoped></style>
