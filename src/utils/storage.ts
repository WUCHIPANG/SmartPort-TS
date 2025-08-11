import { AES } from './crypto'
import config from '@/config'

/**
 * Web Storage 代理（session/local 皆可用）
 * - 盡量維持原本 JS 版本的行為：getItem 可能回傳 '' 或物件，或 null（解析失敗）
 */
class StorageProxy {
  protected storage: Storage

  constructor(storageModel: Storage) {
    this.storage = storageModel
  }

  setItem(key: string, value: unknown): void {
    if (!key) return
    const data = JSON.stringify(value)
    this.storage.setItem(key, data)
  }

  /**
   * 注意：為了相容舊邏輯，可能回傳：
   * - 解析成功：T
   * - 空字串/不存在：''（空字串）
   * - 解析失敗：null
   */
  getItem<T = unknown>(key: string): T | '' | null {
    if (!key) return null
    let data = this.storage.getItem(key)

    if (data === '' || data == null || JSON.stringify(data) === '{}') {
      return '' as ''
    }

    try {
      return JSON.parse(data) as T
    } catch {
      return null
    }
  }

  removeItem(key: string, isAll = false): void {
    if (!key) return
    if (isAll) {
      this.clear()
    } else {
      this.storage.removeItem(key)
    }
  }

  clear(): void {
    this.storage.clear()
  }
}

/**
 * localStorage 代理，支援 AES 與 TTL（秒）
 */
class LocalStorageProxy extends StorageProxy {
  constructor(localStorage: Storage) {
    super(localStorage)
  }

  /**
   * @param key Key
   * @param value 任何可序列化的值
   * @param seconds TTL（秒）。0 代表永不過期。若傳入字串會自動 parseInt
   */
  setItem(key: string, value: unknown, seconds: number | string = 0): void {
    if (!key) return

    // 加密（可選）
    let content: string
    const plain = JSON.stringify(value)
    if (config?.LS_ENCRYPTION === 'AES') {
      content = AES.encrypt(plain, String(config.LS_ENCRYPTION_KEY))
    } else {
      // 未加密時也以字串存放，維持格式一致
      content = plain
    }

    const ttl = typeof seconds === 'string' ? parseInt(seconds, 10) : Number(seconds)
    const cacheValue: { content: string; datetime: number } = {
      content,
      datetime: Number.isFinite(ttl) && ttl > 0 ? Date.now() + ttl * 1000 : 0,
    }

    this.storage.setItem(key, JSON.stringify(cacheValue))
  }

  /**
   * 解析並處理過期 / 解密
   * - 成功：回傳 T
   * - 失敗或過期：null
   */
  getItem<T = unknown>(key: string): T | null {
    if (!key) return null

    const raw = this.storage.getItem(key)
    if (!raw) return null

    try {
      const data = JSON.parse(raw) as { content: string; datetime: number }

      // 過期處理
      if (data.datetime !== 0 && Date.now() > data.datetime) {
        this.storage.removeItem(key)
        return null
      }

      // 解密（可選）
      let payload = data.content
      if (config?.LS_ENCRYPTION === 'AES') {
        payload = AES.decrypt(data.content, String(config.LS_ENCRYPTION_KEY))
      }

      // 內容最終以 JSON 解析還原
      return JSON.parse(payload) as T
    } catch {
      return null
    }
  }
}

export const storageSession = new StorageProxy(window.sessionStorage)
export const storageLocal = new LocalStorageProxy(window.localStorage)