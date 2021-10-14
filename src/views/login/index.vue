<template>
  <div class="login-container">
    <el-form
      ref="loginFormRef"
      :model="loginFormData"
      :rules="loginFormRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">欢迎登录</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="usernameRef"
          v-model="loginFormData.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          ref="passwordRef"
          v-model="loginFormData.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>
      <el-button
        :loading="isLoading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
        >登录</el-button
      >

      <!-- <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: any</span>
      </div> -->
    </el-form>
  </div>
</template>

<script>
// import { validUsername } from '@utils/validate'
import { defineComponent, nextTick, reactive, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'Login',
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    const loginFormRef = ref(null)
    const loginFormData = reactive({
      username: 'aizawasayo',
      password: 'iwnini122900',
    })
    const isLoading = ref(false)
    const redirect = ref(undefined)

    const usernameRef = ref(null)
    const passwordRef = ref(null)
    const passwordType = ref('password')

    const showPwd = () => {
      if (passwordType.value === 'password') {
        passwordType.value = ''
      } else {
        passwordType.value = 'password'
      }
      nextTick(() => {
        passwordRef.value.focus()
      })
    }

    const handleLogin = () => {
      loginFormRef.value.validate(valid => {
        if (valid) {
          isLoading.value = true
          store
            .dispatch('user/login', loginFormData)
            .then(res => {
              if (res.user.roles.includes('admin')) {
                router.push({ path: redirect.value || '/' })
              } else {
                // 普通用户去首页
                router.push({ path: '/' })
              }

              isLoading.value = false
            })
            .catch(err => {
              ElMessage.error(err.message)
              isLoading.value = false
            })
        } else {
          console.log('输入的登录信息有误!!')
          return false
        }
      })
    }

    watch(
      () => route.query,
      val => {
        redirect.value = route.query && route.query.redirect
      },
      { immediate: true }
    )

    const validateUser = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请将用户名和密码填写完整！'))
      } else {
        callback()
      }
    }

    return {
      loginFormRef,
      loginFormData,
      loginFormRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUser },
        ],
        password: [
          { required: true, trigger: 'blur', validator: validateUser },
        ],
      },
      isLoading,
      passwordType,
      usernameRef,
      passwordRef,
      redirect,
      showPwd,
      handleLogin,
    }
  },
})
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
