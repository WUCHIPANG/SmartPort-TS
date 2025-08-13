// 匯入 Vue Router 所需功能
import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import config from '@/config'
// 匯入路由設定（通常為各模組的路由整合）
import systemRouter from './system-router'

import { useUserStore, usePermissionStore } from '@/stores'
import { ElNotification } from 'element-plus'
// import { i18n } from './../../locales/index'
import { t } from '@locales' 
// 設定路由表（從外部模組引入）
const routes = systemRouter

// 建立路由實例，使用 hash 模式（網址會有 #）
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// 預設標題
document.title = config.APP_NAME

// 前置守衛：每次路由切換前執行
router.beforeEach(async (to) => {
  // 動態標題
  document.title = to.meta?.i18nTitle
    ? `${t(String(to.meta.i18nTitle))} - ${config.APP_NAME}`
    : to.meta?.title
    ? `${String(to.meta.title)} - ${config.APP_NAME}`
    : config.APP_NAME

  const user = useUserStore()
  const permission = usePermissionStore()

  if (to.path === '/login') {
    // 刪除路由(替換目前layout路由)D
    router.addRoute(routes[0])
    return
  }

  if (routes.findIndex(r => r.path === to.path) >= 0) {
    return
  }
  // 未登入 → 導到登入
  if (!user.token || !user.userInfo) {
    return { path: '/login', replace: true }
  }

  // 整頁路由處理
  if (to.meta.fullpage) {
    to.matched = [to.matched[to.matched.length - 1]]
  }

  // 加載動態/靜態路由
  if (permission.wholeMenus.length === 0) {
    try {
      await permission.initAuthRoute()

      if (to.name === 'not-found') {
        router.replace(to.fullPath)
      }
    } catch (error: any) {
      console.log(error.data?.messag || '選單權限取得失敗')
    }
  }
  // beforeEach(to, from)
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
