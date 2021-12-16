<template>
  <div class="app-container">
    <el-row class="search-box" type="flex" justify="space-between">
      <el-col :span="16">
        <el-row :gutter="24">
          <el-col :span="16">
            <search-bar v-model:query="queryKey" keyword="选项" />
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="openAddOption"
              >添加选项</el-button
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
        <keep-alive>
          <option-list
            :ref="
              el => {
                if (el) optionListRefs[i] = el
              }
            "
            :type="item.key"
            :query-key="queryKey"
            @paneEdit="id => handleEdit(id)"
          />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
    <option-form
      ref="optionDialogRef"
      :type="activeName"
      :tab-options="tabOptions"
      @fresh-list="freshListData"
    ></option-form>
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
import OptionList from './OptionList.vue'
import OptionForm from './OptionForm.vue'
import { getOption } from '@api/option'

export default defineComponent({
  name: 'OptionIndex',
  components: { OptionList, OptionForm },
  props: ['tabOptions', 'activeTab'],
  setup(props) {
    const router = useRouter()
    const route = useRoute()
    const { activeTab, tabOptions } = toRefs(props)
    const activeName = ref(activeTab.value)
    const queryKey = ref('')
    const optionListRefs = ref([])
    const optionDialogRef = ref(null)

    onBeforeUpdate(() => {
      optionListRefs.value = []
    })

    const tabIndex = computed(() =>
      tabOptions.value.findIndex(item => item.key === activeName.value)
    )

    watch(activeName, val => router.push(`${route.path}?tab=${val}`), {
      immediate: true,
    })

    watch(activeTab, val => (activeName.value = activeTab.value))

    const openAddOption = () => {
      optionDialogRef.value.openAddDialog(optionDialogRef.value.openAddCallback)
    }

    const handleEdit = id => {
      optionDialogRef.value.openEditDialog(id, getOption)
    }

    const freshListData = () => {
      optionListRefs.value[tabIndex.value].refreshList()
    }

    const handleMultiDelete = () => {
      optionListRefs.value[tabIndex.value].multiDelete()
    }

    return {
      activeName,
      tabOptions,
      queryKey,
      tabIndex,
      optionListRefs,
      optionDialogRef,
      openAddOption,
      handleEdit,
      handleMultiDelete,
      freshListData,
    }
  },
})
</script>

<style scoped></style>
