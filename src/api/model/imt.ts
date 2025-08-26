import config from '@/config'
import { request } from '@/utils/request'
import type { ApiAction, ApiModule, GetAction, PostAction, PutAction, DeleteAction, GetByIdAction, PostByIdAction } from './_types'

export type ImtModule = {
  list: GetAction<unknown>
  add: PostAction<unknown>
  update: PutAction<unknown>
  delete: DeleteAction<unknown>
  detail: GetByIdAction<unknown>
  exec: PostByIdAction<unknown>
  stop: PostByIdAction<unknown>
  status: PostAction<unknown>
  result: PostByIdAction<unknown>
  layers: GetAction<unknown>
}

const imt: ImtModule = {
  list: {
    url: `${config.API_URL}/imt/`,
    name: '查詢影像任務清單',
    async get<T = unknown, Q = Record<string, unknown>>(this: ApiAction, params?: Q): Promise<T> {
      return await request.get<T>(this.url, params)
    },
  },
  add: {
    url: `${config.API_URL}/imt/`,
    name: '新增影像任務',
    async post<T = unknown, D = Record<string, unknown>>(this: ApiAction, data?: D): Promise<T> {
      return await request.post<T>(this.url, (data ?? {}) as D)
    },
  },
  update: {
    url: `${config.API_URL}/imt/`,
    name: '更新影像任務',
    async put<T = unknown, D = Record<string, unknown>>(this: ApiAction, data?: D): Promise<T> {
      return await request.put<T>(this.url, (data ?? {}) as D)
    },
  },
  delete: {
    url: `${config.API_URL}/imt/`,
    name: '刪除/取消影像任務',
    async delete<T = unknown, D = Record<string, unknown>>(this: ApiAction, data?: D): Promise<T> {
      return await request.delete(this.url, (data ?? {}) as D)
    },
  },
  detail: {
    url: `${config.API_URL}/imt`,
    name: '查詢單一影像任務',
    async get(this: ApiAction, TaskID: string) {
      return request.get(`${this.url}/${TaskID}/`)
    },
  },
  exec: {
    url: `${config.API_URL}/imt/exec`,
    name: '執行影像任務',
    async post(this: ApiAction, TaskID: string) {
      return request.post(`${this.url}/${TaskID}/`)
    },
  },
  stop: {
    url: `${config.API_URL}/imt/stop`,
    name: '停止影像任務',
    async post(this: ApiAction, TaskID: string) {
      return request.post(`${this.url}/${TaskID}/`)
    },
  },
  status: {
    url: `${config.API_URL}/imt/status/`,
    name: '查詢影像任務執行狀態',
    async post<T = unknown, D = Record<string, unknown>>(this: ApiAction, data?: D): Promise<T> {
      return await request.post<T>(this.url, (data ?? {}) as D)
    },
  },
  result: {
    url: `${config.API_URL}/imt/result`,
    name: '取得影像任務結果',
    async post(this: ApiAction, TaskID: string) {
      return request.post(`${this.url}/${TaskID}/`)
    },
  },
  layers: {
    url: `${config.API_URL}/imt/layers/`,
    name: '取得中心點周遭圖層',
    async get<T = unknown, Q = Record<string, unknown>>(this: ApiAction, params?: Q): Promise<T> {
      return await request.get<T>(this.url, params)
    },
  },
}

export default imt
