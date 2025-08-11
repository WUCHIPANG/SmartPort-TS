import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { setupStore } from './stores'
import router from './router'
import { setupI18n } from '@locales'

const app = createApp(App)
setupStore(app)
setupI18n(app)

app.use(router).mount('#app')

