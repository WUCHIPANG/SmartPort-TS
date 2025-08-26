import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from 'axios'
import router from '@/router'
import { ElMessageBox, ElNotification } from 'element-plus'
import { useUserStore, useAppStore } from '@/stores'
import sysConfig from '@/config'
import { t } from '@locales'

type AppEventPayload = {
  status: boolean
  timestamp: number
}

const eventPayload: AppEventPayload = {
  status: false,
  timestamp: Date.now(),
}
class AxiosProxy {
  public instance: AxiosInstance // Axios 實例，用於執行請求

  constructor(axiosConfig: AxiosRequestConfig = {}) {
    const config: AxiosRequestConfig = {
      baseURL: axiosConfig.baseURL ?? sysConfig.API_URL ?? '',
      timeout: axiosConfig.timeout ?? sysConfig.TIMEOUT,
      ...axiosConfig,
    }
    this.instance = axios.create(config)
    this.setInterceptor()
  }

  private setInterceptor() {
    // Request 攔截器：在送出請求前加入處理邏輯
   this.instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = useUserStore().token

      if (!config.headers) {
        config.headers = AxiosHeaders.from({})
      }

      // 加上 Token
      if (token) {
        ;(config.headers as any)[sysConfig.TOKEN_NAME] = `${sysConfig.TOKEN_PREFIX}${token}`
      }

      // 關閉 GET 快取（若有需要在 URL 上加時間戳，解開下面註解）
      if (!sysConfig.REQUEST_CACHE && config.method?.toLowerCase() === 'get') {
        config.params = config.params || {}
        // (config.params as any)._ = Date.now()
      }

      // 合併系統自訂 Headers
      if (sysConfig.HEADERS && typeof sysConfig.HEADERS === 'object') {
        for (const [k, v] of Object.entries(sysConfig.HEADERS)) {
          ;(config.headers as any)[k] = v as any
        }
      }

      return config
    },
    (error) => Promise.reject(error)
  )

    // Response 攔截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError<any>) => {
        if (error.response) {
          const status = error.response.status

          if (status === 404) {
            if (sysConfig.SHOW_NOTIFICATION) {
              ElNotification.error({
                title: 'E404',
                message: t('systemNotification.error404'),
              })
            }
            // eslint-disable-next-line no-console
            console.log('Status Code: ', status, ' Message: 正在請求不存在的伺服器記錄！')
          } else if (status === 500) {
            if (sysConfig.SHOW_NOTIFICATION) {
              ElNotification.error({
                title: 'E500',
                message: t('systemNotification.error500'),
              })
            }
            // eslint-disable-next-line no-console
            console.log('Status Code: ', status, ' Message: 伺服器發生錯誤！')
          } else if (status === 401) {
            ElMessageBox.confirm(t('systemNotification.loginAgain'), t('systemNotification.error401'), {
              type: 'error',
              closeOnClickModal: false,
              center: true,
              confirmButtonText: t('button.confirm'),
              showCancelButton: false,
            })
              .then(() => {
                router.replace({ path: '/login' })
                closeLoadingMask(false)
              })
              .catch(() => {})
          } else if (status === 403) {
            ElMessageBox.confirm(t('systemNotification.loggedOutTryAgain'), t('systemNotification.error403'), {
              type: 'error',
              closeOnClickModal: false,
              center: true,
              confirmButtonText: t('button.loginAgain'),
            })
              .then(() => {
                router.replace({ path: '/login' })
                closeLoadingMask(false)
              })
              .catch(() => {})
          } else {
            if (sysConfig.SHOW_NOTIFICATION) {
              ElNotification.error({
                title: `EUK-01-${status}`,
                message: t('systemNotification.unknownError'),
              })
            }
            // eslint-disable-next-line no-console
            console.log('Status Code: ', status, ' Message: ', error || status, ' 未知錯誤！')
            closeLoadingMask(false)
          }
        } else {
          // 無 response（超時或網路中斷）
          // eslint-disable-next-line no-console
          console.log('err timeout >>', (error as any).code)

          if (sysConfig.SHOW_NOTIFICATION) {
            if ((error as any).code === 'ECONNABORTED') {
              ElNotification.error({
                title: 'ETO-01',
                message: t('systemNotification.noRespones'),
              })
            } else {
              ElNotification.error({
                title: 'ETO-02',
                message: t('systemNotification.noRespones'),
              })
            }
          }
          // eslint-disable-next-line no-console
          console.log('請求錯誤 Message: 請求伺服器無回應！')
          closeLoadingMask(false)
        }

        return Promise.reject(error.response ?? error)
      }
    )
  }
}

export function createRequest(config: AxiosRequestConfig = {}) {
  const { instance } = new AxiosProxy(config)

  // 各方法：第二、三參數皆為可選，並回傳已解包的 data
  const get = async <T = unknown, P = unknown>(
    url: string,
    params?: P,
    cfg?: AxiosRequestConfig
  ): Promise<T> => instance.get<T>(url, { ...(cfg || {}), params }).then((r) => r.data)

  const post = async <T = unknown, D = unknown>(
    url: string,
    data?: D,
    cfg?: AxiosRequestConfig
  ): Promise<T> => instance.post<T>(url, data, cfg).then((r) => r.data)

  const put = async <T = unknown, D = unknown>(
    url: string,
    data?: D,
    cfg?: AxiosRequestConfig
  ): Promise<T> => instance.put<T>(url, data, cfg).then((r) => r.data)

  const patch = async <T = unknown, D = unknown>(
    url: string,
    data?: D,
    cfg?: AxiosRequestConfig
  ): Promise<T> => instance.patch<T>(url, data, cfg).then((r) => r.data)

  const del = async <T = unknown, D = unknown>(
    url: string,
    data?: D,
    cfg?: AxiosRequestConfig
  ): Promise<T> =>
    instance.delete<T>(url, { ...(cfg || {}), data }).then((r) => r.data)

  return { get, post, put, patch, delete: del, instance }
}

// 預設單例
export const request = createRequest({ baseURL: '' })

// 供外部觸發關閉 loading mask（邏輯沿用原 JS）
export function closeLoadingMask(status: boolean) {
  eventPayload.status = status
  eventPayload.timestamp = Date.now()
  useAppStore().emitEvent(eventPayload)
}