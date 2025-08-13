export type ApiMethod<TRes = unknown, TReq = unknown> =
  (this: ApiAction, payload?: TReq) => Promise<TRes>

export interface ApiAction {
  url: string
  name?: string

  // 依需要實作；沒用到就別實作（可選）
  get?<TRes = unknown, Q = Record<string, unknown>>(this: ApiAction, params?: Q): Promise<TRes>
  post?<TRes = unknown, D = unknown>(this: ApiAction, data?: D): Promise<TRes>
  put?<TRes = unknown, D = unknown>(this: ApiAction, data?: D): Promise<TRes>
  patch?<TRes = unknown, D = unknown>(this: ApiAction, data?: D): Promise<TRes>
  /** `delete` 可以當屬性名使用，如有顧慮可改成 `del?` */
  delete?<TRes = unknown, D = unknown>(this: ApiAction, data?: D): Promise<TRes>
}

export type ApiModule = Record<string, ApiAction>