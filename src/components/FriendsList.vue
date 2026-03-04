<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { friends } from '../api'

const emit = defineEmits<{
  close: []
  addFriend: []
}>()

const friendsList = ref<any[]>([])
const loading = ref(true)

async function loadFriends() {
  loading.value = true
  friendsList.value = await friends.getAll()
  loading.value = false
}

async function removeFriend(friendId: string) {
  if (!confirm('确定删除这个好友吗？')) return
  await friends.remove(friendId)
  await loadFriends()
}

onMounted(loadFriends)

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
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
    <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
        <h3 class="text-lg font-semibold text-gray-800">好友列表</h3>
        <button @click="emit('close')" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <!-- Add Friend Button -->
      <div class="px-6 py-3 border-b border-gray-50 flex-shrink-0">
        <button 
          @click="emit('addFriend')"
          class="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          添加好友
        </button>
      </div>
      
      <!-- Friends List -->
      <div class="flex-1 overflow-y-auto p-4">
        <div v-if="loading" class="text-center py-8 text-gray-400">加载中...</div>
        
        <div v-else-if="friendsList.length === 0" class="text-center py-8">
          <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span class="text-3xl">👥</span>
          </div>
          <p class="text-gray-500">还没有好友</p>
          <p class="text-gray-400 text-sm mt-1">添加好友一起分享照片吧</p>
        </div>
        
        <div v-else class="space-y-3">
          <div 
            v-for="friend in friendsList" 
            :key="friend.id"
            class="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl"
          >
            <!-- Avatar -->
            <div :class="['w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-medium bg-gradient-to-br', getAvatarColor(friend.username)]">
              {{ friend.username?.[0] || '?' }}
            </div>
            
            <!-- Info -->
            <div class="flex-1 min-w-0">
              <p class="font-medium text-gray-800 truncate">{{ friend.username }}</p>
              <p class="text-sm text-gray-400 truncate">{{ friend.email }}</p>
            </div>
            
            <!-- Delete Button -->
            <button 
              @click="removeFriend(friend.userId)"
              class="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
