<script setup lang="ts">
import type { User, Family } from '../api'

defineProps<{
  user: User | null
  families: Family[]
  currentFamilyId: string
}>()

const emit = defineEmits<{
  switchFamily: [familyId: string]
  createFamily: []
  showInviteCode: []
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
