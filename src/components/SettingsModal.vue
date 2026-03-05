<script setup lang="ts">
import { ref, watch } from 'vue'
import { t, type Locale } from '../i18n'
import { photos, albums } from '../api'

const props = defineProps<{
  locale?: Locale
}>()

const emit = defineEmits<{
  close: []
  logout: []
  localeChange: [locale: Locale]
}>()

// 使用props中的locale
const locale = ref<Locale>(props.locale || 'zh')

// 监听props变化
watch(() => props.locale, (newVal) => {
  if (newVal) {
    locale.value = newVal
  }
})

// 开发者模式
const isDevMode = ref(false)
const isLoadingTestData = ref(false)
const testDataMessage = ref('')

// 连续点击版本号5次开启开发者模式
let versionClickCount = 0
let versionClickTimer: ReturnType<typeof setTimeout> | null = null

function handleVersionClick() {
  versionClickCount++
  if (versionClickCount >= 5) {
    isDevMode.value = true
    versionClickCount = 0
    if (versionClickTimer) clearTimeout(versionClickTimer)
  } else {
    versionClickTimer = setTimeout(() => {
      versionClickCount = 0
    }, 1000)
  }
}

const languages = [
  { value: 'zh', label: '中文', flag: '🇨🇳' },
  { value: 'en', label: 'English', flag: '🇺🇸' }
]

function selectLanguage(newLocale: Locale) {
  locale.value = newLocale
  emit('localeChange', newLocale)
}

function selectLanguage(locale: Locale) {
  locale.value = locale
  emit('localeChange', locale)
}

function handleLogout() {
  emit('logout')
  emit('close')
}

function openUrl(url: string) {
  window.open(url, '_blank')
}

// 添加测试数据
async function addTestData() {
  isLoadingTestData.value = true
  testDataMessage.value = ''
  
  try {
    // 获取当前用户和家族信息
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    if (!token || !userStr) {
      testDataMessage.value = '请先登录'
      return
    }
    
    const user = JSON.parse(userStr)
    
    // 获取家族列表
    const familiesRes = await fetch('https://family-wall-backend.vercel.app/api/families', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const families = await familiesRes.json()
    
    if (!families.data || families.data.length === 0) {
      testDataMessage.value = '请先创建一个家族'
      return
    }
    
    const familyId = families.data[0].id
    
    // 获取或创建相册
    let albumRes = await fetch(`https://family-wall-backend.vercel.app/api/families/${familyId}/albums`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    let albumData = await albumRes.json()
    
    let albumId
    if (albumData.data && albumData.data.length > 0) {
      albumId = albumData.data[0].id
    } else {
      // 创建测试相册
      const createAlbumRes = await fetch(`https://family-wall-backend.vercel.app/api/families/${familyId}/albums`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          name: '测试相册', 
          description: '用于测试的照片相册',
          privacy: 'private'
        })
      })
      const createAlbumData = await createAlbumRes.json()
      if (createAlbumData.data?.id) {
        albumId = createAlbumData.data.id
      }
    }
    
    if (!albumId) {
      testDataMessage.value = '无法创建相册'
      return
    }
    
    // 生成不同月份的照片数据
    const months = [
      { name: '2025年1月', date: '2025-01-15' },
      { name: '2025年2月', date: '2025-02-20' },
      { name: '2025年3月', date: '2025-03-10' },
      { name: '2025年4月', date: '2025-04-05' },
      { name: '2025年5月', date: '2025-05-18' },
      { name: '2025年6月', date: '2025-06-22' },
      { name: '2025年7月', date: '2025-07-14' },
      { name: '2025年8月', date: '2025-08-08' },
      { name: '2025年9月', date: '2025-09-21' },
      { name: '2025年10月', date: '2025-10-01' },
      { name: '2025年11月', date: '2025-11-11' },
      { name: '2025年12月', date: '2025-12-25' }
    ]
    
    // 使用免费的图片URL
    const sampleImages = [
      'https://picsum.photos/seed/photo1/800/600',
      'https://picsum.photos/seed/photo2/800/600',
      'https://picsum.photos/seed/photo3/800/600',
      'https://picsum.photos/seed/photo4/800/600',
      'https://picsum.photos/seed/photo5/800/600',
      'https://picsum.photos/seed/photo6/800/600',
      'https://picsum.photos/seed/photo7/800/600',
      'https://picsum.photos/seed/photo8/800/600',
      'https://picsum.photos/seed/photo9/800/600',
      'https://picsum.photos/seed/photo10/800/600',
      'https://picsum.photos/seed/photo11/800/600',
      'https://picsum.photos/seed/photo12/800/600'
    ]
    
    const titles = [
      '新年伊始', '春日踏青', '春暖花开', '绿意盎然', '春雨绵绵',
      '夏日清凉', '阳光灿烂', '海边度假', '夏日回忆', '暑假趣事',
      '秋高气爽', '金色秋天'
    ]
    
    let successCount = 0
    for (let i = 0; i < months.length; i++) {
      const month = months[i]
      const photoData = {
        urls: [sampleImages[i]],
        type: 'image',
        title: titles[i],
        description: `${month.name}的美好回忆`,
        albumId: albumId,
        // 尝试设置特定日期
        createdAt: new Date(month.date).toISOString()
      }
      
      try {
        const photoRes = await fetch(`https://family-wall-backend.vercel.app/api/families/${familyId}/photos`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify(photoData)
        })
        const photoResult = await photoRes.json()
        if (photoResult.success !== false) {
          successCount++
        }
      } catch (e) {
        console.error('Error creating photo:', e)
      }
    }
    
    testDataMessage.value = `成功添加 ${successCount} 张测试照片！`
    
  } catch (e) {
    testDataMessage.value = '添加测试数据失败: ' + String(e)
  } finally {
    isLoadingTestData.value = false
  }
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
        <h3 class="text-lg font-semibold text-gray-800">{{ t('nav.security', locale) }}</h3>
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
                locale === lang.value 
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
              <p class="font-medium text-gray-800">{{ t('profile.edit', locale) }}</p>
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
              <p class="font-medium text-red-600">{{ t('nav.logout', locale) }}</p>
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
          <button @click="handleVersionClick" class="text-xs text-gray-400 hover:text-gray-500">PhotoWall v1.0.0</button>
        </div>
        
        <!-- Developer Mode Section -->
        <div v-if="isDevMode" class="mt-4 p-4 bg-purple-50 rounded-2xl border border-purple-200">
          <h4 class="text-sm font-medium text-purple-800 mb-3">🛠️ 开发者选项</h4>
          
          <button 
            @click="addTestData"
            :disabled="isLoadingTestData"
            class="w-full py-3 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <svg v-if="isLoadingTestData" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isLoadingTestData ? '添加中...' : '➕ 添加测试数据' }}</span>
          </button>
          
          <p v-if="testDataMessage" class="mt-2 text-xs text-purple-600 text-center">{{ testDataMessage }}</p>
          
          <p class="mt-3 text-xs text-purple-500">将添加12张不同月份的照片，用于测试时光轴功能</p>
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
