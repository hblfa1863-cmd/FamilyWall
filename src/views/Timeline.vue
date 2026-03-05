<script setup lang="ts">
import { computed } from 'vue'
import type { Photo } from '../types'

const props = defineProps<{
  photos: Photo[]
}>()

const emit = defineEmits<{
  selectPhoto: [photo: Photo]
}>()

// 按月份分组的照片
interface TimelineGroup {
  key: string
  name: string
  year: number
  month: number
  photos: Photo[]
}

const timeline = computed((): TimelineGroup[] => {
  const groups: Record<string, TimelineGroup> = {}
  
  for (const photo of props.photos) {
    const date = new Date(photo.createdAt)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const monthName = date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })
    
    if (!groups[monthKey]) {
      groups[monthKey] = { 
        key: monthKey, 
        name: monthName, 
        year: date.getFullYear(),
        month: date.getMonth(),
        photos: [] 
      }
    }
    groups[monthKey].photos.push(photo)
  }
  
  // 按月份倒序（最新的在前）
  return Object.entries(groups)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([key, value]) => ({ key, ...value }))
})

// 获取月份的emoji
function getMonthEmoji(month: number): string {
  const emojis = ['🥶', '❄️', '🌸', '🌿', '🌧️', '☀️', '🌞', '🏖️', '🍂', '🍁', '🌨️', '🎄']
  return emojis[month]
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}
</script>

<template>
  <div class="py-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-2xl sm:text-3xl font-semibold text-gray-800 font-display">时光轴</h2>
        <p class="text-gray-400 mt-1">{{ photos.length }} 张照片</p>
      </div>
    </div>
    
    <!-- Timeline -->
    <div v-if="photos.length > 0" class="space-y-8">
      <div v-for="group in timeline" :key="group.key" class="relative">
        <!-- Month Header with Line -->
        <div class="flex items-center gap-4 mb-6">
          <div class="flex-1 h-px bg-gradient-to-r from-amber-300 to-transparent"></div>
          <div class="flex items-center gap-3 px-4 py-2 bg-white rounded-full shadow-sm border border-amber-100">
            <span class="text-2xl">{{ getMonthEmoji(group.month) }}</span>
            <div class="text-center">
              <h3 class="text-lg font-semibold text-gray-800">{{ group.name }}</h3>
              <p class="text-xs text-gray-400">{{ group.photos.length }} 张照片</p>
            </div>
          </div>
          <div class="flex-1 h-px bg-gradient-to-l from-amber-300 to-transparent"></div>
        </div>
        
        <!-- Photos Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          <div 
            v-for="photo in group.photos" 
            :key="photo.id"
            class="group relative aspect-[4/5] sm:aspect-square overflow-hidden rounded-2xl sm:rounded-3xl cursor-pointer bg-gray-100"
            @click="emit('selectPhoto', photo)"
          >
            <img 
              v-if="photo.type === 'image' || !photo.type" 
              :src="photo.urls?.[0] || photo.url" 
              :alt="photo.title || '照片'"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <video 
              v-else 
              :src="photo.url" 
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              muted
              loop
              playsinline
            />
            
            <!-- Date Badge -->
            <div class="absolute bottom-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg">
              <p class="text-white text-xs">{{ formatDate(photo.createdAt) }}</p>
            </div>
            
            <!-- Video Badge -->
            <div v-if="photo.type === 'video'" class="absolute top-3 right-3 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else class="text-center py-20">
      <div class="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
        <span class="text-4xl">📅</span>
      </div>
      <h3 class="text-xl text-gray-600 mb-2">还没有照片</h3>
      <p class="text-gray-400">上传照片开始记录时光</p>
    </div>
  </div>
</template>
