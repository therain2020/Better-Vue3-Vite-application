import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import "@/css/main.css";

import { createPinia } from "pinia";
import { createPersistedState } from "pinia-persistedstate-plugin";

// 导入element-plus中文语言
import zhCn from "element-plus/dist/locale/zh-cn.mjs";

import { ElLoading, ElNotification } from 'element-plus';

const app = createApp(App);

// 使用pinia和persist保存状态并持久化
const pinia = createPinia();
const persist = createPersistedState();
pinia.use(persist);

app.use(ElementPlus, { locale: zhCn });
app.use(router);
app.use(pinia);

app.mount("#app");

app.use(ElLoading) 
app.use(ElNotification) 