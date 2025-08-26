import config from '@/config'
import { request } from '@/utils/request'
import type { ApiAction, ApiModule, PostAction } from './_types'

export type AuthModule = {
  login: PostAction<unknown>
  changeRole: PostAction<unknown>
}

const auth: AuthModule = {
  login: {
    url: `${config.API_URL}/au/Login/Google`,
    name: 'Google登入',
    async post<T = any, D = any>(this: ApiAction, data?: D): Promise<T> {
      return request.post<T>(this.url, data)
    },
  },
  changeRole: {
    url: `${config.API_URL}/au/Login/RenewJWT`,
    name: '切換公司/角色',
    async post<T = any, D = any>(this: ApiAction, data?: D): Promise<T> {
      return request.post<T>(this.url, data)
    },
  },
}

export default auth
