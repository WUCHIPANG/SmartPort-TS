import { createPinia } from 'pinia'
import type { App } from 'vue'
const store = createPinia()

export function setupStore(app: App) {
  app.use(store)
}

export * from './modules/index' // 各子 store 可集中 export 出去
export default store