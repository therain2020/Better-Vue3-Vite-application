<template>
  <el-menu v-model="activeIndex" class="el-menu-vertical-demo">
    <el-menu-item index="1" @click="route">
      <el-icon>
        <Notebook/>
      </el-icon>
      <el-button link :type="'primary'">图书信息</el-button>
    </el-menu-item>

    <el-menu-item
        v-if="!adminStore.isAdmin"
        index="2"
        @click="router.push('/borrow')"
    >
      <el-icon>
        <search/>
      </el-icon>
      <el-button link :type="'primary'">借阅记录</el-button>
    </el-menu-item>

    <el-menu-item index="3" @click="router.push('/user')">
      <el-icon>
        <User/>
      </el-icon>
      <el-button link :type="'primary'">个人信息</el-button>
    </el-menu-item>

    <el-menu-item
        v-if="adminStore.isAdmin"
        index="4"
        @click="router.push('/reader')"
    >
      <el-icon>
        <setting/>
      </el-icon>
      <el-button link :type="'primary'">用户管理</el-button>
    </el-menu-item>

    <el-menu-item index="5" @click="logout">
      <el-icon>
        <switch-button/>
      </el-icon>
      <el-button link :type="'danger'">退出登录</el-button>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import {Notebook, Search, Setting, SwitchButton, User} from "@element-plus/icons-vue";

import {ref} from "vue";

const activeIndex = ref("1");

import {useRouter} from "vue-router";
import {useTokenStore} from "@/stores/token";
import {useReaderStore} from "@/stores/reader";
import {useAdminStore} from "@/stores/admin";
import {logoutService} from "@/methods/logout.js";
import {ElMessage} from "element-plus";


const adminStore = useAdminStore();
const tokenStore = useTokenStore();
const readerStore = useReaderStore();

const router = useRouter();

const logout = async () => {
  await logoutService();
  ElMessage.success("已退出登录!")
  // 退出后清除token、reader和admin信息
  tokenStore.setToken(null);
  readerStore.clearReader();
  adminStore.clearAdmin();
  await router.push("/login");
};

const route = () => {
  if (adminStore.isAdmin) {
    router.push("/admin/book");
  } else {
    router.push("/book");
  }
};
</script>

<style lang="scss">
$primary-color: #409EFF;
$danger-color: #F56C6C;
$menu-width: 200px;
 
.el-menu-vertical-demo {
  width: $menu-width;
  min-height: 100vh;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
 
  .el-menu-item {
    height: 56px;
    margin: 4px 8px;
    border-radius: 6px;
    transition: transform 0.2s ease, background 0.3s cubic-bezier(0.4, 0, 0.2, 1);
 
    &:hover {
      transform: scale(1.02);
      background: rgba($primary-color, 0.1);
    }
 
    &.is-active {
      background: rgba($primary-color, 0.15);
      border-right: none;
      
      .el-button {
        color: darken($primary-color, 15%) !important;
      }
    }
 
    .el-icon {
      font-size: 1.3em;
      margin-right: 14px;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08));
    }
 
    .el-button {
      font-size: 15px;
      letter-spacing: 0.3px;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
      
      &[type='danger'] {
        color: lighten($danger-color, 8%) !important;
        &:hover {
          color: $danger-color !important;
        }
      }
    }
  }
 
  // 退出按钮定位优化 
  .el-menu-item:last-child {
    position: absolute;
    bottom: 20px;
    width: calc(100% - 32px);
    border-top: none;
    background: rgba($danger-color, 0.06);
    
    &:hover {
      background: rgba($danger-color, 0.12) !important;
    }
  }
}
</style>