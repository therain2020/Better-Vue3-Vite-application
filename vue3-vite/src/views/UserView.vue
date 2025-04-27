<script setup>
import { useReaderStore } from "@/stores/reader.js";
import { ref } from "vue";
import router from "@/router/index.js";
import { updateReaderService } from "@/methods/reader.js";
import { ElMessage } from "element-plus";
import HeaderView from "@/components/HeaderView.vue";
import { useAdminStore } from "@/stores/admin.js";
import { updateAdminService } from "@/methods/admin.js";

const adminStore = useAdminStore();
const isAdmin = adminStore.isAdmin;
const admin = adminStore.admin;
const readerStore = useReaderStore();

let reader;
let isMan;

if (!isAdmin) {
  reader = readerStore.reader;
  isMan = ref(reader.gender === "男");
}

const saveReader = async () => {
  await updateReaderService(reader);
  router.push("/book");
  ElMessage.success("已保存");
};

const updateAdmin = async () => {
  console.log(admin);
  await updateAdminService(admin);
  ElMessage.success("已保存");
  router.push("/book");
};
</script>


<template>
    <el-container>
        <el-aside width="200px">
            <!--<side-view/>-->
        </el-aside>
        <el-container>
            <el-header>
                <header-view />
            </el-header>
            <el-main>
                <!-- 读者信息表单 -->
                <el-form
                        v-if="!isAdmin"
                        ref="ruleFormRef"
                        :model="reader"
                        status-icon
                        label-width="120px"
                        class="enhanced-form"
                        label-position="right"
                >
                    <div class="form-header">
                        <el-text class="form-title">个人信息</el-text>
                        <el-divider />
                    </div>

                    <el-form-item label="用户名" class="form-row">
                        <el-input
                                v-model="reader.username"
                                disabled
                                class="custom-input"
                                placeholder="请输入用户名"/>
                    </el-form-item>

                    <el-form-item label="密码" class="form-row">
                        <el-input
                                v-model="reader.password"
                                show-password
                                class="custom-input"
                                placeholder="6-16位字母数字组合"/>
                    </el-form-item>

                    <el-form-item label="昵称" class="form-row">
                        <el-input
                                v-model="reader.nickname"
                                class="custom-input"
                                placeholder="请输入昵称"/>
                    </el-form-item>

                    <el-form-item label="年龄" class="form-row">
                        <el-input-number
                                v-model="reader.age"
                                :min="1"
                                :max="120"
                                controls-position="right"/>
                    </el-form-item>

                    <el-form-item label="电话" class="form-row">
                        <el-input
                                v-model="reader.tel"
                                class="custom-input"
                                placeholder="11位手机号码"/>
                    </el-form-item>

                    <el-form-item label="性别" class="form-row">
                        <el-switch
                                v-model="isMan"
                                class="gender-switch"
                                style=" 
                --el-switch-on-color: #409eff;
                --el-switch-off-color: #f56c6c;
              "
                                inline-prompt
                                active-text="♂"
                                inactive-text="♀"
                                @change="reader.gender  = isMan ? '男' : '女'"
                        />
                    </el-form-item>

                    <el-form-item class="action-buttons">
                        <el-button
                                type="primary"
                                @click="saveReader"
                                class="submit-btn">
                            保存更改
                        </el-button>
                        <el-button
                                type="info"
                                @click="router.push('/book')"
                                class="cancel-btn">
                            返回首页
                        </el-button>
                    </el-form-item>
                </el-form>

                <!-- 管理员信息表单 -->
                <el-form
                        v-if="isAdmin"
                        ref="ruleFormRef"
                        :model="admin"
                        status-icon
                        label-width="120px"
                        class="enhanced-form"
                >
                    <div class="form-header">
                        <el-text class="form-title">管理员信息</el-text>
                        <el-divider />
                    </div>

                    <el-form-item label="昵称" class="form-row">
                        <el-input
                                v-model="admin.nickname"
                                class="custom-input"
                                placeholder="管理员昵称"/>
                    </el-form-item>

                    <el-form-item label="密码" class="form-row">
                        <el-input
                                v-model="admin.password"
                                show-password
                                class="custom-input"
                                placeholder="输入新密码"/>
                    </el-form-item>

                    <el-form-item class="action-buttons">
                        <el-button
                                type="primary"
                                @click="updateAdmin"
                                class="submit-btn">
                            更新信息
                        </el-button>
                        <el-button
                                type="info"
                                @click="router.push('/admin/book')"
                                class="cancel-btn">
                            管理首页
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-main>
        </el-container>
    </el-container>
