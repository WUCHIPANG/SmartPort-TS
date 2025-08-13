
import { defineStore } from 'pinia'
import type { RouteRecordRaw, RouteComponent } from 'vue-router'
import { storageSession } from '@/utils/storage'
import { useUserStore } from './user'
import router from '@/router'
import constantMenus from '@/config/route'
import { ElMessageBox } from 'element-plus'
import { t } from '@locales'

const PERMISSION_KEY = 'PERMISSION'
const MENU_KEY = 'MENU'
const SETTING_MENU_KEY = 'SETTING_MENU'

export interface RawMenuItem {
  path: string
  name?: string
  redirect?: string
  component?: string
  meta?: Record<string, any> & {
    type?: 'iframe'
    url?: string
    props?: boolean | Record<string, any>
    role?: string[]
    breadcrumb?: any[]
  }
  children?: RawMenuItem[]
}

/** Store state 型別 */
interface PermissionState {
  constantMenus: RouteRecordRaw[]
  wholeMenus: RouteRecordRaw[]
  dynmicMenus: RawMenuItem[]
  permission: any[]
  settingMenu: RouteRecordRaw[]
}

/** 過濾樹：保留符合條件或其子孫符合者 */
function treeFilter(tree: RawMenuItem[], func: (node: RawMenuItem) => boolean): RawMenuItem[] {
  return tree
    .map(node => ({ ...node }))
    .filter(node => {
      if (node.children) node.children = treeFilter(node.children, func)
      return func(node) || !!(node.children && node.children.length)
    })
}

/** 依檔名動態載入 view component（不要用 @） */
const viewModules = import.meta.glob('/src/views/**/*.{vue,tsx}')

function loadComponent(view?: string): RouteRecordRaw['component'] {
  if (!view) return () => import('@/layout/other/page_404.vue')

  const keys = Object.keys(viewModules)
  const hit = keys.find(k =>
    k.endsWith(`/${view}.vue`) ||
    k.endsWith(`/${view}.tsx`) ||
    k.endsWith(`/${view}/index.vue`) ||
    k.endsWith(`/${view}/index.tsx`)
  )

  return hit ? (viewModules[hit] as any) : () => import('@/layout/other/page_404.vue')
}

/** 後端結構 -> Vue Router 結構 */
function filterAsyncRouter(routerMap: RawMenuItem[]): RouteRecordRaw[] {
  const accessedRouters: RouteRecordRaw[] = []
  routerMap.forEach(item => {
    const meta = item.meta ?? {}

    // 外部 iframe 轉內部路由
    if (meta.type === 'iframe') {
      meta.url = item.path
      item.path = `/i/${item.name}`
    }

    const route: RouteRecordRaw = {
      path: item.path,
      name: item.name as any,
      meta,
      redirect: item.redirect as any,
      children: item.children ? filterAsyncRouter(item.children) : undefined,
      component: loadComponent(item.component) as RouteComponent,
      props: meta.props ?? false,
    }
    accessedRouters.push(route)
  })
  return accessedRouters
}


/** 路由扁平化，並建立 breadcrumb meta */
function flatAsyncRoutes(routes: RouteRecordRaw[], breadcrumb: RouteRecordRaw[] = []): RouteRecordRaw[] {
  const res: RouteRecordRaw[] = []

  routes.forEach(route => {
    const tmp: RouteRecordRaw = { ...route }
    if (tmp.children && tmp.children.length) {
      const childrenBreadcrumb = [...breadcrumb, route]
      const current = {
        ...(route as any),
        children: undefined,
        meta: { ...(route.meta || {}), breadcrumb: childrenBreadcrumb },
      } as RouteRecordRaw
      res.push(current)

      const children = flatAsyncRoutes(tmp.children, childrenBreadcrumb)
      children.forEach(item => res.push(item))
    } else {
      const tmpBreadcrumb = [...breadcrumb, tmp]
      tmp.meta = { ...(tmp.meta || {}), breadcrumb: tmpBreadcrumb }
      res.push(tmp)
    }
  })

  return res
}

/** 判斷是否已是 Router 記錄（而非後端 raw） */
function isRouterRecord(item: any): item is RouteRecordRaw {
  // Vue Router 接受 function/object 的 component（lazy 或已解析）
  const c = item?.component
  return typeof c === 'function' || (typeof c === 'object' && c !== null) || !!item?.components
}

