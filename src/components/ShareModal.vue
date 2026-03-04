<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  photoUrl?: string
  familyName?: string
}>()

const emit = defineEmits<{
  close: []
}>()

const copied = ref(false)

// 生成分享链接（这里用当前页面URL作为示例）
const shareUrl = ref(props.photoUrl || window.location.href)

async function copyLink() {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch {
    alert('复制失败，请手动复制')
  }
}

// 分享到社交平台
function shareTo(type: string) {
  const text = `来看看「${props.familyName || '照片墙'}」的照片！`
  const url = encodeURIComponent(shareUrl.value)
  const textEncoded = encodeURIComponent(text)
  
  const urls: Record<string, string> = {
    weibo: `https://service.weibo.com/share/share.php?url=${url}&title=${textEncoded}`,
    qq: `https://connect.qq.com/widget/shareqq/index.html?url=${url}&title=${textEncoded}`,
    weixin: 'https://qrcode.png' // 微信需要二维码
  }
  
  if (urls[type]) {
    window.open(urls[type], '_blank')
  }
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
    <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-800">分享照片</h3>
        <button @click="emit('close')" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <!-- Content -->
      <div class="p-6">
        <!-- Share Link -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">分享链接</label>
          <div class="flex gap-2">
            <input 
              :value="shareUrl" 
              readonly
              class="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600"
            />
            <button 
              @click="copyLink"
              :class="[
                'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                copied 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg'
              ]"
            >
              {{ copied ? '✓ 已复制' : '复制' }}
            </button>
          </div>
        </div>
        
        <!-- Social Share -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">分享到</label>
          <div class="flex justify-center gap-4">
            <button 
              @click="shareTo('weibo')"
              class="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white text-xl hover:scale-110 transition-transform"
            >
              �微博
            </button>
            <button 
              @click="shareTo('qq')"
              class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl hover:scale-110 transition-transform"
            >
              QQ
            </button>
            <button 
              @click="copyLink"
              class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl hover:scale-110 transition-transform"
            >
              📱
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
