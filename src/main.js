import App from './App'
import { createApp } from 'vue'
import './mock' // 引入 mock 数据
import '@/assets/main.css'

const app = createApp(App)
app.mount("#app")
