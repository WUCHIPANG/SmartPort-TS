import { defineStore } from 'pinia'
import sysConfig from '@/config'
import { storageLocal } from '@/utils/storage'
import type { LocaleKey } from '@locales'
import { setLocale } from '@locales'

const LANG_KEY = 'APP_LANG'

interface LoadingMask {
  status: boolean
  timestamp: number
}

interface AppState {
  language: LocaleKey
  loadingMask: LoadingMask | null
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    // 語系
    language: storageLocal.getItem(LANG_KEY) || sysConfig.LANG,
    // Loading
    loadingMask: null,
  }),
  actions: {
    toggleLanguage(val: LocaleKey) {
      storageLocal.setItem(LANG_KEY, val)
      this.language = val
      setLocale(val) // 立即切換 i18n
    },
    resetLanguage() {
      const def = sysConfig.LANG as LocaleKey
      storageLocal.setItem(LANG_KEY, sysConfig.LANG)
      this.language = sysConfig.LANG
      setLocale(def)
    },
    emitEvent(data: LoadingMask) {
      this.loadingMask = {
        status: data.status,
        timestamp: data.timestamp,
      }
    },
  },
})
