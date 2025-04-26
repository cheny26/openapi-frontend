import { createRouter, createWebHistory } from 'vue-router'
import UserLogin from '@/pages/user/UserLogin.vue'
import UserManage from '@/pages/admin/UserManage.vue'
import UserRegister from '@/pages/user/UserRegister.vue'
import ACCESS_ENUM from '@/access/accessEnum'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '主页',
      component: () => import('../views/InterfacesList.vue'),
      meta: {
        access: ACCESS_ENUM.NOT_LOGIN,
      },
    },
    {
      path: '/user/login',
      name: '用户登录',
      component: UserLogin,
      meta: {
        access: ACCESS_ENUM.NOT_LOGIN,
        hideInMenu: true,
      },
    },
    {
      path: '/user/register',
      name: '用户注册',
      component: UserRegister,
      meta: {
        access: ACCESS_ENUM.NOT_LOGIN,
        hideInMenu: true,
      },
    },
    {
      path: '/admin/userManage',
      name: '用户管理',
      component: UserManage,
      meta: {
        access: ACCESS_ENUM.ADMIN,
      },
    },
    {
      path: '/interfaces/detail/:id',
      name: 'interfaceDetail',
      component: () => import('../views/InterfaceDetail.vue'),
      meta: {
        hideInMenu: true,
      },
    },
    {
      path: '/interfaces/edit/:id',
      name: 'interfaceEdit',
      component: () => import('../views/InterfaceAdd.vue'),
      meta: {
        hideInMenu: true,
      },
    },
    {
      path: '/interfaces/add',
      name: 'interfaceAdd',
      component: () => import('../views/InterfaceAdd.vue'),
      meta: {
        hideInMenu: true,
      },
    },
    {
      path: '/interfaces/my',
      name: '我的接口',
      component: () => import('../views/MyInterfaces.vue')
    },
    {
      path: '/user/info',
      name: '个人信息',
      component: () => import('@/views/UserInfo.vue'),
      meta: {
        hideInMenu: true
      }
    },
    {
      path: '/user/points',
      name: '我的积分',
      component: () => import('@/views/UserPoints.vue'),
      meta: {
        hideInMenu: true
      }
    }
    // {
    //   path: '/interfaces/invoke/:id',
    //   name: 'interfaceInvoke',
    //   component: () => import('../views/InterfaceInvoke.vue')
    // }
  ],
})

export default router
