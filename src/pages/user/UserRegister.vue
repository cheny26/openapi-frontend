<template>
  <div id="register-container">
    <h1 class="title">无界API</h1>
    <a-form :model="userRegisterForm" name="norm_register" class="register-form" :onsubmit="register">
      <a-form-item name="userName" :rules="[{ required: true, message: '请输入账号·!' }]">
        <a-input v-model:value="userRegisterForm.userName" placeholder="请输入账号">
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
        <a-input-password v-model:value="userRegisterForm.userPassword" placeholder="请输入密码" autocomplete="on">
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item
        name="checkPassword"
        :rules="[
          { required: true, message: '请再次输入密码!' },
          { min: 8, message: '密码不能小于8位' },
        ]"
      >
        <a-input-password v-model:value="userRegisterForm.checkPassword" placeholder="请再次输入密码" autocomplete="on">
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>

      <div class="to-login">
        有账号？
        <RouterLink to="/user/login">去登录</RouterLink>
      </div>
      <a-form-item>
        <a-button  type="primary" html-type="submit" class="register-form-button">
          注册
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
import { reactive} from 'vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import {  userRegisterUsingPost } from '@/api/userController'
import { message } from 'ant-design-vue'
import router from '@/router'

const userRegisterForm = reactive<API.UserRegisterRequest>({
  userName: '',
  userPassword: '',
  checkPassword:'',
})


const register = async () => {
  const res = await userRegisterUsingPost(userRegisterForm)
  if (res.data.code === 0) {
    message.success('success')
    router.push({path:'/user/login',replace:true})
  }
}
</script>
<style scoped>
#register-container {
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

.to-login {
  margin-bottom: 24px;
  text-align: right;
  font-size: 14px;
}

.register-form :deep(.ant-input-affix-wrapper) {
  padding: 8px 11px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  transition: all 0.3s;
}

.register-form :deep(.ant-input-affix-wrapper:hover) {
  border-color: #40a9ff;
}

.register-form :deep(.ant-input) {
  font-size: 14px;
}

.register-form :deep(.ant-form-item) {
  margin-bottom: 24px;
}


.register-form-button {
  width: 100%;
  height: 40px;
  border-radius: 8px;
  font-size: 16px;
  border: none;
  transition: opacity 0.3s;
}


.register-form-button:disabled {
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  color: rgba(0, 0, 0, 0.25);
}

/* 添加响应式设计 */
@media screen and (max-width: 480px) {
  #register-container {
    margin: 40px 16px;
    padding: 24px;
  }

  .title {
    font-size: 24px;
  }
}
</style>
