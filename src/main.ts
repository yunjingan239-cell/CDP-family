import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import '@/router/permission';
import { directive } from '@/directive';

// 整合ElementPlus
import ElementPlus from 'element-plus';
// @ts-ignore 汉化
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';


// 样式文件, elemen-plus样式在index.scss中导入了
import '@/styles/index.scss';
// 图标
import { useElIcon } from '@/utils/setGlobal';

const app = createApp(App);
app.use(createPinia());
app.use(router);

app.use(ElementPlus, {locale: zhCn});
// 全局注册图标'ele-'开头 (样式在index.scss中)
useElIcon(app);
directive(app);
app.mount('#app')