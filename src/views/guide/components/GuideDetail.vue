<template>
  <div class="createPost-container">
    <el-form
      ref="guideFormRef"
      :model="guideFormData"
      :rules="guideFormRules"
      class="form-container"
    >
      <sticky :z-index="10" :class-name="'sub-navbar ' + guideFormData.status">
        <CommentDropdown v-model="guideFormData.comment_disabled" />
        <PlatformDropdown
          v-model="guideFormData.platforms"
          style="margin-left: 10px"
        />
        <SourceUrlDropdown
          v-model="guideFormData.source_uri"
          style="margin-left: 10px"
        />
        <el-button
          :loading="postLoading"
          ref="loadingPubRef"
          style="margin-left: 10px"
          type="success"
          @click="handlePost('published')"
          >发布</el-button
        >
        <el-button
          :loading="postLoading"
          type="danger"
          @click="handlePost('draft')"
          >存草稿</el-button
        >
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px" prop="title" required>
              <MDinput
                v-model="guideFormData.title"
                :maxlength="100"
                name="name"
                required
                >标题</MDinput
              >
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item
                    label-width="60px"
                    label="作者:"
                    class="postInfo-container-item"
                    prop="author"
                    required
                  >
                    <el-select
                      v-model="guideFormData.author"
                      :remote-method="getUserList"
                      filterable
                      default-first-option
                      remote
                      value-key="_id"
                      placeholder="搜索作者"
                    >
                      <el-option
                        v-for="item in userListOptions"
                        :label="item.username"
                        :value="item"
                        :key="item._id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item
                    label-width="120px"
                    label="发布时间:"
                    class="postInfo-container-item"
                    prop="display_time"
                    required
                  >
                    <el-date-picker
                      v-model="displayTime"
                      type="datetime"
                      placeholder="请选择时间"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item
                    label-width="90px"
                    label="分类:"
                    class="postInfo-container-item"
                    prop="type"
                    required
                  >
                    <el-select v-model="guideFormData.type" filterable>
                      <el-option
                        v-for="(item, index) in typeOptions"
                        :label="item"
                        :value="item"
                        :key="item"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="6">
                  <el-form-item label-width="90px" label="级别:" class="postInfo-container-item">
                    <el-rate
                      v-model="guideFormData.importance"
                      :max="3"
                      :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                      :low-threshold="1"
                      :high-threshold="3"
                      style="display: inline-block;"
                    />
                  </el-form-item>
                </el-col> -->
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item
          style="margin-bottom: 40px"
          label-width="70px"
          label="摘要:"
        >
          <el-input
            v-model="guideFormData.content_short"
            :rows="1"
            type="textarea"
            class="article-textarea"
            autosize
            placeholder="请输入内容"
          />
          <span v-show="contentShortLength" class="word-counter"
            >{{ contentShortLength }}个字</span
          >
        </el-form-item>

        <el-form-item prop="content" style="margin-bottom: 30px">
          <Tinymce ref="editor" v-model="guideFormData.content" :height="400" />
        </el-form-item>
        <h4 class="mainImg-title"><span>*</span>文章主图</h4>
        <el-form-item prop="image_uri" style="margin-bottom: 30px">
          <image-upload v-model="guideFormData.image_uri" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  onBeforeMount,
  reactive,
  nextTick,
} from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
// import Tinymce from '@components/Tinymce/index.vue'
// import ImageUpload from '@components/ImageUpload.vue'
// import MDinput from '@components/MDinput.vue'
// import Sticky from '@components/Sticky.vue'
import usePostForm from '@composables/usePostForm'
import useLoading from '@composables/useLoading'
import { getGuide, addGuide } from '@api/guide'
import { searchUser } from '@api/user'
import {
  CommentDropdown,
  PlatformDropdown,
  SourceUrlDropdown,
} from './Dropdown'
import { timestamp, parseTime, standardTime } from '@utils'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'GuideDetail',
  components: {
    // Tinymce,
    // MDinput,
    // ImageUpload,
    // Sticky,
    CommentDropdown,
    PlatformDropdown,
    SourceUrlDropdown,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const guideFormRef = ref(null)
    const guideFormData = reactive({
      status: 'draft',
      title: '',
      content: '',
      content_short: '',
      type: '',
      source_uri: '',
      image_uri: '',
      display_time: '',
      _id: undefined,
      platforms: [],
      comment_disabled: false,
      author: '',
    })

    const displayTime = ref('')
    const postLoading = ref(false)
    const userListOptions = ref([])

    const validateRequire = (text: String) => {
      return (rule: Object, value: any, callback: Function) => {
        if (value === '') {
          callback(new Error(`${text ? text : '该项'}为必填项`))
        } else {
          callback()
        }
      }
    }

    const setTagsViewTitle = () => {
      const title = '编辑文章'
      const editRoute = Object.assign({}, route, {
        title: `${title}-${guideFormData._id}`,
      })
      store.dispatch('tagsView/updateVisitedView', editRoute)
    }

    const setPageTitle = () => {
      const title = '编辑文章'
      document.title = `${title} - ${guideFormData._id}`
    }

    const getUserList = query => {
      if (!query.trim()) return
      searchUser(query)
        .then(response => {
          if (response.data.length === 0) return
          userListOptions.value = response.data.map(v => {
            return { username: v.username, _id: v._id }
          })
        })
        .catch(err => ElMessage.error(err.message))
    }

    const { postForm } = usePostForm(guideFormRef, guideFormData)

    const handlePost = (state: String) => {
      guideFormRef.value.validate((valid: Boolean) => {
        if (!valid) return ElMessage.error('请修改有误的表单项')
        if (!guideFormData.image_uri) return ElMessage.error('请上传文章主图！')
        postForm(
          addGuide,
          () => {
            //  成功回调
            postLoading.value = false
            nextTick(() => {})
          },
          (err: any) => {
            console.log(err)
            postLoading.value = false
          },
          (formData: Object) => {
            //表单上传前的数据处理
            formData.status = state
            // const timeString = parseTime(displayTime.value)
            // formData.display_time = timestamp(timeString)
            postLoading.value = true
          }
        )
      })
    }

    const getFormData = (id: String) => {
      getGuide(id)
        .then(response => {
          Object.keys(response.data).forEach(key => {
            guideFormData[key] = response.data[key]
          })
          // guideFormData.display_time = standardTime(guideFormData.display_time)
          // displayTime.value = standardTime(guideFormData.display_time)
          userListOptions.value.push(guideFormData.author)
          setTagsViewTitle()
          setPageTitle()
        })
        .catch(err => ElMessage.error(err.message))
    }
    const bodyTarget = ref(document.body)
    useLoading(bodyTarget, postLoading, '数据提交中')

    onBeforeMount(() => {
      if (props.isEdit) {
        const id = route.params && route.params.id
        getFormData(id)
      }
    })

    return {
      guideFormRef,
      guideFormData,
      guideFormRules: {
        author: [{ validator: validateRequire('作者'), trigger: 'blur' }],
        display_time: [
          { validator: validateRequire('发布时间'), trigger: 'blur' },
        ],
        type: [{ validator: validateRequire('类型'), trigger: 'blur' }],
        title: [
          {
            validator: validateRequire('标题'),
            trigger: 'blur',
          },
          {
            min: 8,
            max: 30,
            message: '输入的标题长度需在 8 到 30 个字符',
            trigger: 'blur',
          },
        ],
        content: [{ validator: validateRequire('内容'), trigger: 'blur' }],
      },
      postLoading,
      userListOptions,
      bodyTarget,
      typeOptions: ['活动大全', '攻略合集'],
      contentShortLength: computed(() => guideFormData.content_short.length),
      displayTime: computed({
        get: () => {
          if (guideFormData.display_time)
            return (displayTime.value = standardTime(
              guideFormData.display_time
            ))
        },
        set: val => {
          const timeString = parseTime(val)
          guideFormData.display_time = timestamp(timeString)
        },
      }),
      setTagsViewTitle,
      setPageTitle,
      getUserList,
      handlePost,
      getFormData,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@styles/mixin.scss';

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea :deep(textarea) {
  padding-right: 40px;
  resize: none;
  border: none;
  border-radius: 0px;
  border-bottom: 1px solid #bfcbd9;
}

.mainImg-title {
  font-size: 14px;
  color: #9e9e9e;
  span {
    color: #f56c6c;
    margin-right: 4px;
  }
}
</style>
