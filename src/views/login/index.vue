<template>
  <div class="login-container">
    <div class="login-box">
      <div class="title-container">
        <h3 class="title">欢迎登录动森管理系统</h3>
      </div>
      <el-card :body-style="loginCard">
        <el-tabs v-model="activeTab" class="login-tabs">
          <el-tab-pane label="账号密码登录" name="first">
            <el-form
              ref="loginFormRef"
              :model="loginFormData"
              :rules="loginFormRules"
              class="login-form"
              label-position="left"
            >
              <el-form-item prop="username" required>
                <el-input
                  ref="usernameRef"
                  v-model="loginFormData.username"
                  placeholder="Username"
                  name="username"
                  type="text"
                  autocomplete="on"
                >
                  <template #prefix>
                    <span class="svg-container">
                      <svg-icon icon-class="user" />
                    </span>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item prop="password" required>
                <el-input
                  ref="passwordRef"
                  v-model="loginFormData.password"
                  :type="passwordType"
                  placeholder="Password"
                  name="password"
                  @keyup.enter.native="handleLogin"
                >
                  <template #prefix>
                    <span class="svg-container">
                      <svg-icon icon-class="password" />
                    </span>
                  </template>
                  <template #suffix>
                    <span class="show-pwd" @click="showPwd">
                      <svg-icon
                        :icon-class="
                          passwordType === 'password' ? 'eye' : 'eye-open'
                        "
                      />
                    </span>
                  </template>
                </el-input>
              </el-form-item>
              <el-button
                :loading="isLoading"
                type="primary"
                style="width: 100%; font-size: 16px"
                @click.native.prevent="handleLogin"
                >登录</el-button
              >
              <div class="agree-text">
                <el-checkbox v-model="agree" label="" size="large" />我同意<a
                  href=""
                  >服务协议</a
                >、 <a href="">隐私政策和</a>和<a href="">儿童保护协议</a>
              </div>

              <div class="tips">测试账号：</div>
              <div class="tips">
                <span style="margin-right: 20px">普通用户</span>
                <span style="margin-right: 20px"> user: test001</span>
                <span> password: iwnini456456</span>
              </div>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="验证码登录" name="second">
            <el-form
              :model="phoneFormData"
              class="login-form"
              label-width="0px"
            >
              <el-form-item>
                <el-input
                  v-model="phoneFormData.phone"
                  placeholder="请输入手机号码"
                  class="input-with-select"
                >
                  <template #prepend>
                    <el-select v-model="numFront" disabled style="width: 115px">
                      <el-option label="+86" value="+86" />
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="phoneFormData.yzm"
                  placeholder="请输入短信验证码"
                  class="input-with-select"
                >
                  <template #prefix>
                    <span class="svg-container">
                      <svg-icon icon-class="msg" />
                    </span>
                    <!-- <el-icon class="el-input__icon"><search /></el-icon> -->
                  </template>
                  <template #append>
                    <el-button style="width: 115px" @click="sendMsg"
                      >发送</el-button
                    >
                  </template>
                </el-input>
              </el-form-item>
              <el-button
                :loading="isLoading"
                type="primary"
                style="width: 100%; margin-bottom: 30px; font-size: 16px"
                >登录</el-button
              >
              <div class="tips">
                <span>验证码只做了测试接口，只有我自己的号码可以发送😂</span>
              </div>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
// import { validUsername } from '@utils/validate'
import { defineComponent, nextTick, reactive, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { sendMessage } from '@api/user'
import { validPhoneNumber } from '@utils/validate'

export default defineComponent({
  name: 'Login',
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const activeTab = ref('first')

    const loginFormRef = ref(null)
    const loginFormData = reactive({
      username: 'aizawasayo',
      password: 'iwnini123123',
    })

    const phoneFormData = reactive({
      phone: '18668****11',
      yzm: '',
    })
    const isLoading = ref(false)
    const redirect = ref(undefined)

    const usernameRef = ref(null)
    const passwordRef = ref(null)
    const passwordType = ref('password')
    const agree = ref(false)

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
          if (!agree.value) {
            return ElMessage.error('必须同意用户协议！')
          }
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

    const sendMsg = () => {
      if (validPhoneNumber(phoneFormData.phone)) {
        sendMessage({ phone: phoneFormData.phone })
          .then(res => {
            ElMessage.success('发送成功！')
          })
          .catch(err => {
            ElMessage.error(err.message)
          })
      } else {
        ElMessage.error('请先输入正确的手机号码')
      }
    }
    const loginCard = { padding: '25px 35px' }

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
      agree,
      handleLogin,
      phoneFormData,
      activeTab,
      numFront: '+86',
      sendMsg,
      loginCard,
    }
  },
})
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bgBlack: #283443;

@supports (-webkit-mask: none) and (not (cater-color: $white)) {
  .login-container .el-input input {
    color: $white;
    font-size: 16px;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    // display: inline-block;
    height: 47px;

    // width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $white;
      height: 47px;
      caret-color: $white;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bgBlack inset !important;
        -webkit-text-fill-color: $white !important;
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
.login-container {
  min-height: 100%;
  width: 100%;
  // background-color: $bgBlack;
  background-image: url(@/assets/images/login/bangqiaoyan-feng.jpg);
  background-size: cover;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  .login-box {
    width: 450px;
  }
  .el-card {
    background-color: rgba(255, 255, 255, 0.15);
    border: 0;
    border-radius: 10px;
  }
  :deep(.el-tabs__item) {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    font-weight: 700;
    color: $white;
    &.is-active {
      color: $panGreen;
    }
  }
  .login-form {
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    overflow: hidden;

    .el-input--prefix :deep(.el-input__inner) {
      padding-left: 50px;
    }
  }

  .tips {
    font-size: 14px;
    color: $white;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    color: $lightGrey;
    vertical-align: middle;
    margin-left: 20px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $lightGrey;
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
    color: $lightGrey;
    cursor: pointer;
    user-select: none;
  }
  .agree-text {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    font-size: 14px;
    color: $white;
    .el-checkbox {
      margin-right: 10px;
    }
    a {
      color: $panGreen;
      font-weight: bold;
    }
  }
}
</style>
