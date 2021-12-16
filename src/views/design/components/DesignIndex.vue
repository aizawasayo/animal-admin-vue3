<template>
  <div class="app-container">
    <el-row class="search-box" type="flex" justify="space-between">
      <el-col :span="16">
        <el-row :gutter="24">
          <el-col :span="16">
            <search-bar v-model:query="queryKey" keyword="设计" />
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="openAddDesign"
              >添加设计</el-button
            >
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
        <template #label>
          <span><svg-icon :icon-class="item.icon" /> {{ item.label }}</span>
        </template>
        <keep-alive>
          <design-list
            :ref="
              el => {
                if (el) designListRefs[i] = el
              }
            "
            :type="item.key"
            :query-key="queryKey"
            @paneEdit="id => handleEdit(id)"
          />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
    <design-form
      ref="designDialogRef"
      :type="activeName"
      :tab-options="tabOptions"
      @fresh-list="freshListData"
    ></design-form>
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  computed,
  toRefs,
  onBeforeUpdate,
  watch,
} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import DesignList from './DesignList.vue'
import DesignForm from './DesignForm.vue'
import { getDesign } from '@api/design'

export default defineComponent({
  name: 'DesignIndex',
  components: { DesignList, DesignForm },
  props: ['tabOptions', 'activeTab'],
  setup(props) {
    const router = useRouter()
    const route = useRoute()
    const { activeTab, tabOptions } = toRefs(props)
    const activeName = ref(activeTab.value)
    const queryKey = ref('')
    const designListRefs = ref([])
    const designDialogRef = ref(null)

    onBeforeUpdate(() => {
      designListRefs.value = []
    })

    const tabIndex = computed(() =>
      tabOptions.value.findIndex(item => item.key === activeName.value)
    )

    watch(activeName, val => router.push(`${route.path}?tab=${val}`), {
      immediate: true,
    })

    watch(activeTab, val => (activeName.value = activeTab.value))

    const openAddDesign = () => {
      designDialogRef.value.openAddDialog(designDialogRef.value.openAddCallback)
    }

    const handleEdit = id => {
      designDialogRef.value.openEditDialog(id, getDesign)
    }

    const freshListData = () => {
      designListRefs.value[tabIndex.value].refreshList()
    }

    const handleMultiDelete = () => {
      designListRefs.value[tabIndex.value].multiDelete()
    }

    return {
      activeName,
      tabOptions,
      queryKey,
      tabIndex,
      designListRefs,
      designDialogRef,
      openAddDesign,
      handleEdit,
      handleMultiDelete,
      freshListData,
    }
  },
})
</script>

<style scoped></style>
