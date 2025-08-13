import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosHeaders } from 'axios'
// 匯入自訂的系統設定（如 API_URL、TIMEOUT、TOKEN_NAME 等）
import sysConfig from '@/config'

class AxiosProxy {
  instance: AxiosInstance // Axios 實例，用於執行請求

  constructor(axiosConfig: AxiosRequestConfig) {
    // 建立 Axios 實例，帶入自定設定或使用系統預設值
    this.instance = axios.create({
      // baseURL: axiosConfig.baseURL || sysConfig.API_URL,
      timeout: axiosConfig.timeout ?? sysConfig.TIMEOUT,
      ...axiosConfig,
    })
    // 設定攔截器
    this.setInterceptor()
  }

  private setInterceptor() {
    // Request 攔截器：在送出請求前加入處理邏輯
    this.instance.interceptors.request.use(
      (config) => {
      const token = '' // 你可以從 localStorage 或其他地方取得 token

      if (token) {
        if (!config.headers) {
          config.headers = AxiosHeaders.from({})
        }
        // 將 token 加入 header 中（例如：Authorization: Bearer token）
        config.headers[sysConfig.TOKEN_NAME] = `${sysConfig.TOKEN_PREFIX}${token}`
      }

      return config
      },
      (error) => Promise.reject(error)
    )

    // Response 攔截器：處理回傳資料與錯誤
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response, // 回傳成功直接通過
      (error) => {
        // 異常處理，可加入通知、登出等邏輯
        console.error('Request error:', error)
        // 若有 response 回傳錯誤訊息，回傳 response；否則回傳原始錯誤
        return Promise.reject(error?.response || error)
      }
    )
  }
}

export function createRequest(config: AxiosRequestConfig = {}) {
  const { instance } = new AxiosProxy(config)

  // ---- 改這裡：第二個參數都改成「可選」 ----
  const get = async <T = unknown, P = unknown>(
    url: string,
    params?: P,
    cfg?: AxiosRequestConfig
  ): Promise<T> =>
    instance.get<T>(url, { ...(cfg || {}), params }).then(r => r.data)

  const post = async <T = unknown, D = unknown>(
    url: string,
    data?: D,
    cfg?: AxiosRequestConfig
  ): Promise<T> =>
    instance.post<T>(url, data, cfg).then(r => r.data)

  const put = async <T = unknown, D = unknown>(
    url: string,
    data?: D,
    cfg?: AxiosRequestConfig
  ): Promise<T> =>
    instance.put<T>(url, data, cfg).then(r => r.data)

  const patch = async <T = unknown, D = unknown>(
    url: string,
    data?: D,
    cfg?: AxiosRequestConfig
  ): Promise<T> =>
    instance.patch<T>(url, data, cfg).then(r => r.data)

  const del = async <T = unknown, D = unknown>(
    url: string,
    data?: D,
    cfg?: AxiosRequestConfig
  ): Promise<T> =>
    instance
      .delete<T>(url, { ...(cfg || {}), data })
      .then(r => r.data)

  return { get, post, put, patch, delete: del, instance }
}

// 預設導出單一實例
export const request = createRequest()