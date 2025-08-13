import { defineStore } from 'pinia'

export interface KeepAliveState {
  /** 需要被 <KeepAlive> 緩存的元件名稱（通常是路由對應元件的 name） */
  keepAliveRoute: string[]
  /** 用來強制重新渲染 <router-view> 的 key */
  routeKey: string | number | null
  /** 是否顯示 <router-view>（配合切換以達到刷新效果） */
  routeShow: boolean
}

export const useKeepAliveStore = defineStore('keepAlive', {
  state: (): KeepAliveState => ({
    keepAliveRoute: [],
    routeKey: null,
    routeShow: true,
  }),
  actions: {
    /** 加入需要緩存的元件名稱 */
    pushKeepAlive(component: string) {
      if (!this.keepAliveRoute.includes(component)) {
        this.keepAliveRoute.push(component)
      }
    },
    /** 移除不再需要緩存的元件名稱 */
    removeKeepAlive(component: string) {
      const index = this.keepAliveRoute.indexOf(component)
      if (index !== -1) {
        this.keepAliveRoute.splice(index, 1)
      }
    },
    /** 重置狀態 */
    resetKeepAliveStore() {
      this.keepAliveRoute = []
      this.routeKey = null
      this.routeShow = true
    },
    /** 設定 router-view 的 key（用於強制刷新） */
    setRouteKey(key: string | number | null) {
      this.routeKey = key
    },

    /** 顯示/隱藏 router-view */
    setRouteShow(show: boolean) {
      this.routeShow = show
    },
  },
})
