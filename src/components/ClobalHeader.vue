<template>
  <div id="globalHeader">
    <a-row :wrap="false">
      <!-- 图标 -->
      <a-col flex="200px">
        <RouterLink to="/">
          <div class="title-bar">
            <img class="logo" src="../assets/logo.svg  " alt="log" />
            <div class="title">无界API</div>
          </div>
        </RouterLink>
      </a-col>
      <!-- 导航 -->
      <a-col flex="auto">
        <a-menu
          class="menu"
          v-model:selectedKeys="current"
          mode="horizontal"
          :items="items"
          @click="doMenuClick"
        >
        </a-menu>
      </a-col>
      <!-- 登录 -->
      <a-col flex="120px">
        <div class="user-login-status">
          <div v-if="loginUserStore.loginUser.id">
            <a-dropdown>
              <a-space wrap :size="16">
                <a-avatar  :size="48" :src="loginUserStore.loginUser.userAvatar"/>
              </a-space>
              <template #overlay v-if="loginUserStore.loginUser.id">
                <a-menu style="font-size: larger;width: 120px;">
                  <a-menu-item @click="toUserInfo" style="padding: 10px;text-align: center;"> <UserOutlined />个人信息 </a-menu-item>
                  <a-menu-item @click="toUserPoints" style="padding: 10px;text-align: center;"> <WalletOutlined />我的积分 </a-menu-item>
                  <a-menu-item @click="showSignIn" style="padding: 10px;text-align: center;"> <CalendarOutlined />签到领奖 </a-menu-item>
                  <a-menu-item @click="logout" style="padding: 10px;text-align: center;"> <LogoutOutlined />退出登录 </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
          <div v-else>
            <a-button type="primary" href="/user/login">登录</a-button>
          </div>
        </div>
      </a-col>
    </a-row>

    <!-- 签到日历弹窗 -->
    <a-modal
      v-model:open="signInVisible"
      title="每日签到"
      @cancel="closeSignIn"
      :footer="null"
      :width="650"
      :bodyStyle="{ padding: '0', borderRadius: '8px', overflow: 'hidden' }"
      :mask="true"
      :maskClosable="true"
      :centered="true"
      class="sign-calendar-modal"
    >
      <sign-calendar />
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import {  ref } from 'vue'
import { message, type ItemType,  } from 'ant-design-vue'
import {  LogoutOutlined, CalendarOutlined, UserOutlined, WalletOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/user'
import { userLogoutUsingPost } from '@/api/userController'
import checkAccess from '@/access/checkAccess'
import { computed } from "vue";
import SignCalendar from '@/components/SignCalendar.vue'

// 签到相关状态
const signInVisible = ref(false)

// 显示签到弹窗
const showSignIn = () => {
  signInVisible.value = true
}

// 关闭签到弹窗
const closeSignIn = () => {
  signInVisible.value = false
}


//当前登录用户
const loginUserStore = useLoginUserStore()
//路由
const router = useRouter()

// 当前选中菜单
const current = ref<string[]>(['/'])

// 路由跳转事件
const doMenuClick = ({ key }: { key: string }) => {
  router.push({
    path: key,
  })
}
// 用户注销
const logout = async () => {
  try {
    const res = await userLogoutUsingPost();
    console.log('logout', res);
    if (res?.data?.code === 0) {
      loginUserStore.reset();
      message.success('退出登录成功');
      await router.push('/user/login');
    } else {
      message.error('退出登录失败，' + (res?.data?.message || '未知错误'));
    }
  } catch (error) {
    console.error('退出登录时发生错误：', error);
    message.error('退出登录失败，请稍后再试');
  }
};


// 监听路由变化，更新当前选中菜单
router.afterEach((to) => {
  current.value = [to.path]
})


// 展示在菜单的路由数组
const routes = router.options.routes

const items = computed(() => {
  return routes
    .filter((item) => {
      if (item.meta?.hideInMenu) {
        return false;
      }
      return checkAccess(loginUserStore.loginUser, item.meta?.access as string);
    })
    .map((item) => {
      return {
        key: item.path,
        label: item.name,
        title: item.path,
      } as ItemType;
    });
});

// 跳转到个人信息页面
const toUserInfo = () => {
  router.push('/user/info')
}

// 跳转到积分页面
const toUserPoints = () => {
  router.push('/user/points')
}
</script>
<style scoped>
#globalHeader{
  border-bottom: 1px solid #e5e5e5;
}
#globalHeader .title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: rgb(0, 0, 0);
  font-size: 18px;
  margin-left: 16px;
}

.logo {
  height: 48px;
}
.menu{
  color: black;
  font-size: 18px;
  margin-left: 16px;
}
.menu-item{
  padding: 0 50px;
}

/* 签到弹窗样式覆盖 */
:deep(.sign-calendar-modal .ant-modal-content) {
  padding: 0;
  overflow: hidden;
  border-radius: 8px;
}

:deep(.sign-calendar-modal .ant-modal-header) {
  display: none;
}

:deep(.sign-calendar-modal .ant-modal-close) {
  top: 10px;
  right: 10px;
  color: white;
  z-index: 1000;
}

:deep(.sign-calendar-modal .ant-modal-body) {
  padding: 0;
}
</style>
