<template>
  <div id="login-container">
    <h1 class="title">无界API</h1>
    <a-form :model="userLoginForm" name="normal_login" class="login-form" :onsubmit="login">
      <a-form-item name="userName" :rules="[{ required: true, message: '请输入账号·!' }]">
        <a-input v-model:value="userLoginForm.userName" placeholder="请输入账号">
          <template #prefix>
            <UserOutlined class="site-form-item-icon" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item
        name="userPassword"
        :rules="[
          { required: true, message: '请输入密码!' },
          { min: 8, message: '密码不能小于8位' },
        ]"
      >
        <a-input-password
          v-model:value="userLoginForm.userPassword"
          placeholder="请输入密码"
          autocomplete="on"
        >
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>

      <div class="to-register">
        没有账号？
        <RouterLink to="/user/register">去注册</RouterLink>
      </div>
      <a-form-item>
        <a-button type="primary" html-type="submit" class="login-form-button">
          登录
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { userLoginUsingPost } from '@/api/userController'
import { message } from 'ant-design-vue'
import router from '@/router'
import { useLoginUserStore } from '@/stores/user'

const userLoginForm = reactive<API.UserLoginRequest>({
  userName: '',
  userPassword: '',
})

const loginUserStore = useLoginUserStore()
const login = async () => {
  const res = await userLoginUsingPost(userLoginForm)
  if (res.data.code === 0) {
    await loginUserStore.fetchLoginUser()
    console.log('登录时', loginUserStore.loginUser)
    message.success('success')
    router.push({ path: '/', replace: true })
  }
}
</script>
<style scoped>
#login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 32px 40px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  background: white;
}

.title {
  font-size: 28px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 30px;
}

.to-register {
  margin-bottom: 24px;
  text-align: right;
  font-size: 14px;
}

.login-form :deep(.ant-input-affix-wrapper) {
  padding: 8px 11px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  transition: all 0.3s;
}

.login-form :deep(.ant-input-affix-wrapper:hover) {
  border-color: #40a9ff;
}

.login-form :deep(.ant-input) {
  font-size: 14px;
}

.login-form :deep(.ant-form-item) {
  margin-bottom: 24px;
}


.login-form-button {
  width: 100%;
  height: 40px;
  border-radius: 8px;
  font-size: 16px;
  border: none;
  transition: opacity 0.3s;
}


.login-form-button:disabled {
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  color: rgba(0, 0, 0, 0.25);
}

/* 添加响应式设计 */
@media screen and (max-width: 480px) {
  #login-container {
    margin: 40px 16px;
    padding: 24px;
  }

  .title {
    font-size: 24px;
  }
}
</style>
