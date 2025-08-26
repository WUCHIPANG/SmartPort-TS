/** 共用的 API 方法型別；使用 this 綁定到 ApiAction */
export type ApiMethod<TRes = unknown, TReq extends Record<string, unknown> | void = Record<string, unknown>
> = (this: ApiAction, payload?: TReq) => Promise<TRes>

/** Action 的共同屬性與可選方法 */
export interface ApiAction {
  url: string
  name?: string

  get?<TRes = unknown, Q extends Record<string, unknown> = Record<string, unknown>>(
    this: ApiAction,
    params?: Q
  ): Promise<TRes>

  post?<TRes = unknown, D extends Record<string, unknown> = Record<string, unknown>>(
    this: ApiAction,
    data?: D
  ): Promise<TRes>

  put?<TRes = unknown, D extends Record<string, unknown> = Record<string, unknown>>(
    this: ApiAction,
    data?: D
  ): Promise<TRes>

  patch?<TRes = unknown, D extends Record<string, unknown> = Record<string, unknown>>(
    this: ApiAction,
    data?: D
  ): Promise<TRes>

  delete?<TRes = unknown, D extends Record<string, unknown> = Record<string, unknown>>(
    this: ApiAction,
    data?: D
  ): Promise<TRes>
}

/** 遞迴節點：要嘛就是一個 ApiAction，要嘛就是下一層群組 */
export type ApiNode = ApiAction | { [key: string]: ApiNode }

/** 模組的根 */
export type ApiModule = { [key: string]: ApiNode }

/** 只允許扁平 */
export type FlatApiModule = Record<string, ApiAction>

/* ------------------------------------------------------------------ */
/*  可重用：將「某方法必帶」化的變體型別                                   */
/* ------------------------------------------------------------------ */

export type MethodKey = 'get' | 'post' | 'put' | 'patch' | 'delete'

/** 把 ApiAction 的某個方法改成必填 */
export type WithRequiredMethod<A extends ApiAction, K extends MethodKey> =
  A & Required<Pick<A, K>>

export type GetAction<TRes, Q extends Record<string, unknown> = Record<string, unknown>> =
  ApiAction & { get: ApiMethod<TRes, Q> }

export type PostAction<TRes, D extends Record<string, unknown> = Record<string, unknown>> =
  ApiAction & { post: ApiMethod<TRes, D> }

export type PutAction<TRes, D extends Record<string, unknown> = Record<string, unknown>> =
  ApiAction & { put: ApiMethod<TRes, D> }

export type PatchAction<TRes, D extends Record<string, unknown> = Record<string, unknown>> =
  ApiAction & { patch: ApiMethod<TRes, D> }

export type DeleteAction<TRes, D extends Record<string, unknown> = Record<string, unknown>> =
  ApiAction & { delete: ApiMethod<TRes, D> }

export type GetByIdAction<TRes, TId extends string | number = string> =
  Omit<ApiAction, 'get'> & { get(this: ApiAction, id: TId): Promise<TRes> }

export type PostByIdAction<TRes, TId extends string | number = string> =
  Omit<ApiAction, 'post'> & { post(this: ApiAction, id: TId): Promise<TRes> }

export type PutByIdAction<TRes, TId extends string | number = string, D extends Record<string, unknown> = Record<string, unknown>
> = Omit<ApiAction, 'put'> & { put(this: ApiAction, id: TId, data?: D): Promise<TRes>}
/* ------------------------------------------------------------------ */
/*  型別守衛（hasXxx）與斷言工具（requireXxx）                            */
/* ------------------------------------------------------------------ */

/** 判斷節點是否為 ApiAction（具有 url 欄位） */
export function isApiAction(node: ApiNode): node is ApiAction {
  return !!node && typeof node === 'object' && 'url' in node
}

/** 泛用：檢查節點是否具有某個方法（且為 function） */
export function hasMethod<K extends MethodKey>(
  node: ApiNode,
  key: K
): node is ApiAction & Required<Pick<ApiAction, K>> {
  return isApiAction(node) && typeof (node as any)[key] === 'function'
}

/** 泛用：斷言節點必定具有某個方法；否則丟錯（移除 ts(2722)） */
export function requireMethod<K extends MethodKey>(
  node: ApiNode,
  key: K
): asserts node is ApiAction & Required<Pick<ApiAction, K>> {
  if (!hasMethod(node, key)) {
    throw new Error(`此 API 缺少方法：${String(key)}`)
  }
}

/** 便利別名：hasPost / requirePost */
export function hasPost<TRes = unknown, TReq extends Record<string, unknown> = Record<string, unknown>>(
  node: ApiNode
): node is ApiAction & { post: ApiMethod<TRes, TReq> } {
  return hasMethod(node, 'post')
}

export function requirePost<TRes = unknown, TReq extends Record<string, unknown> = Record<string, unknown>>(
  node: ApiNode
): asserts node is ApiAction & { post: ApiMethod<TRes, TReq> } {
  return requireMethod(node, 'post')
}

/** 其他動詞的便利別名（需要就打開） */
// export const hasGet = <TRes = unknown, Q extends Record<string, unknown> = Record<string, unknown>>(n: ApiNode):
//   n is ApiAction & { get: ApiMethod<TRes, Q> } => hasMethod(n, 'get')
// export const requireGet = <TRes = unknown, Q extends Record<string, unknown> = Record<string, unknown>>(n: ApiNode):
//   asserts n is ApiAction & { get: ApiMethod<TRes, Q> } => requireMethod(n, 'get')