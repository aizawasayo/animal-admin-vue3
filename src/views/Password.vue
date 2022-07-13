<template>
  <div class="form-container">
    <el-form
      class="password-form"
      ref="passwordFormRef"
      :model="passwordFormData"
      :rules="passwordFormRules"
      label-position="left"
      label-width="100px"
    >
      <el-form-item label="原密码" prop="password">
        <el-input
          ref="passwordRef"
          v-model="passwordFormData.password"
          placeholder="请输入密码"
          name="password"
          show-password
        >
          <template #prefix>
            <span class="svg-container">
              <svg-icon icon-class="lock" />
            </span>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="确认原密码" prop="oldPsw">
        <el-input
          ref="passwordRef"
          v-model="passwordFormData.oldPsw"
          placeholder="确认原密码"
          name="oldPsw"
          show-password
        >
          <template #prefix>
            <span class="svg-container">
              <svg-icon icon-class="lock" />
            </span>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPsw">
        <el-input
          ref="passwordRef"
          v-model="passwordFormData.newPsw"
          placeholder="请输入新密码"
          name="newPsw"
          tabindex="2"
          auto-complete="on"
          show-password
        >
          <template #prefix>
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
          </template>
        </el-input>
      </el-form-item>
      <el-button
        :loading="isLoading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleSubmit"
        >登录</el-button
      >
    </el-form>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { modifyPsw } from '@api/user'
import { ElMessage } from 'element-plus'

export default {
  setup() {
    const isLoading = ref(false)
    const passwordFormRef = ref(null)
    const passwordFormData = reactive({
      password: '',
      oldPsw: '',
      newPsw: '',
    })

    const store = useStore()
    const userId = computed(() => store.getters.userId)

    const handleSubmit = () => {
      passwordFormRef.value.validate(valid => {
        if (valid) {
          isLoading.value = true
          modifyPsw(userId.value, passwordFormData)
            .then(res => {
              ElMessage.success(res.message)
              passwordFormRef.value.resetFields()
              isLoading.value = false
            })
            .catch(err => {
              ElMessage.error(err.message)
              isLoading.value = false
            })
        } else {
          return false
        }
      })
    }

    const validateUser = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请密码填写完整！'))
      } else if (rule.field === ('oldPsw' || 'password')) {
        if (
          passwordFormData.password &&
          passwordFormData.oldPsw &&
          passwordFormData.oldPsw !== passwordFormData.password
        ) {
          callback(new Error('两次密码输入不一致！'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }

    return {
      passwordFormRef,
      passwordFormData,
      passwordFormRules: {
        password: [
          { required: true, trigger: 'blur', validator: validateUser },
        ],
        oldPsw: [{ required: true, trigger: 'blur', validator: validateUser }],
        newPsw: [{ required: true, trigger: 'blur', validator: validateUser }],
      },
      isLoading,
      handleSubmit,
    }
  },
}
</script>

<style lang="scss" scoped>
.form-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: absolute;
  .password-form {
    width: 400px;
    .el-input--prefix :deep(.el-input__inner) {
      padding-left: 40px;
    }
  }
  .svg-container {
    margin-left: 10px;
  }
}
</style>
