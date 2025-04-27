<script setup>
import { ref } from "vue";
import router from "@/router";
import { ElMessage } from "element-plus";
import { adminRegisterService, registerService } from "@/methods/register.js";

const isAdmin = ref(false);

// 注册表单
const registerForm = ref({
  username: "",
  password: "",
  nickname: "",
  gender: "男",
  age: "",
  tel: "",
});

// 表单验证规则
const formRef = ref();
const rules = {
  username: [
    { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "change" },
  ],
  password: [
    { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "change" },
  ],
  tel: [
    { min: 3, max: 11, message: "长度在 3 到 11 个字符", trigger: "change" },
  ],
  nickname: [{ min: 0, max: 16, message: "最长16位", trigger: "change" }],
  age: [
    { min: 0, max: 200, message: "年龄在 0 到 200 之间", trigger: "change" },
    { type: "number", message: "请输入数字" },
  ],
};

// 注册
const register = async () => {
  console.log(registerForm.value);

  if (isAdmin.value) {
    adminForm.value.username = registerForm.value.username;
    adminForm.value.password = registerForm.value.password;
    adminForm.value.nickname = registerForm.value.nickname;
    await adminRegisterService(adminForm.value);
  } else {
    await registerService(registerForm.value);
  }

  await router.push("/login");
  ElMessage.success({
    message: "注册成功,现在可以登录了！",
    duration: 2000,
  });
};

let isMan = ref(true);

// 管理员注册信息
const adminForm = ref({
  username: "",
  password: "",
  nickname: "",
});
</script>

