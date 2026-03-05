<script setup lang="ts">
import { ref, inject, computed } from 'vue'
import { t, type Locale } from '../i18n'

const emit = defineEmits<{
  close: []
  logout: []
  localeChange: [locale: Locale]
}>()

const currentLocale = ref<Locale>('zh')

const languages = [
  { value: 'zh', label: '中文', flag: '🇨🇳' },
  { value: 'en', label: 'English', flag: '🇺🇸' }
]

function selectLanguage(locale: Locale) {
  currentLocale.value = locale
  emit('localeChange', locale)
}

function handleLogout() {
  emit('logout')
  emit('close')
}

function openUrl(url: string) {
  window.open(url, '_blank')
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="emit('close')"></div>
    
    <!-- Sheet -->
    <div class="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-md max-h-[85vh] overflow-hidden animate-slide-up sm:animate-scale-in">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-800">{{ t('nav.security', currentLocale) }}</h3>
        <button @click="emit('close')" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <!-- Content -->
      <div class="p-4 space-y-3 overflow-y-auto max-h-[calc(85vh-80px)] sm:max-h-[60vh]">
        <!-- Language Section -->
        <div class="bg-gray-50 rounded-2xl p-4">
          <h4 class="text-sm font-medium text-gray-500 mb-3">语言 / Language</h4>
          <div class="flex gap-2">
            <button 
              v-for="lang in languages"
              :key="lang.value"
              @click="selectLanguage(lang.value as Locale)"
              :class="[
                'flex-1 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2',
                currentLocale === lang.value 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              ]"
            >
              <span>{{ lang.flag }}</span>
              <span>{{ lang.label }}</span>
            </button>
          </div>
        </div>
        
        <!-- Menu Items -->
        <div class="space-y-2">
          <!-- Profile -->
          <button 
            class="w-full p-4 bg-gray-50 rounded-2xl flex items-center gap-4 hover:bg-gray-100 transition-colors"
          >
            <div class="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white">
              👤
            </div>
            <div class="text-left">
              <p class="font-medium text-gray-800">{{ t('profile.edit', currentLocale) }}</p>
              <p class="text-xs text-gray-500">修改个人资料</p>
            </div>
            <svg class="w-5 h-5 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
          
          <!-- Terms of Service -->
          <button 
            @click="openUrl('#')"
            class="w-full p-4 bg-gray-50 rounded-2xl flex items-center gap-4 hover:bg-gray-100 transition-colors"
          >
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              📄
            </div>
            <div class="text-left">
              <p class="font-medium text-gray-800">用户协议</p>
              <p class="text-xs text-gray-500">服务条款与使用协议</p>
            </div>
            <svg class="w-5 h-5 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </button>
          
          <!-- Privacy Policy -->
          <button 
            @click="openUrl('#')"
            class="w-full p-4 bg-gray-50 rounded-2xl flex items-center gap-4 hover:bg-gray-100 transition-colors"
          >
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              🔒
            </div>
            <div class="text-left">
              <p class="font-medium text-gray-800">隐私政策</p>
              <p class="text-xs text-gray-500">数据保护与隐私说明</p>
            </div>
            <svg class="w-5 h-5 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </button>
          
          <!-- Logout -->
          <button 
            @click="handleLogout"
            class="w-full p-4 bg-red-50 rounded-2xl flex items-center gap-4 hover:bg-red-100 transition-colors"
          >
            <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
              🚪
            </div>
            <div class="text-left">
              <p class="font-medium text-red-600">{{ t('nav.logout', currentLocale) }}</p>
              <p class="text-xs text-red-400">退出当前账户</p>
            </div>
            <svg class="w-5 h-5 text-red-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
          
          <!-- Delete Account -->
          <button 
            class="w-full p-4 rounded-2xl flex items-center gap-4 hover:bg-gray-50 transition-colors"
          >
            <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
              🗑️
            </div>
            <div class="text-left">
              <p class="font-medium text-gray-500">注销账户</p>
              <p class="text-xs text-gray-400">删除所有数据且不可恢复</p>
            </div>
            <svg class="w-5 h-5 text-gray-300 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
        
        <!-- Version Info -->
        <div class="text-center pt-4 pb-2">
          <p class="text-xs text-gray-400">PhotoWall v1.0.0</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out forwards;
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.sm\:animate-scale-in {
  animation: scale-in 0.2s ease-out forwards;
}
</style>
