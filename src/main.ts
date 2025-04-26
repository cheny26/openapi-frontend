import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persistedstate'

import Antd from 'ant-design-vue';
import App from './App.vue'
import router from './router'
import '@/access'


const app = createApp(App)
const store=createPinia();
store.use(piniaPluginPersist)
app.use(store)
app.use(router)
app.use(Antd)
app.mount('#app')
