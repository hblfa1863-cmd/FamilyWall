<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { notifications } from '../api'

const emit = defineEmits<{
  close: []
}>()

const notifs = ref<any[]>([])
const loading = ref(true)

async function loadNotifications() {
  loading.value = true
  notifs.value = await notifications.getAll()
  loading.value = false
}

async function markAsRead(notifId: string) {
  await notifications.markRead(notifId)
  const idx = notifs.value.findIndex(n => n.id === notifId)
  if (idx >= 0) notifs.value[idx].read = true
}

function getNotifIcon(type: string) {
  const icons: Record<string, string> = {
    like: '❤️',
    comment: '💬',
    friend_request: '👋',
    family_invite: '🏠'
  }
  return icons[type] || '📢'
}

function getNotifText(notif: any) {
  const texts: Record<string, string> = {
    like: '赞了你的照片',
    comment: '评论了你的照片',
    friend_request: '请求加你为好友',
    family_invite: '邀请你加入家族'
  }
  return texts[notif.type] || '有新通知'
}

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

onMounted(loadNotifications)
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
    <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
        <h3 class="text-lg font-semibold text-gray-800">通知</h3>
        <button @click="emit('close')" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <!-- Notifications List -->
      <div class="flex-1 overflow-y-auto">
        <div v-if="loading" class="text-center py-8 text-gray-400">加载中...</div>
        
        <div v-else-if="notifs.length === 0" class="text-center py-12">
          <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span class="text-3xl">🔔</span>
          </div>
          <p class="text-gray-500">暂无通知</p>
        </div>
        
        <div v-else class="divide-y divide-gray-100">
          <div 
            v-for="notif in notifs" 
            :key="notif.id"
            :class="[
              'flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors cursor-pointer',
              !notif.read ? 'bg-amber-50/50' : ''
            ]"
            @click="!notif.read && markAsRead(notif.id)"
          >
            <!-- Icon -->
            <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg flex-shrink-0">
              {{ getNotifIcon(notif.type) }}
            </div>
            
            <!-- Content -->
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-800">
                <span class="font-medium">{{ notif.fromUsername }}</span>
                {{ getNotifText(notif) }}
              </p>
              <p class="text-xs text-gray-400 mt-1">{{ formatRelativeTime(notif.createdAt) }}</p>
            </div>
            
            <!-- Unread Dot -->
            <div v-if="!notif.read" class="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0 mt-2"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
