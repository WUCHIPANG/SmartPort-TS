// 匯入 Vue Router 所需功能
import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

// 匯入路由設定（通常為各模組的路由整合）
import systemRouter from './system-router'

// 設定路由表（從外部模組引入）
const routes = systemRouter

// 建立路由實例，使用 hash 模式（網址會有 #）
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// 預設標題
document.title = 'My App'

// 前置守衛：每次路由切換前執行
router.beforeEach((to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
  // 如果目標路由有設定 meta.title，就更新頁面標題
  document.title = to.meta?.title ? `${to.meta.title} - My App` : 'My App'
  next()
})

// 後置守衛：每次路由切換後執行
router.afterEach(() => {
  // NProgress.done()
})

// 全域錯誤處理：當路由跳轉失敗時觸發（暫不使用 UI 提示元件）
router.onError((error) => {
  console.error('路由錯誤:', error.message)
})

export default router