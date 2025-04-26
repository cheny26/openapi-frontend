<template>
  <div id="basicLayout">
    <a-layout class="layout-container">
      <a-layout-header class="header">
        <ClobalHeader />
      </a-layout-header>
      <div class="scrollable-container">
        <a-layout-content class="content">
          <router-view />
        </a-layout-content>
        <a-layout-footer class="footer">
          <a href="https://www.codefather.cn" target="_blank"> 图聚 by 止水 </a>
        </a-layout-footer>
      </div>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import ClobalHeader from '@/components/ClobalHeader.vue';
</script>

<style scoped>
#basicLayout {
  background-color: #efefef;
  padding: 0;
  margin: 0;
}

.layout-container {
  min-height: 100vh;
}

#basicLayout .header {
  padding-inline: 20px;
  background-color: white;
  color: unset;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 64px; /* 设置固定高度 */
}

.scrollable-container {
  margin-top: 64px; /* 与header高度相同 */
  min-height: calc(100vh - 64px); /* 减去header高度 */
  display: flex;
  flex-direction: column;
}

#basicLayout .content {
  background: #f0f2f5;
  flex: 1;
  padding: 24px;
}

#basicLayout .footer {
  background: #f0f2f5;
  padding: 16px;
  text-align: center;
}

#basicLayout a {
  color: black;
}
</style>
