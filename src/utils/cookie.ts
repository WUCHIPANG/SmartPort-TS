import Cookies from 'js-cookie'
const { hostname } = window.location

class CookieProxy {
  private baseParams: Cookies.CookieAttributes
  constructor() {
    this.baseParams = {
      path: '/',
      domain: hostname || undefined,
      // expires: 7,
      // secure: true,
      // sameSite: 'none',
    }
  }

  /** 取得所有 cookies */
  getAll(): Record<string, string> {
    return Cookies.get()
  }

  /** 清空 cookies（使用預設 path/domain） */
  clearAll(): void {
    Object.keys(this.getAll()).forEach(key => {
      this.remove(key)
    })
  }

  /** 取得單一 cookie */
  get(key: string): string | undefined {
    return Cookies.get(key)
  }

  /** 設定 cookie（可覆蓋預設 options） */
  set(
    key: string,
    value: string,
    params?: Cookies.CookieAttributes
  ): string | undefined {
    const options = params ? { ...this.baseParams, ...params } : this.baseParams
    return Cookies.set(key, value, options)
  }

  /** 刪除 cookie（可指定 path/domain；不指定則用預設） */
  remove(
    key: string,
    path?: string | false,
    domain?: string | false
  ): void {
    const options: Cookies.CookieAttributes = {
      path: path === undefined ? this.baseParams.path : (path || undefined),
      domain: domain === undefined ? this.baseParams.domain : (domain || undefined),
    }
    Cookies.remove(key, options)
  }
}
const cookies = new CookieProxy()
export default cookies
export { CookieProxy }
