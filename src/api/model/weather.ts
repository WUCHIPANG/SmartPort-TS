import config from '@/config'
import { request } from '@/utils/request'
import type { ApiAction, ApiModule, PostAction } from './_types'

export type WeatherModule = {
  byLatLng: PostAction<unknown>
  byLatLngToFourDays: PostAction<unknown>
  getCountyAndTown: PostAction<unknown>
  bytowns: PostAction<unknown>
}

const weather: WeatherModule = {
  byLatLng: {
    url: `${config.API_URL}/weather/byLatLng/`,
    name: '根據經緯度獲取城市、鄉鎮區相關天氣資訊',
    async post<T = unknown, D extends Record<string, unknown> = Record<string, unknown>>(
      this: ApiAction,
      data?: D
    ): Promise<T> {
      return request.post<T>(this.url, (data ?? {}) as D)
    },
  },
  byLatLngToFourDays: {
    url: `${config.API_URL}/weather/byLatLngToFourDays/`,
    name: '根據經緯度跟未來四天時間獲取城市、鄉鎮區相關天氣資訊',
    async post<T = unknown, D extends Record<string, unknown> = Record<string, unknown>>(
      this: ApiAction,
      data?: D
    ): Promise<T> {
      return request.post<T>(this.url, (data ?? {}) as D)
    },
  },
  getCountyAndTown: {
    url: `${config.API_URL}/weather/getCountyAndTown/`,
    name: '獲取城市、鄉鎮區列表',
    async post<T = unknown, D extends Record<string, unknown> = Record<string, unknown>>(
      this: ApiAction,
      data?: D
    ): Promise<T> {
      return request.post<T>(this.url, (data ?? {}) as D)
    },
  },
  bytowns: {
    url: `${config.API_URL}/weather/bytowns/`,
    name: '根據城市、鄉鎮區獲取相關天氣資訊',
    async post<T = unknown, D extends Record<string, unknown> = Record<string, unknown>>(
      this: ApiAction,
      data?: D
    ): Promise<T> {
      return request.post<T>(this.url, (data ?? {}) as D)
    },
  },
}

export default weather
