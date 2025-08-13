import config from '@/config'
import { useAppStore } from '@/stores'
import { useI18n } from 'vue-i18n'

export function useToggleLang() {
  const { locale, t } = useI18n()
  const route = useRoute()
  const appStore = useAppStore()

  function toggleLang(lang) {
    locale.value = lang
    appStore.toggleLanguage(lang)
  }

  function changeTitle(meta) {
    const title = meta.i18nTitle ? t(meta.i18nTitle) : meta.title
    document.title = meta?.title ? `${title} - ${config.APP_NAME}` : `${config.APP_NAME}`
  }

  watch(locale, () => {
    changeTitle(route.meta)
  })

  return {
    t,
    route,
    locale,
    toggleLang,
  }
}
