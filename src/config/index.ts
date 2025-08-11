export type LocaleKey = 'zh' | 'en' | 'cn'

export interface AppConfig {
  APP_NAME: string
  APP_NAME_SUB: string
  DASHBOARD_URL: string
  APP_VER: string
  LANG: LocaleKey

  API_URL: string
  WS_URL: string

  BRAND_IMG_URL: string
  EVENT_IMG_URL: string
  EVENT_THUMBNAIL_IMG_URL: string

  TIMEOUT: number
  TOKEN_NAME: string
  TOKEN_PREFIX: string
  HEADERS: Record<string, string>
  REQUEST_CACHE: boolean
  SHOW_NOTIFICATION: boolean

  LS_ENCRYPTION: '' | 'AES'
  LS_ENCRYPTION_KEY: string
  /** @deprecated 舊專案若仍引用此鍵名，可暫時保留以相容 */
  LS_ENCRYPTION_key?: string

  NO_FLY_ZONE_RANGE: number
}

const IS_DEV = import.meta.env.VITE_NODE_ENV === 'development'
const USE_PROXY = import.meta.env.VITE_APP_PROXY === 'true'

const DEFAULT_CONFIG: AppConfig = {
  // 標題
  APP_NAME: import.meta.env.VITE_APP_TITLE,

  // 次標題，無則留空
  APP_NAME_SUB: '',

  // 首頁地址
  DASHBOARD_URL: '/dashboard',

  // 版本號
  APP_VER: '1.1.0',

  // 語言
  LANG: 'zh',

  // 接口地址
  API_URL: IS_DEV && USE_PROXY
    ? '/apis'
    : import.meta.env.VITE_APP_API_BASE_URL,

  // 若要在 local 的 preview 才走代理可改下面這行（備註）：
  // API_URL: import.meta.env.VITE_NODE_ENV !== 'production' && USE_PROXY ? '/apis' : import.meta.env.VITE_APP_API_BASE_URL,

  // WebSocket
  WS_URL: import.meta.env.VITE_APP_WS_BASE_URL,

  // 圖片 URL
  BRAND_IMG_URL: import.meta.env.VITE_APP_BRAND_IMG_URL,
  EVENT_IMG_URL: import.meta.env.VITE_APP_EVENT_IMG_URL,
  EVENT_THUMBNAIL_IMG_URL: import.meta.env.VITE_APP_EVENT_THUMBNAIL_IMG_URL,

  // 請求超時
  TIMEOUT: 20000,

  // Token
  TOKEN_NAME: 'Authorization',
  TOKEN_PREFIX: 'Bearer ',

  // 追加其他頭
  HEADERS: {},

  // 是否開啟快取
  REQUEST_CACHE: false,

  // AXIOS Error Response 是否顯示通知
  SHOW_NOTIFICATION: import.meta.env.VITE_NODE_ENV !== 'production',

  // localStorage 加密
  LS_ENCRYPTION: '',
  LS_ENCRYPTION_KEY: '2XNN4K8LC0ELVWN4',
  // 相容舊鍵名（可之後移除）
  LS_ENCRYPTION_key: '2XNN4K8LC0ELVWN4',

  // 地圖禁限航區取得範圍 (米)
  NO_FLY_ZONE_RANGE: 5000,
}

export default DEFAULT_CONFIG