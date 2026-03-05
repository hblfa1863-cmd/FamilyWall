<script setup lang="ts">
import { ref, computed } from 'vue'
import { t, type Locale } from '../i18n'

type ShareType = 'photo' | 'album'
type Platform = 'weibo' | 'qq' | 'weixin' | 'telegram' | 'facebook' | 'whatsapp' | 'instagram' | 'pinterest' | 'xiaohongshu' | 'douyin' | 'tiktok'

const props = defineProps<{
  photoUrl?: string
  photoUrls?: string[]
  albumName?: string
  albumId?: string
  currentLocale?: Locale
}>()

const emit = defineEmits<{
  close: []
}>()

const currentLocale = computed(() => props.currentLocale || 'zh')

// 分享类型
const shareType = ref<ShareType>('photo')

// 复制状态
const copied = ref(false)

// 分享链接
const shareUrl = ref(props.photoUrl || props.photoUrls?.[0] || '')
const shareText = computed(() => {
  if (shareType.value === 'album' && props.albumName) {
    return `Check out my album "${props.albumName}" on PhotoWall!`
  }
  return props.photoUrl ? 'Check out this photo on PhotoWall!' : 'Check out PhotoWall!'
})

// 社交平台配置
const platforms = computed(() => [
  { 
    id: 'weibo' as Platform, 
    name: t('share.platforms.weibo', currentLocale.value), 
    icon: '🐟', 
    color: '#E6162D',
    url: `https://service.weibo.com/share/share.php?url=${encodeURIComponent(shareUrl.value)}&title=${encodeURIComponent(shareText.value)}`
  },
  { 
    id: 'qq' as Platform, 
    name: t('share.platforms.qq', currentLocale.value), 
    icon: '🐧', 
    color: '#12B7F5',
    url: `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(shareUrl.value)}&title=${encodeURIComponent(shareText.value)}`
  },
  { 
    id: 'weixin' as Platform, 
    name: t('share.platforms.weixin', currentLocale.value), 
    icon: '💚', 
    color: '#07C160',
    showQR: true
  },
  { 
    id: 'telegram' as Platform, 
    name: t('share.platforms.telegram', currentLocale.value), 
    icon: '✈️', 
    color: '#0088CC',
    url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl.value)}&text=${encodeURIComponent(shareText.value)}`
  },
  { 
    id: 'facebook' as Platform, 
    name: t('share.platforms.facebook', currentLocale.value), 
    icon: '📘', 
    color: '#1877F2',
    url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl.value)}`
  },
  { 
    id: 'whatsapp' as Platform, 
    name: t('share.platforms.whatsapp', currentLocale.value), 
    icon: '💬', 
    color: '#25D366',
    url: `https://wa.me/?text=${encodeURIComponent(shareText.value + ' ' + shareUrl.value)}`
  },
  { 
    id: 'instagram' as Platform, 
    name: t('share.platforms.instagram', currentLocale.value), 
    icon: '📸', 
    color: '#E4405F',
    showQR: true
  },
  { 
    id: 'pinterest' as Platform, 
    name: t('share.platforms.pinterest', currentLocale.value), 
    icon: '📌', 
    color: '#BD081C',
    url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl.value)}&description=${encodeURIComponent(shareText.value)}`
  },
  { 
    id: 'xiaohongshu' as Platform, 
    name: t('share.platforms.xiaohongshu', currentLocale.value), 
    icon: '📕', 
    color: '#FE2C55',
    showQR: true
  },
  { 
    id: 'douyin' as Platform, 
    name: t('share.platforms.douyin', currentLocale.value), 
    icon: '🎵', 
    color: '#000000',
    showQR: true
  },
  { 
    id: 'tiktok' as Platform, 
    name: t('share.platforms.tiktok', currentLocale.value), 
    icon: '🎶', 
    color: '#000000',
    showQR: true
  }
])

// 显示二维码的平台
const showQRCode = ref<Platform | null>(null)

async function copyLink() {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch {
    alert('Copy failed, please copy manually')
  }
}

function shareTo(platform: typeof platforms.value[0]) {
  if (platform.showQR) {
    showQRCode.value = platform.id
    return
  }
  if (platform.url) {
    window.open(platform.url, '_blank', 'width=600,height=400')
  }
}

function closeQR() {
  showQRCode.value = null
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
    <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-800">{{ t('share.title', currentLocale) }}</h3>
        <button @click="emit('close')" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <!-- Content -->
      <div class="p-6">
        <!-- Share Type Tabs -->
        <div class="flex mb-6 bg-gray-100 rounded-xl p-1">
          <button 
            @click="shareType = 'photo'"
            :class="[
              'flex-1 py-2 rounded-lg text-sm font-medium transition-all',
              shareType === 'photo' 
                ? 'bg-white text-amber-600 shadow-sm' 
                : 'text-gray-500'
            ]"
          >
            {{ t('share.sharePhoto', currentLocale) }}
          </button>
          <button 
            @click="shareType = 'album'"
            :class="[
              'flex-1 py-2 rounded-lg text-sm font-medium transition-all',
              shareType === 'album' 
                ? 'bg-white text-amber-600 shadow-sm' 
                : 'text-gray-500'
            ]"
          >
            {{ t('share.shareAlbum', currentLocale) }}
          </button>
        </div>
        
        <!-- Share Link -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('share.shareLink', currentLocale) }}</label>
          <div class="flex gap-2">
            <input 
              :value="shareUrl" 
              readonly
              class="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 truncate"
            />
            <button 
              @click="copyLink"
              :class="[
                'px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap',
                copied 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg'
              ]"
            >
              {{ copied ? t('actions.copied', currentLocale) : t('actions.copy', currentLocale) }}
            </button>
          </div>
        </div>
        
        <!-- Social Platforms -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">{{ t('share.shareTo', currentLocale) }}</label>
          <div class="grid grid-cols-4 gap-3">
            <button 
              v-for="platform in platforms"
              :key="platform.id"
              @click="shareTo(platform)"
              class="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div 
                class="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-sm transition-transform group-hover:scale-110"
                :style="{ backgroundColor: platform.color }"
              >
                {{ platform.icon }}
              </div>
              <span class="text-xs text-gray-500">{{ platform.name }}</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- QR Code Modal -->
      <Transition name="fade">
        <div v-if="showQRCode" class="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6" @click.self="closeQR">
          <button @click="closeQR" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          
          <div class="w-48 h-48 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 border-2 border-dashed border-gray-300">
            <span class="text-6xl">📱</span>
          </div>
          
          <p class="text-sm text-gray-600 text-center mb-4">
            Scan QR code with {{ platforms.find(p => p.id === showQRCode)?.name }}
          </p>
          
          <p class="text-xs text-gray-400 text-center">
            {{ shareUrl.substring(0, 30) }}...
          </p>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
