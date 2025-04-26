import { getLoginUserUsingGet } from '@/api/userController'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoginUserStore = defineStore(
  'loginUser',
  () => {
    const loginUser = ref<API.LoginUserVO>({
      userName: '未登录',
    })

    async function fetchLoginUser() {
      const res = await getLoginUserUsingGet()
      if (res.data.code === 0 && res.data.data) {
        loginUser.value = res.data.data
      }
    }
    function setLoginUser(newLoginUser: API.LoginUserVO) {
      loginUser.value = newLoginUser
    }
    // 重置
    function  reset(){
      loginUser.value = {}
    }
    return { loginUser, setLoginUser, fetchLoginUser,reset }
  },
  {
    persist: {
      key: 'openapi-user',
      storage: localStorage, // 对registerId进行localStorage存储
    },
  },
)
