import config from '@/config'
import { request } from '@/utils/request'
import type { ApiAction, ApiModule, GetAction, GetByIdAction, PostAction, PutByIdAction } from './_types'

export type FeatureModule = {
  list: GetAction<unknown>
  detail: GetByIdAction<unknown>
  add: PostAction<unknown>
  update: PutByIdAction<unknown>
}

const feature: FeatureModule = {
  list: {
    url: `${config.API_URL}/fe/Feature`,
    name: '取得功能清單(智慧功能管理)',
    async get<T = unknown, Q = Record<string, unknown>>(this: ApiAction, params?: Q): Promise<T> {
        return await request.get<T>(this.url, params)
      },
  },
  detail: {
    url: `${config.API_URL}/fe/Feature`,
    name: '取得功能設定內容',
    async get(this: ApiAction, authID: string) {
      return request.get(`${this.url}/${authID}/`)
    },
  },
  add: {
    url: `${config.API_URL}/fe/Feature`,
    name: '新增功能設定',
    async post<T = unknown, D = Record<string, unknown>>(this: ApiAction, data?: D): Promise<T> {
      return await request.post<T>(this.url, (data ?? {}) as D)
    },
  },
  update: {
    url: `${config.API_URL}/fe/Feature`,
    name: '修改功能設定',
    async put(this: ApiAction, authID: string, data?: Record<string, unknown>) {
      return request.put(`${this.url}/${authID}/`, data)
    },
  },
}

export default feature