import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosHeaders } from 'axios'
// 匯入自訂的系統設定（如 API_URL、TIMEOUT、TOKEN_NAME 等）
import sysConfig from '@/config'

class AxiosProxy {
  instance: AxiosInstance // Axios 實例，用於執行請求

  constructor(axiosConfig: AxiosRequestConfig) {
    // 建立 Axios 實例，帶入自定設定或使用系統預設值
    this.instance = axios.create({
      baseURL: axiosConfig.baseURL || sysConfig.API_URL,
      timeout: axiosConfig.timeout ?? sysConfig.TIMEOUT,
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
  // 透過 AxiosProxy 建立新的 axios 實例
  const { instance } = new AxiosProxy(config)

  // 常用的 HTTP 方法封裝：回傳資料為 .data
  function get<T = any>(url: string, params = {}, config: AxiosRequestConfig = {}) {
    return instance.get<T>(url, { params, ...config }).then(res => res.data)
  }

  function post<T = any>(url: string, data = {}, config: AxiosRequestConfig = {}) {
    return instance.post<T>(url, data, config).then(res => res.data)
  }

  function put<T = any>(url: string, data = {}, config: AxiosRequestConfig = {}) {
    return instance.put<T>(url, data, config).then(res => res.data)
  }

  function patch<T = any>(url: string, data = {}, config: AxiosRequestConfig = {}) {
    return instance.patch<T>(url, data, config).then(res => res.data)
  }

  function del<T = any>(url: string, data = {}, config: AxiosRequestConfig = {}) {
    return instance.delete<T>(url, { data, ...config }).then(res => res.data)
  }

  // 將封裝後的 API 方法作為物件回傳
  return { get, post, put, patch, delete: del }
}

// 預設導出單一實例
export const request = createRequest()