export const usePermissionStore = defineStore('permissionStore', {
  state: (): PermissionState => ({
    constantMenus: constantMenus as RouteRecordRaw[],
    wholeMenus: [],
    dynmicMenus: storageSession.getItem<RawMenuItem[]>(MENU_KEY) ?? [],
    permission: storageSession.getItem<any[]>(PERMISSION_KEY) ?? [],
    settingMenu: storageSession.getItem<RouteRecordRaw[]>(SETTING_MENU_KEY) ?? [],
  }),

  actions: {
    SET_DYNMIC_MENUS(menus?: RawMenuItem[]) {
      if (menus && menus.length > 0) {
        this.dynmicMenus = menus
        storageSession.setItem(MENU_KEY, menus)
      } else {
        this.dynmicMenus = []
        storageSession.removeItem(MENU_KEY)
      }
    },

    SET_SETTING_MENU(menu?: RouteRecordRaw[]) {
      if (menu && menu.length > 0) {
        this.settingMenu = menu
        storageSession.setItem(SETTING_MENU_KEY, menu)
      } else {
        this.settingMenu = []
        storageSession.removeItem(SETTING_MENU_KEY)
      }
    },

    SET_PERMISSION(permission?: any[]) {
      if (permission && permission.length > 0) {
        this.permission = permission
        storageSession.setItem(PERMISSION_KEY, permission)
      } else {
        this.permission = []
        storageSession.removeItem(PERMISSION_KEY)
      }
    },

    /** 初始化權限路由 */
    async initAuthRoute(): Promise<void> {
      if (this.dynmicMenus?.length > 0) {
        const menus = await this.getWholeMenus()
        await this.handleAsyncRoutes(menus)
        return
      }

      try {
        await this.getDynmicMenus()
        const menus = await this.getWholeMenus()
        if (menus.length === 0) {
          await ElMessageBox.alert(t('systemNotification.accountNoMenu'), t('systemNotification.error403'), {
            type: 'error',
            center: true,
          })
          useUserStore().resetUserLogin()
          throw new Error(t('systemNotification.accountNoMenu'))
        } else {
          await this.handleAsyncRoutes(menus)
        }
      } catch (err) {
        throw err
      }
    },

    /** 註冊動態路由 */
    async handleAsyncRoutes(routesList: RawMenuItem[] | RouteRecordRaw[]): Promise<void> {
      // 正確判斷：只要第一筆不是「函式/物件 component」，就視為後端 raw，需要 map
      const needMap = !(routesList.length && isRouterRecord((routesList as any[])[0]))
      const mapped = needMap
        ? filterAsyncRouter(routesList as RawMenuItem[])
        : (routesList as RouteRecordRaw[])

      const flat = flatAsyncRoutes(mapped)
      flat.forEach(item => {
        router.addRoute('layout', item) // 確保 'layout' 已經在靜態路由中
      })
    },

    /** 取得全部選單（靜態 + 動態，並依角色過濾靜態） */
    async getWholeMenus(): Promise<RawMenuItem[]> {
      const user = useUserStore()
      const roles: string[] = (user.userInfo as any)?.roles ?? []  // ← 沒有就當空陣列
    
      const userMenu = treeFilter(this.constantMenus as unknown as RawMenuItem[], node => {
        const need = node.meta?.role as string[] | undefined
        if (!need || need.length === 0) return true
        if (roles.length === 0) return false   // 或改 true，看你的權限策略
        return need.some(r => roles.includes(r))
      })
    
      const allMenus: RawMenuItem[] = [...userMenu, ...(this.dynmicMenus ?? [])]
      this.wholeMenus = filterAsyncRouter(allMenus)
      return allMenus
    },

    /** 取得動態選單（從快取） */
    async getDynmicMenus(): Promise<RawMenuItem[]> {
      const raw = storageSession.getItem<RawMenuItem[]>(MENU_KEY)
      const menus: RawMenuItem[] = Array.isArray(raw) ? raw : [] // ← 安全收斂成陣列
      this.SET_DYNMIC_MENUS(menus)
      return menus
    },

    resetPermissionStore() {
      this.wholeMenus = []
      this.dynmicMenus = []
      this.permission = []
      this.settingMenu = []
    },
  },
})
