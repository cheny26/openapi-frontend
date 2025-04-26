<template>
  <div class="user-info-container">
    <a-card title="个人信息" :bordered="false" class="user-info-card">
      <a-row :gutter="16">
        <a-col :span="8">
          <div class="avatar-container">
            <a-avatar :size="120" :src="loginUser.userAvatar" />
            <a-upload
              name="avatar"
              :show-upload-list="false"
              :custom-request="handleAvatarUpload"
              :before-upload="beforeUpload"
            >
              <a-button type="primary" class="upload-button">更换头像</a-button>
            </a-upload>
          </div>
        </a-col>
        <a-col :span="16">
          <a-form
            :model="userForm"
            name="userForm"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
            autocomplete="off"
          >
            <a-form-item label="用户名" name="userName">
              <a-input v-model:value="userForm.userName" :disabled="true" />
            </a-form-item>
            <a-form-item label="用户账号" name="userAccount">
              <a-input v-model:value="userForm.userAccount" :disabled="true" />
            </a-form-item>
            <a-form-item label="邮箱" name="email">
              <a-input v-model:value="userForm.email" />
            </a-form-item>
            <a-form-item label="手机号" name="phone">
              <a-input v-model:value="userForm.phone" />
            </a-form-item>
            <a-form-item label="个人简介" name="userProfile">
              <a-textarea v-model:value="userForm.userProfile" :rows="4" />
            </a-form-item>
            <a-form-item :wrapper-col="{ offset: 6, span: 18 }">
              <a-button type="primary" @click="updateUserInfo">保存修改</a-button>
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { useLoginUserStore } from '@/stores/user'

// 获取用户信息
const {loginUser} = useLoginUserStore()

// 用户表单数据
const userForm = ref({
  userName: '',
  userAccount: '',
  email: '',
  phone: '',
  userProfile: ''
})

// 初始化用户数据
onMounted(() => {
  if (loginUser) {
    userForm.value.userName = loginUser.userName || ''
    userForm.value.userAccount = loginUser.userAccount || ''
    userForm.value.email = loginUser.email || ''
    userForm.value.phone = loginUser.phone || ''
    userForm.value.userProfile = loginUser.userProfile || ''
  }
})

// 头像上传前检查
const beforeUpload = (file: File) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('只能上传JPG或PNG格式的图片!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片必须小于2MB!')
  }
  return isJpgOrPng && isLt2M
}

// 处理头像上传
const handleAvatarUpload = (options: any) => {
  const { file } = options
  // 这里应该调用实际的上传API
  // 示例代码，实际使用时需要替换为真实的API调用
  const formData = new FormData()
  formData.append('file', file)

  // 模拟上传成功
  setTimeout(() => {
    message.success('头像上传成功！')
    // 实际应用中，这里应该更新用户头像URL
  }, 1500)
}

// 更新用户信息
const updateUserInfo = () => {
  // 这里应该调用实际的更新用户信息API
  // 示例代码，实际使用时需要替换为真实的API调用

  // 模拟更新成功
  setTimeout(() => {
    message.success('个人信息更新成功！')
    // 实际应用中，这里应该更新全局用户状态
  }, 1000)
}
</script>

<style scoped>
.user-info-container {
  padding: 24px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 64px);
}

.user-info-card {
  max-width: 900px;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.upload-button {
  margin-top: 16px;
}
</style>
