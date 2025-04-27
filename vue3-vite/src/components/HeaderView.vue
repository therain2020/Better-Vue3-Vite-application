<script setup>
import {useDark} from "@vueuse/core";
import {useReaderStore} from "@/stores/reader.js";
import {useAdminStore} from "@/stores/admin.js";
import {ref} from "vue";
import {Link, Moon, Sunny, SwitchButton} from "@element-plus/icons-vue";
import router from "@/router/index.js";
import {logoutService} from "@/methods/logout.js";
import {ElMessage} from "element-plus";
import {useTokenStore} from "@/stores/token.js";


const adminStore = useAdminStore();
const readerStore = useReaderStore();
const tokenStore = useTokenStore();

const isAdmin = adminStore.isAdmin;

//显示名字标签
let tag = ref();
tag.value = isAdmin ? adminStore.admin.nickname : readerStore.reader.nickname;

// 切换深浅色
const isDark = useDark();

// 头像下拉菜单命令
const handleCommand = async (command) => {
  switch (command) {
      // 退出登录
    case "logout":
      await logoutService();
      ElMessage.success("已退出登录!")
      // 退出后清除token、reader和admin信息
      tokenStore.setToken(null);
      readerStore.clearReader();
      adminStore.clearAdmin();
      await router.push("/login");
      break;
      // 跳转到GitHub项目
    case "frontend":
      window.open("https://github.com/therain2020/Better-Vue3-Vite-application/tree/main");
      break;
      // 跳转到个人博客
    case "backend":
      window.open("https://github.com/therain2020/therain2020.github.io");
      break;
  }
};

// 头像图片
const url = ref("https://pic.imgdb.cn/item/65a271fe871b83018a8f9a8f.gif");
</script>

<template>
  <div class="demo-fit header-view">
    <el-menu mode="horizontal">
      <!--头像-->
      <el-dropdown @command="handleCommand">
        <el-menu-item index="1">
          <el-avatar
              @click="router.push('/user')"
              shape="square"
              :size="42"
              :fit="'cover'"
              :src="url"
          />
        </el-menu-item>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="frontend">
              <el-button link type="primary" :icon="Link">GitHub</el-button>
            </el-dropdown-item>

            <el-dropdown-item command="backend">
              <el-button link type="primary" :icon="Link">个人博客</el-button>
            </el-dropdown-item>

            <el-dropdown-item command="logout">
              <el-button link type="danger" :icon="SwitchButton"
              >退出登录
              </el-button
              >
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!--昵称标签-->
      <el-menu-item h="full">
        <el-tag type="success" size="large" round class="nickname-tag">
          {{ tag }}
        </el-tag>
      </el-menu-item>

      <el-menu-item h="full">
        <el-tag v-if="isAdmin" type="warning" size="large" round class="admin-tag">
          管理员
        </el-tag>
        <el-tag v-else size="large" round class="reader-tag"> 读者</el-tag>
      </el-menu-item>

<!--&lt;!&ndash;深浅色图标&ndash;&gt;-->
<!--<el-menu-item>-->
<!--    <el-switch-->
<!--            v-model="isDark"-->
<!--            size="large"-->
<!--            :active-action-icon="Moon"-->
<!--            :inactive-action-icon="Sunny"-->
<!--            style="-->
<!--            &#45;&#45;el-switch-on-color: rgba(19, 206, 102, 0.7);-->
<!--            &#45;&#45;el-switch-off-color: rgb(74,163,252);-->
<!--          "-->
<!--    />-->
<!--</el-menu-item>-->
    </el-menu>
  </div>
</template>

