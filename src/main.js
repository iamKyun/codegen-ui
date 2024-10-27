import App from './App'
import { createApp } from 'vue'
import './mock' // 引入 mock 数据

const app = createApp(App)
app.mount("#app")
