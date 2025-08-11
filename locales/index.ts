import { createI18n, type I18n } from 'vue-i18n'
import type { App } from 'vue'
import { storageLocal } from '@/utils/storage'
import config from '@/config'
import elEN from 'element-plus/es/locale/lang/en'
import elTW from 'element-plus/es/locale/lang/zh-tw'
import elCN from 'element-plus/es/locale/lang/zh-cn'

export type LocaleKey = 'zh' | 'en' | 'cn'
type LocaleSchema = Record<string, any>
type MergedLocale = LocaleSchema & { el: any }

// 正確的 glob（因為檔案在 /locales）
function siphonI18n(prefix: 'zh-TW'|'en-US'|'zh-CN' = 'zh-TW'): LocaleSchema {
  const modules = import.meta.glob<{ default: LocaleSchema }>(
    './lang/*.json',
    { eager: true }
  )
  const all = Object.fromEntries(
    Object.entries(modules).map(([k, m]) => {
      const name = k.split('/').pop()!.replace(/\.json$/i, '')
      return [name, (m as any).default ?? m]
    })
  ) as Record<string, LocaleSchema>
  return all[prefix] ?? {}
}

export const localesConfigs: Record<LocaleKey, MergedLocale> = {
  zh: { ...siphonI18n('zh-TW'), el: elTW },
  en: { ...siphonI18n('en-US'), el: elEN },
  cn: { ...siphonI18n('zh-CN'), el: elCN },
}

const isLocale = (x: any): x is LocaleKey => x === 'zh' || x === 'en' || x === 'cn'
const saved = storageLocal.getItem<string>('APP_LANG')
const cfg = (config as any).LANG
const defaultLocale: LocaleKey = isLocale(saved) ? saved : isLocale(cfg) ? cfg : 'zh'

export const i18n: I18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: defaultLocale,  // 'zh' | 'en' | 'cn'
  fallbackLocale: 'zh',   // 找不到時不要回 key
  messages: localesConfigs,
})

export function setupI18n(app: App) { app.use(i18n) }
export const t = (key: string, ...args: any[]) => (i18n.global as any).t(key, ...(args as [])) as string
export function setLocale(l: LocaleKey) {
  const loc = i18n.global.locale
  typeof loc === 'string' ? ((i18n.global as any).locale = l) : (loc.value = l)
}