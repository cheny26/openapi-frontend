<template>
  <div id="app">
    <a-config-provider :locale="zhCN">
    <BasicLayout />
    </a-config-provider>
  </div>
</template>

<script setup lang="ts">
import BasicLayout from "@/layouts/BasicLayout.vue";
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { isLoginUsingGet } from "./api/userController";
import { onMounted } from "vue";
// const isLogin=async()=>{
//   const res=await isLoginUsingGet()
//   if(!res.data.data){
//     location.href="/user/login"
//     localStorage.removeItem("openapi-user")
//   }
// }
// onMounted(()=>isLogin())
</script>
<style>

</style>
