import { ref, computed, inject, type Ref } from 'vue'
import { t as translate, type Locale } from '../i18n'

export function useI18n() {
  const locale = inject<Ref<Locale>>('locale', ref('zh'))
  
  const t = (key: string): string => {
    return translate(key, locale.value)
  }

  const setLocale = (newLocale: Locale) => {
    locale.value = newLocale
    localStorage.setItem('locale', newLocale)
  }

  const availableLocales: Locale[] = ['zh', 'en']

  return {
    locale,
    t,
    setLocale,
    availableLocales
  }
}
