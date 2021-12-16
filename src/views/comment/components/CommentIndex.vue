<template>
  <div class="app-container">
    <el-row class="search-box" type="flex" justify="space-between">
      <el-col :span="16">
        <el-row :gutter="24">
          <el-col :span="16">
            <search-bar v-model:query="queryKey" keyword="评论" />
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8" class="flex-right">
        <el-button type="danger" plain @click="handleMultiDelete"
          >批量删除</el-button
        >
      </el-col>
    </el-row>
    <el-tabs v-model="activeName" style="margin-top: 15px" class="myTabs">
      <el-tab-pane
        v-for="(item, i) in tabOptions"
        :label="item.label"
        :name="item.key"
      >
        <keep-alive>
          <comment-list
            :ref="
              el => {
                if (el) commentListRefs[i] = el
              }
            "
            :type="item.key"
            :query-key="queryKey"
          />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  toRefs,
  onBeforeUpdate,
  watch,
} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import CommentList from './CommentList.vue'

export default defineComponent({
  name: 'CommentIndex',
  components: { CommentList },
  props: ['tabOptions', 'activeTab'],
  setup(props) {
    const router = useRouter()
    const route = useRoute()
    const { activeTab, tabOptions } = toRefs(props)
    const activeName = ref(activeTab.value)
    const queryKey = ref('')
    const commentListRefs = ref([])

    onBeforeUpdate(() => {
      commentListRefs.value = []
    })

    const tabIndex = computed(() =>
      tabOptions.value.findIndex((item: any) => item.key === activeName.value)
    )

    watch(activeName, val => router.push(`${route.path}?tab=${val}`), {
      immediate: true,
    })

    watch(activeTab, val => (activeName.value = activeTab.value))

    const freshListData = () => {
      commentListRefs.value[tabIndex.value].refreshList()
    }

    const handleMultiDelete = () => {
      commentListRefs.value[tabIndex.value].multiDelete()
    }

    return {
      activeName,
      tabOptions,
      queryKey,
      tabIndex,
      commentListRefs,
      handleMultiDelete,
      freshListData,
    }
  },
})
</script>

<style scoped></style>