<style lang="scss" scoped>
$header-bg: linear-gradient(145deg, #f8faff, #ffffff);
$hover-glow: 0 0 12px rgba(64, 158, 255, 0.15);
$transition-fast: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
// 新增渐变标签系统 
$success-gradient: linear-gradient(135deg, 
  #34d399 0%,    // 翠绿色 
  #10b981 25%, 
  #059669 50%, 
  #047857 75%, 
  #065f46 100%
);
 
$info-gradient: linear-gradient(135deg,
  #60a5fa 0%,    // 天空蓝 
  #3b82f6 25%,
  #2563eb 50%,
  #1d4ed8 75%,
  #1e40af 100%
);
 
$danger-gradient: linear-gradient(135deg,
  #ef4444 0%,    // 烈焰红 
  #dc2626 25%,
  #b91c1c 50%,
  #991b1b 75%,
  #7f1d1d 100%
);
.demo-fit.header-view  {
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  background: $header-bg;
  backdrop-filter: blur(8px);
  border-radius: 0 0 1rem 1rem;
  overflow: hidden;
 
  .el-menu {
    padding: 0 2rem;
    background: transparent;
    border: none;
    
    &-item {
      margin: 0 0.8rem;
      transition: $transition-fast !important;
      border-radius: 0.8rem;
      
      &:hover {
        background: rgba(64, 158, 255, 0.08) !important;
        transform: translateY(-1px);
      }
 
      // 头像容器特殊处理 
      &:first-child {
        padding: 0.5rem !important;
        border-radius: 50%;
        transition: transform 0.3s ease;
 
        &:hover {
          transform: scale(1.05);
          box-shadow: $hover-glow;
        }
      }
    }
  }
 
  .el-avatar {
    border: 2px solid rgba(255, 255, 255, 0.9);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: $transition-fast;
 
    &:hover {
      transform: rotate(8deg) scale(1.05);
      box-shadow: $hover-glow;
    }
  }
 
  // 昵称标签（渐变绿）
  .nickname-tag {
    background-image: $success-gradient !important;
    color: white !important;
    text-shadow: 0 2px 4px rgba(0, 75, 50, 0.3);
    border: 1px solid rgba(5, 150, 105, 0.3);
    box-shadow: 
      0 2px 6px rgba(5, 150, 105, 0.2),
      inset 0 1px 2px rgba(255, 255, 255, 0.1);
  }
  
  // 读者标签（渐变蓝）
  .reader-tag {
    background-image: $info-gradient !important;
    color: white !important;
    text-shadow: 0 2px 4px rgba(0, 50, 150, 0.3);
    border: 1px solid rgba(37, 99, 235, 0.3);
    box-shadow: 
      0 2px 6px rgba(37, 99, 235, 0.2),
      inset 0 1px 2px rgba(255, 255, 255, 0.1);
  }
  
  // 管理员标签（渐变红）
  .admin-tag {
    background-image: $danger-gradient !important;
    color: white !important;
    text-shadow: 0 2px 4px rgba(150, 0, 0, 0.3);
    border: 1px solid rgba(220, 38, 38, 0.3);
    box-shadow: 
      0 2px 6px rgba(220, 38, 38, 0.2),
      inset 0 1px 2px rgba(255, 255, 255, 0.1);
  }
  
  // 保留原有过渡和响应式设置 
  .el-tag {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    
    &:hover {
      transform: translateY(-2px);
      filter: brightness(1.1);
      box-shadow: 
        0 4px 12px rgba(0, 0, 0, 0.15),
        inset 0 2px 4px rgba(255, 255, 255, 0.2) !important;
    }
  }
  
    .el-dropdown-menu {
      border-radius: 0.8rem;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      
      &__item {
        padding: 0.8rem 1.2rem;
        transition: $transition-fast;
        
        &:hover {
          background: rgba(64, 158, 255, 0.08);
        }
      }
    }
 
  .el-switch {
    --el-switch-border-color: transparent;
    
    &__core {
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
      
      .el-icon {
        transition: transform 0.3s ease;
      }
    }
    
    &.is-checked .el-icon {
      transform: rotate(15deg);
    }
  }
}
 
// 响应式处理 
@media (max-width: 768px) {
  .demo-fit.header-view  {
    .el-menu {
      padding: 0 1rem;
      flex-wrap: nowrap;
      
      &-item {
        margin: 0 0.4rem;
        
        &:first-child {
          margin-right: 0.2rem;
        }
      }
    }
 
    .el-tag {
      font-size: 0.85rem;
      padding: 0 0.8rem;
    }
 
    .el-switch {
      transform: scale(0.9);
    }
  }
}
 
@media (max-width: 480px) {
  .demo-fit.header-view  {
    .el-menu-item:not(:first-child) {
      display: none;
    }
  }
}
</style>