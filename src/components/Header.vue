<script setup lang="ts">
import type { User, Family } from '../api'

defineProps<{
  user: User | null
  families: Family[]
  currentFamilyId: string
  unreadCount?: number
}>()

const emit = defineEmits<{
  switchFamily: [familyId: string]
  createFamily: []
  showInviteCode: []
  showNotifications: []
  showFriends: []
  showShare: []
  logout: []
}>()
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-amber-100/50 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
      <div class="flex items-center justify-between gap-4">
        <!-- Logo & Title -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-lg shadow-amber-500/20">
            🏠
          </div>
          <div>
            <h1 class="text-lg sm:text-xl font-semibold text-gray-800">照片墙</h1>
            <p class="text-xs text-gray-400 hidden sm:block">记录每一刻珍贵回忆</p>
          </div>
        </div>
        
        <!-- Right Side -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Share Button -->
          <button 
            @click="emit('showShare')"
            class="p-2 text-gray-500 hover:text-amber-600 transition-colors"
            title="分享"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
            </svg>
          </button>
          
          <!-- Friends Button -->
          <button 
            @click="emit('showFriends')"
            class="p-2 text-gray-500 hover:text-amber-600 transition-colors"
            title="好友"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </button>
          
          <!-- Notifications Button -->
          <button 
            @click="emit('showNotifications')"
            class="relative p-2 text-gray-500 hover:text-amber-600 transition-colors"
            title="通知"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <span 
              v-if="unreadCount && unreadCount > 0"
              class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
            >
              {{ unreadCount > 9 ? '9+' : unreadCount }}
            </span>
          </button>
          
          <!-- Family Selector -->
          <select 
            v-if="families.length > 0" 
            :value="currentFamilyId" 
            @change="emit('switchFamily', ($event.target as HTMLSelectElement).value)"
            class="px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer"
          >
            <option v-for="f in families" :key="f.id" :value="f.id">{{ f.name }}</option>
          </select>
          
          <!-- Action Buttons -->
          <button 
            @click="emit('createFamily')" 
            class="hidden sm:inline-flex px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-sm text-gray-700 hover:bg-amber-100 transition-colors"
          >
            + 新建家族
          </button>
          
          <button 
            @click="emit('showInviteCode')" 
            class="hidden sm:inline-flex px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-sm text-gray-700 hover:bg-amber-100 transition-colors"
          >
            邀请码
          </button>
          
          <!-- User Info -->
          <span class="text-sm text-gray-500 hidden sm:inline">{{ user?.username }}</span>
          
          <button 
            @click="emit('logout')" 
            class="text-amber-600 hover:text-amber-700 text-sm font-medium"
          >
            退出
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