</template>

<style lang="scss" scoped>
$form-bg: linear-gradient(145deg, #f8faff, #ffffff);
$primary-shadow: 0 12px 28px rgba(89, 107, 158, 0.08);
$input-focus-glow: 0 0 8px rgba(64, 158, 255, 0.2);
$transition-fast: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
 
.el-container {
  background: #f0f4fa;
  min-height: 100vh;
  width:70vw;
  
  .el-main {
    padding: 2rem 4rem;
  }
}
 
.enhanced-form {
  position: relative;
  max-width: 720px;
  margin: 1.5rem auto;
  padding: 2.5rem;
  background: $form-bg;
  border-radius: 1.25rem;
  box-shadow: $primary-shadow;
  transition: transform 0.3s ease;
 
  &:hover {
    transform: translateY(-2px);
  }
 
  .form-header {
    margin-bottom: 2rem;
    position: relative;
 
    .form-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--el-color-primary);
      text-shadow: 0 2px 4px rgba(64, 158, 255, 0.1);
      letter-spacing: -0.5px;
    }
 
    .el-divider {
      margin: 1.25rem 0;
      background-color: var(--el-border-color-light);
    }
  }
 
  .form-row {
    margin-bottom: 1.75rem;
    transition: $transition-fast;
 
    &:hover :deep(.el-form-item__label) {
      color: var(--el-color-primary);
    }
 
    :deep(.custom-input) {
      --el-input-height: 48px;
      --el-input-border-radius: 10px;
      --el-input-bg-color: rgba(248, 250, 252, 0.8);
      --el-input-border-color: #e2e8f0;
      transition: $transition-fast;
 
      .el-input__inner {
        font-size: 0.95rem;
        padding: 0.875rem 1.25rem;
        
        &::placeholder {
          color: #94a3b8;
        }
 
        &:focus {
          box-shadow: $input-focus-glow;
          background-color: #ffffff;
        }
      }
 
      &:hover .el-input__inner {
        border-color: var(--el-color-primary-light-5);
      }
    }
 
    .el-input-number {
      width: 100%;
      box-shadow: inset 0 2px 4px rgba(203, 213, 225, 0.1);
    }
  }
 
  .gender-switch {
    transform: scale(1.4);
    margin: 0.75rem 0;
    
    :deep(.el-switch__core) {
      border-radius: 12px;
    }
  }
 
  .action-buttons {
    margin-top: 2.5rem;
    gap: 1.25rem;
 
    .submit-btn {
      padding: 0.875rem 2rem;
      border-radius: 10px;
      font-weight: 600;
      letter-spacing: 0.5px;
      background: linear-gradient(145deg,rgb(193, 237, 92),rgb(238, 23, 227));
      border: none;
      transition: $transition-fast;
 
      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
      }
    }
 
    .cancel-btn {
      padding: 0.875rem 2rem;
      border-radius: 10px;
      background: linear-gradient(145deg,rgb(237, 92, 92),rgb(23, 184, 238));
      border: 1px solid var(--el-border-color-light);
      box-shadow: 0 2px 6px rgba(148, 163, 184, 0.08);
      transition: $transition-fast;
 
      &:hover {
        transform: translateY(-1px);
        border-color: var(--el-color-primary-light-5);
      }
    }
  }
}
 
@media (max-width: 768px) {
  .el-main {
    padding: 1rem !important;
  }
  
  .enhanced-form {
    padding: 1.5rem;
    border-radius: 1rem;
    
    .form-title {
      font-size: 1.5rem;
    }
    
    .form-row {
      margin-bottom: 1.25rem;
    }
  }
}
</style>