<template>
  <div class="register-container">
    <!-- 新增背景装饰元素 -->
    <div class="decorative-bg">
      <div class="particle-layer"></div>
      <div class="gradient-overlay"></div>
    </div>
 
    <div class="form-wrapper">
      <div class="form-header">
        <!-- 添加动态图标 -->
        <el-icon :size="48" class="header-icon">
          <SuccessFilled />
        </el-icon>
        <h1 class="title">{{ isAdmin ? '管理员注册' : '读者注册' }}</h1>
        <p class="subtitle">2025年4月26日 农历三月廿九</p>
      </div>
 
      <!-- 表单结构保持不变 -->
    <!--用户注册表单-->
      <el-form
        ref="formRef"
        :model="registerForm"
        status-icon
        :rules="rules"
        label-width="120px"
        class="centered-form"
        title="注册"
      >
        <!--用户名-->
        <el-form-item label="用户名" prop="username" class="form-row" required>
          <el-input v-model="registerForm.username" />
        </el-form-item>
        <!--密码-->
        <el-form-item label="密码" prop="password" class="form-row" required>
          <el-input
            v-model.number="registerForm.password"
            type="password"
            show-password
          />
        </el-form-item>
        <!--电话-->
        <el-form-item
          v-if="!isAdmin"
          label="电话"
          prop="tel"
          class="form-row"
          required
        >
          <el-input v-model.number="registerForm.tel" />
        </el-form-item>
        <!--昵称-->
        <el-form-item label="昵称" prop="nickname" class="form-row">
          <el-input v-model.number="registerForm.nickname" />
        </el-form-item>
        <!--年龄-->
        <el-form-item v-if="!isAdmin" label="年龄" prop="age" class="form-row">
          <el-input v-model.number="registerForm.age" />
        </el-form-item>


        <div class="button-row">
            <!--性别-->
            <el-form-item prop="gender" class="vertical-actions">
                <div class="action-column">
                    <div class="switch-group">
                        <div class="switch-gender">
                            <el-switch
                                    v-if="!isAdmin"
                                    class="mb-2"
                                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                                    v-model="isMan"
                                    active-text="男"
                                    inactive-text="女"
                                    inline-prompt
                                    @change="registerForm.gender = isMan ? '男' : '女'"
                                    size="large"
                            />
                        </div>
                        <div class="switch-role">
                            <el-switch
                                    v-model="isAdmin"
                                    class="mb-2"
                                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #fd8250"
                                    inline-prompt
                                    active-text="管理员"
                                    inactive-text="读者"
                                    size="large"
                            />
                        </div>
                    </div>

                    <div class="button-group">
                        <el-button type="primary" @click="register">注册</el-button>
                        <el-button type="success" @click="router.push('/login')">返回</el-button>
                    </div>
                </div>


            </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
                         .register-container {
                             height: 100vh;
                             width:70vw;
                             display: flex;
                             justify-content: center;
                             align-items: center;
                             background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
                             position: relative;
                             overflow: hidden;

                             .decorative-bg {
                                 position: absolute;
                                 width: 100%;
                                 height: 100%;
                                 z-index: 0;

                                 .particle-layer {
                                     position: absolute;
                                     width: 100%;
                                     height: 100%;
                                     background-image: radial-gradient(rgba(64,158,255,0.1) 1px, transparent 0);
                                     background-size: 40px 40px;
                                     animation: particleMove 120s linear infinite;
                                 }

                                 .gradient-overlay {
                                     position: absolute;
                                     width: 150%;
                                     height: 150%;
                                     background: radial-gradient(circle at 50% 50%,
                                     rgba(102,177,255,0.08) 0%,
                                     rgba(255,255,255,0) 60%);
                                 }
                             }

                             .form-wrapper {
                                 position: relative;
                                 z-index: 1;
                                 width: 100%;
                                 max-width: 480px;
                                 padding: 0 2rem;
                                 transition: all 0.3s ease;
                             }

                             .form-header {
                                 text-align: center;
                                 margin-bottom: 3rem;
                                 animation: fadeInDown 0.6s cubic-bezier(0.22, 0.61, 0.36, 1);

                                 .header-icon {
                                     color: #409eff;
                                     margin-bottom: 1.5rem;
                                     filter: drop-shadow(0 4px 6px rgba(64,158,255,0.2));
                                 }

                                 .title {
                                     font-size: 2.4rem;
                                     color: #1f2937;
                                     margin-bottom: 0.8rem;
                                     font-weight: 700;
                                     letter-spacing: -0.025em;
                                     background: linear-gradient(45deg, #3b82f6, #60a5fa);
                                     -webkit-background-clip: text;
                                     background-clip: text;
                                     -webkit-text-fill-color: transparent;
                                 }

                                 .subtitle {
                                     color: #6b7280;
                                     font-size: 1rem;
                                     font-family: 'Courier New', monospace;
                                     letter-spacing: 1px;
                                 }
                             }

                             .auth-form {
                                 background: rgba(255,255,255,0.98);
                                 padding: 2.5rem;
                                 border-radius: 1.5rem;
                                 box-shadow:
                                         0 12px 32px rgba(0,0,0,0.05),
                                         0 0 0 1px rgba(0,0,0,0.02);
                                 backdrop-filter: blur(12px);
                                 transition: all 0.3s ease;

                                 &:hover {
                                     transform: translateY(-2px);
                                     box-shadow:
                                             0 16px 48px rgba(0,0,0,0.08),
                                             0 0 0 1px rgba(0,0,0,0.03);
                                 }
                             }

                             .el-form-item {
                                 margin-bottom: 2rem;
                                 position: relative;
                                 transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

                             // 聚焦态光效增强
                             &:focus-within {
                                 transform: translateX(6px);

                             // 动态投影联动
                             .el-input__wrapper {
                                 box-shadow:
                                         0 0 0 2px rgba(64,158,255,0.8),
                                         inset 0 4px 12px rgba(64,158,255,0.1),
                                         0 8px 24px rgba(64,158,255,0.15) !important;
                                 background: rgba(255,255,255,0.95);
                             }
                             }

                             // 输入容器增强
                             .el-input {
                                 --el-input-height: 56px;  // 提升操作热区
                             --el-input-border-radius: 16px; // 强化圆角

                             &__wrapper {
                                 border: 1px solid transparent;
                                 background: linear-gradient(white, white),
                                 linear-gradient(135deg, #e5e7eb 0%, #f3f4f6 100%);
                                 background-clip: padding-box, border-box;
                                 transition:
                                         box-shadow 0.3s ease,
                                         background 0.4s cubic-bezier(0.23, 1, 0.32, 1);

                             // 悬停态立体效果
                             &:hover {
                                 transform: translateY(-1px);
                                 background: linear-gradient(white, white),
                                 linear-gradient(135deg, #bfdbfe 0%, #dbeafe 100%);
                                 box-shadow: 0 4px 16px rgba(191,219,254,0.2);
                             }
                             }
                             }

                             // 标签动态适配
                             .el-form-item__label {
                                 transform: translateY(12px);
                                 transition: transform 0.3s ease;
                                 font-weight: 500;
                             }
                             }

                             .vertical-actions {
                                 :deep(.el-form-item__content) {
                                     width: 100%;
                                     display: flex;
                                     justify-content: center;
                                 }
                             }

                             .action-column {
                                 display: flex;
                                 flex-direction: column;
                                 align-items: center;
                                 gap: 1.5rem;
                                 width: 100%;

                                 .switch-group {
                                     display: flex;
                                     gap: 1rem;
                                     width: 100%;

                                     .el-switch {
                                         flex: 1;
                                         height: 56px;
                                         border-radius: 16px;
                                         font: 600 16px/1.5 'HarmonyOS Sans';
                                         letter-spacing: 0.8px;
                                         position: relative;
                                         overflow: hidden;
                                         transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);

                                     }
                                 }

                                 .button-group {
                                     display: flex;
                                     gap: 1rem;
                                     width: 100%;

                                     .el-button {
                                         flex: 1;
                                         height: 56px;
                                         border-radius: 16px;
                                         font: 600 16px/1.5 'HarmonyOS Sans';
                                         letter-spacing: 0.8px;
                                         position: relative;
                                         overflow: hidden;
                                         transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);

                                         &--primary {
                                             background: linear-gradient(135deg, #D6C2FF 0%, #A885F8 100%);
                                             box-shadow: 0 4px 16px rgba(168,133,248,0.2);
                                             &:hover {
                                                 box-shadow: 0 6px 24px rgba(168,133,248,0.3);
                                                 transform: translateY(-1px);
                                             }
                                         }

                                         &--success {
                                             background: linear-gradient(135deg, #7FDBB6 0%, #4CCB8F 100%);
                                             box-shadow: 0 4px 16px rgba(79,203,143,0.2);
                                             &:hover {
                                                 box-shadow: 0 6px 24px rgba(79,203,143,0.3);
                                                 transform: translateY(-1px);
                                             }
                                         }
                                     }
                                 }

                                 .role-switch {
                                     margin-top: 0.5rem;
                                     transform: scale(1.1);
                                     width: auto;

                                     :deep(.el-switch__core) {
                                         padding: 0 4px;
                                     }
                                 }
                             }
                         }

@keyframes particleMove {
    0% { background-position: 0 0; }
    100% { background-position: 1000px 500px; }
}

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 640px) {
    .register-container {
        padding: 2rem;

        .form-header .title {
            font-size: 2rem;
        }

        .auth-form {
            padding: 1.5rem;
            border-radius: 1rem;
        }

        .el-form-item {
            margin-bottom: 1.5rem;
        }
    }
}
</style>