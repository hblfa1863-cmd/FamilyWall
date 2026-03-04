<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  photo: any
}>()

const emit = defineEmits<{
  close: []
  addComment: [photoId: string, content: string]
  deleteComment: [photoId: string, commentId: string]
}>()

const comment = ref('')

function submitComment() {
  if (!comment.value.trim()) return
  emit('addComment', props.photo.id, comment.value.trim())
  comment.value = ''
}

// 生成头像颜色
function getAvatarColor(name: string) {
  const colors = [
    'from-amber-400 to-orange-500',
    'from-green-400 to-emerald-500',
    'from-blue-400 to-cyan-500',
    'from-purple-400 to-pink-500',
    'from-rose-400 to-red-500',
    'from-teal-400 to-cyan-500',
  ]
  const index = name ? name.charCodeAt(0) % colors.length : 0
  return colors[index]
}

// 格式化相对时间
function formatRelativeTime(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
    <!-- Close Button -->
    <button 
      @click="emit('close')"
      class="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
      aria-label="关闭"
    >
      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>
    
    <div class="flex flex-col lg:flex-row gap-4 max-w-6xl w-full max-h-[90vh] bg-white rounded-3xl overflow-hidden animate-scale-in">
      <!-- Image/Video -->
      <div class="flex-1 bg-black flex items-center justify-center min-h-[300px] lg:min-h-[500px]">
        <img 
          v-if="photo.type === 'image' || !photo.type" 
          :src="photo.urls?.[0] || photo.url" 
          :alt="photo.title"
          class="max-w-full max-h-[70vh] lg:max-h-[80vh] object-contain"
        />
        <video 
          v-else 
          :src="photo.url" 
          controls 
          autoplay
          class="max-w-full max-h-[70vh] lg:max-h-[80vh]"
        ></video>
      </div>
      
      <!-- Info Panel -->
      <div class="w-full lg:w-80 flex flex-col bg-white">
        <!-- Header -->
        <div class="p-6 border-b border-gray-100">
          <h3 class="text-lg font-semibold text-gray-800">{{ photo.title || '无标题' }}</h3>
          <p class="text-sm text-gray-400 mt-1">{{ formatDate(photo.createdAt) }}</p>
        </div>
        
        <!-- Description -->
        <div v-if="photo.description" class="px-6 py-4 border-b border-gray-100">
          <p class="text-gray-600 text-sm">{{ photo.description }}</p>
        </div>
        
        <!-- Comments -->
        <div class="flex-1 overflow-y-auto p-6">
          <h4 class="text-sm font-medium text-gray-500 mb-4">评论 ({{ photo.comments?.length || 0 }})</h4>
          
          <div v-if="photo.comments?.length > 0" class="space-y-4 mb-6">
            <div v-for="comment in photo.comments" :key="comment.id" class="flex gap-3">
              <!-- Avatar -->
              <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 bg-gradient-to-br', getAvatarColor(comment.author)]">
                {{ comment.author?.[0] || '?' }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <p class="text-sm font-medium text-gray-800">{{ comment.author }}</p>
                  <span class="text-xs text-gray-400">{{ formatRelativeTime(comment.createdAt) }}</span>
                </div>
                <p class="text-sm text-gray-600 break-words">{{ comment.text }}</p>
              </div>
            </div>
          </div>
          
          <p v-else class="text-gray-400 text-sm mb-6">暂无评论，快来抢沙发吧~</p>
        </div>
        
        <!-- Comment Form -->
        <div class="p-4 border-t border-gray-100">
          <form @submit.prevent="submitComment" class="flex gap-2">
            <input 
              v-model="comment" 
              type="text" 
              placeholder="写下你的评论..."
              class="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
            <button 
              type="submit"
              :disabled="!comment.trim()"
              class="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              发送
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes scale-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.animate-scale-in {
  animation: scale-in 0.2s ease-out forwards;
}
</style>
