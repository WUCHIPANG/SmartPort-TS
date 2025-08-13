import { createApp } from 'vue'
import App from './App.vue'
import { setupStore } from './stores'
import { setupI18n } from '@locales'
import router from './router'
import './styles/index.css' // tailwind css
import './assets/icons/style.css' // icon-font
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import vue3GoogleLogin from 'vue3-google-login'
import { BASE64 } from '@/utils/crypto'

const app = createApp(App)

// 暫時關閉 f12 的 vue wran 警告訊息
app.config.warnHandler = () => null

app.use(vue3GoogleLogin, {
  clientId: BASE64.decrypt(import.meta.env.VITE_OAUTH_CLIENT),
})

const initApp = async() => {
  setupStore(app)
  app.use(router)
  await router.isReady()
  // i18n
  setupI18n(app)
  app.mount('#app')
}
initApp()
