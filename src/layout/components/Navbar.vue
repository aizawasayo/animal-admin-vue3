<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <el-tooltip content="布局大小" placement="bottom">
          <size-select class="right-menu-item hover-effect" />
        </el-tooltip>
        <screenfull class="right-menu-item hover-effect" />
      </template>
      <div class="right-menu-item">
        <el-divider
          direction="vertical"
          class="right-menu-divider"
        ></el-divider>
      </div>
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
        placement="bottom-start"
      >
        <div class="avatar-wrapper">
          <img
            :src="realUrl + avatar + '?imageView2/1/w/80/h/80'"
            class="user-avatar"
          />
          <el-icon :size="14" style="margin: 0 6px">
            <caret-bottom />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu class="user-dropdown">
            <router-link to="/">
              <el-dropdown-item> 主页 </el-dropdown-item>
            </router-link>
            <el-dropdown-item divided @click.native="logout">
              <span style="display: block">登出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { CaretBottom } from '@element-plus/icons'

export default {
  name: 'Navbar',
  components: {
    CaretBottom,
  },
  inject: ['realUrl'],
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const logout = async () => {
      await store.dispatch('user/logout')
      ElMessage.success('登出成功')
      router.push(`/login?redirect=${route.fullPath}`)
    }
    return {
      sidebar: computed(() => store.getters.sidebar),
      avatar: computed(() => store.getters.avatar),
      device: computed(() => store.getters.device),
      toggleSideBar: () => store.dispatch('app/toggleSideBar'),
      logout,
    }
  },
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    margin-right: 15px;
    line-height: 50px;

    &:focus {
      outline: none;
    }
    .right-menu-divider {
      height: 22px;
      margin: 0 4px;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }
    .right-menu-item :deep(.svg-icon) {
      font-size: 18px;
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
