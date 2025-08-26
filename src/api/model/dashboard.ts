import config from '@/config'
import { request } from '@/utils/request'
import type { ApiAction, ApiModule, GetAction } from './_types'

export type DashboardModule = {
  emp: {
    uv: GetAction<unknown>
    insp: GetAction<unknown>
    msg: GetAction<unknown>
  }
  sys: {
    customer: GetAction<unknown>
    uv: GetAction<unknown>
    resource: GetAction<unknown>
    sysMsg: GetAction<unknown>
  }
}

const dashboard: DashboardModule = {
// 企業儀錶板
  emp: {
    uv: {
      url: `${config.API_URL}/dash/emp/uv/`,
      name: '查詢載具狀態清單',
      async get<T = unknown>(this: ApiAction): Promise<T> {
        return await request.get<T>(this.url)
      },
    },
    insp: {
      url: `${config.API_URL}/dash/emp/insp/`,
      name: '查詢巡檢統計',
      async get<T = unknown, Q = Record<string, unknown>>(this: ApiAction, params?: Q): Promise<T> {
        return await request.get<T>(this.url, params)
      },
    },
    msg: {
      url: `${config.API_URL}/dash/emp/msg/`,
      name: '查詢系統訊息',
      async get<T = unknown, Q = Record<string, unknown>>(this: ApiAction, params?: Q): Promise<T> {
        return await request.get<T>(this.url, params)
      },
    },
  },
  // 系統管理者儀錶板
  sys: {
    customer: {
      url: `${config.API_URL}/dash/sys/cust/`,
      name: '客戶狀態',
      async get<T = unknown>(this: ApiAction): Promise<T> {
        return await request.get<T>(this.url)
      },
    },
    uv: {
      url: `${config.API_URL}/dash/sys/uv/`,
      name: '支援載具',
      async get<T = unknown>(this: ApiAction): Promise<T> {
        return await request.get<T>(this.url)
      },
    },
    resource: {
      url: `${config.API_URL}/dash/sys/res/`,
      name: '資源統計',
      async get<T = unknown>(this: ApiAction): Promise<T> {
        return await request.get<T>(this.url)
      },
    },
    sysMsg: {
      url: `${config.API_URL}/dash/sys/msg/`,
      name: '查詢系統訊息',
      async get<T = unknown, Q = Record<string, unknown>>(this: ApiAction, params?: Q): Promise<T> {
        return await request.get<T>(this.url, params)
      },
    },
  },
}

export default dashboard
