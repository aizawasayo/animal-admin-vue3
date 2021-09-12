<template>
  <div class="createPost-container">
    <el-form
      ref="postForm"
      :model="postForm"
      :rules="rules"
      class="form-container"
    >
      <sticky :z-index="10" :class-name="'sub-navbar ' + postForm.status">
        <CommentDropdown v-model="postForm.comment_disabled" />
        <PlatformDropdown v-model="postForm.platforms" />
        <SourceUrlDropdown v-model="postForm.source_uri" />
        <el-button
          v-loading="loading"
          style="margin-left: 10px"
          type="success"
          @click="submitForm('published')"
          >发布</el-button
        >
        <el-button
          v-loading="loading"
          type="warning"
          @click="submitForm('draft')"
          >存草稿</el-button
        >
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px" prop="title">
              <MDinput
                v-model="postForm.title"
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
                      v-model="postForm.author"
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
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="10">
                  <el-form-item
                    label-width="120px"
                    label="发布时间:"
                    class="postInfo-container-item"
                  >
                    <el-date-picker
                      v-model="displayTime"
                      type="datetime"
                      format="yyyy-MM-dd HH:mm:ss"
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
                    <el-select v-model="postForm.type" filterable>
                      <el-option
                        v-for="(item, index) in typeOptions"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="6">
                  <el-form-item label-width="90px" label="级别:" class="postInfo-container-item">
                    <el-rate
                      v-model="postForm.importance"
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
            v-model="postForm.content_short"
            :rows="1"
            type="textarea"
            class="article-textarea"
            autosize
            placeholder="请输入内容"
          />
          <span v-show="contentShortLength" class="word-counter"
            >{{ contentShortLength }}words</span
          >
        </el-form-item>

        <el-form-item prop="content" style="margin-bottom: 30px">
          <Tinymce ref="editor" v-model="postForm.content" :height="400" />
        </el-form-item>
        <h4 class="mainImg-title"><span>*</span>文章主图</h4>
        <el-form-item prop="image_uri" style="margin-bottom: 30px">
          <Upload v-model="postForm.image_uri" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@components/Tinymce'
import Upload from '@components/Upload/SingleImage3'
import MDinput from '@components/MDinput'
import Sticky from '@components/Sticky'
import { getGuide, addGuide } from '@api/guide'
import { searchUser } from '@api/user'
import {
  CommentDropdown,
  PlatformDropdown,
  SourceUrlDropdown,
} from './Dropdown'
import { timestamp, parseTime } from '@utils'

const defaultForm = {
  status: 'draft',
  title: '',
  content: '',
  content_short: '',
  type: '',
  source_uri: '',
  image_uri: '',
  display_time: undefined,
  _id: undefined,
  platforms: [],
  comment_disabled: false,
  author: { username: '', _id: '' },
}

export default {
  name: 'GuideDetail',
  components: {
    Tinymce,
    MDinput,
    Upload,
    Sticky,
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
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message.error(rule.field + '为必传项')
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      typeOptions: ['活动大全', '攻略合集'],
      rules: {
        image_uri: [{ validator: validateRequire }],
        author: [{ validator: validateRequire }],
        type: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
      },
      tempRoute: {},
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length
    },
    displayTime: {
      get() {
        return +new Date(this.postForm.display_time)
      },
      set(val) {
        this.postForm.display_time = new Date(val)
      },
    },
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }

    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      getGuide(id)
        .then(response => {
          this.postForm = response.data
          this.userListOptions.push(this.postForm.author)
          this.setTagsViewTitle()

          this.setPageTitle()
        })
        .catch(err => this.$message.error(err.message))
    },
    setTagsViewTitle() {
      const title = '编辑文章'
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.postForm._id}`,
      })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '编辑文章'
      document.title = `${title} - ${this.postForm._id}`
    },
    submitForm(state) {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.postForm.status = state
          const timeString = parseTime(this.postForm.display_time)
          this.postForm.display_time = timestamp(timeString)
          this.loading = true
          addGuide(this.postForm)
            .then(res => {
              this.$notify({
                title: '成功',
                message: res.message,
                type: 'success',
                duration: 2000,
              })
              this.loading = false
            })
            .catch(err => this.$message.error(err.message))
        } else {
          this.$message.error('请填写必要的标题和内容')
          return false
        }
      })
    },
    getUserList(query) {
      if (!query.trim()) return
      searchUser(query)
        .then(response => {
          if (response.data.length === 0) return
          this.userListOptions = response.data.map(v => {
            return { username: v.username, _id: v._id }
          })
        })
        .catch(err => this.$message.error(err.message))
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@styles/mixin.scss';

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
