<!-- 登录 -->
<script setup lang="ts">
import { ref, reactive, toRefs } from 'vue';
import { isUsername, isPassword } from '@/utils/validate';
import { useAuthStore } from '@/stores/auth';
import { useRouter, useRoute } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const formRef = ref();

const state = reactive({
  loading: false,
  isRemember: false, // 记住密码
  loginData: {
    username: '',
    password: '',
  } as LoginData
});

const { loading, isRemember, loginData} = { ...toRefs(state) };

function checkUsername(rule: any, value: string, callback: Function) {
  if (!value) {
    return callback(new Error('请输入有效帐号/手机号'));
  }
  if (!isUsername(value)) {
    return callback(new Error('输入的格式不正确，请重新输入'));
  }
  return callback();
}

function checkPassword(rule: any, value: string, callback: Function) {
  if (!value) {
    return callback(new Error('请输入有效密码'));
  }
  if (!isPassword(value)) {
    return callback(new Error('密码输入错误，请重新输入'));
  }
  return callback();
}

// 提交登录表单
function submitForm() {
  // 如果在登录中, 不允许重复登录
  if (state.loading) return;
  formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return false;
    try {
      // 登录中
      state.loading = true;
      // 记住密码
      authStore.setRememberPwd(state.isRemember ? state.loginData : undefined);
      // 发送登录请求
      await authStore.userLogin(state.loginData);
      // 跳转来源地址
      const redirectQuery = route.query?.redirect;
      const redirectRaw = redirectQuery ? decodeURIComponent(String(redirectQuery)) : '/';
      const redirectPath = redirectRaw.startsWith('/') ? redirectRaw : `/${redirectRaw}`;
      router.replace(redirectPath);
    } catch (error) {
    } finally {
      setTimeout(() => {
        state.loading = false; // 提交完
      }, 300);
    }
  });
}
</script>

<template>
  <div class="login-container">
    <div class="login-wrap">
      <img class="login-logo" src="@/assets/logo.png">
      <div class="login-title">账号登录</div>
      
      <el-form class="login-form" ref="formRef" :model="loginData" size="large">
        <el-form-item 
          prop="username" 
          :rules="{ required: true, validator: checkUsername, trigger: 'blur' }"
        >
          <el-input 
            v-model.trim="loginData.username" 
            placeholder="请输入账号/手机号"
            maxlength="30" 
            type="text" 
            prefix-icon="ele-User" 
            clearable
          />
        </el-form-item>

        <el-form-item 
          prop="password" 
          :rules="{ required: true, validator: checkPassword, trigger: 'blur' }"
        >
          <el-input 
            v-model.trim="loginData.password" 
            placeholder="请输入密码"
            maxlength="30" 
            type="password" 
            prefix-icon="ele-Unlock" 
            show-password
          />
        </el-form-item>

        <el-form-item>
          <div class="login-other">
            <el-checkbox v-model="isRemember"><span>记住密码</span></el-checkbox>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button 
            class="login-submit" 
            @click="submitForm()" 
            :loading="loading" 
            native-type="submit" 
            type="primary"
          >登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-image: url(@/assets/bac.jpg);
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;

  .login-wrap {
    width: 410px;
    height: 460px;
    margin: auto;
    margin-right: 130px;
    padding: 30px;
    background-color: #ffffffff;
    border-radius: 10px;
    box-shadow: #74747462 0px 2px 15px;

    .login-logo {
      max-width: 130px;
      display: flex;
      margin: auto;
    }

    .login-title {
      color: #0d1243;
      text-align: left;
      font-weight: 500;
      font-size: 20px;
      letter-spacing: 2px;
      line-height: 70px;
      height: 70px;
    }

    .login-form {
      .el-form-item {
        margin-bottom: 26px;
      }

      .login-other {
        span {
          color: #999;
          font-size: 13px;
          cursor: pointer;
          font-weight: 500;
        }
      }

      .login-submit {
        width: 100%;
        height: 40px;
        letter-spacing: 2px;
        font-weight: 500;
      }
    }
  }
}
</style>