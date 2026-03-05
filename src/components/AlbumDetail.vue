<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Photo } from '../types'

const props = defineProps<{
  photos: Photo[]
  albumName: string
}>()

const emit = defineEmits<{
  close: []
  selectPhoto: [photo: Photo]
  upload: []
}>()

// 照片分组（按日期）
const groupedPhotos = computed(() => {
  const groups: Record<string, Photo[]> = {}
  
  for (const photo of props.photos) {
    const date = new Date(photo.createdAt)
    const dateKey = date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'numeric', day: 'numeric' })
    
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(photo)
  }
  
  return Object.entries(groups).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
})

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}
</script>

<template>
  <div class="fixed inset-0 z-50 bg-[#FFFEF8] overflow-y-auto">
    <!-- Header -->
    <div class="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-amber-100/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button 
              @click="emit('close')"
              class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-amber-50 transition-colors"
            >
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <div>
              <h2 class="text-xl font-semibold text-gray-800">{{ albumName }}</h2>
              <p class="text-sm text-gray-400">{{ photos.length }} 张照片</p>
            </div>
          </div>
          
          <button 
            @click="emit('upload')"
            class="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-full hover:shadow-lg hover:shadow-amber-500/30 transition-all"
          >
            + 上传
          </button>
        </div>
      </div>
    </div>
    
    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Empty State -->
      <div v-if="photos.length === 0" class="text-center py-20">
        <div class="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <span class="text-4xl">📷</span>
        </div>
        <h3 class="text-xl text-gray-600 mb-2">还没有照片</h3>
        <p class="text-gray-400 mb-6">上传第一张照片到这个相册</p>
        <button 
          @click="emit('upload')"
          class="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-full hover:shadow-lg hover:shadow-amber-500/30 transition-all"
        >
          上传照片
        </button>
      </div>
      
      <!-- Photo Groups -->
      <div v-else class="space-y-10">
        <div v-for="[date, datePhotos] in groupedPhotos" :key="date">
          <!-- Date Header -->
          <h3 class="text-lg font-medium text-gray-600 mb-4 flex items-center gap-2">
            <span class="w-2 h-2 bg-amber-500 rounded-full"></span>
            {{ date }}
            <span class="text-sm text-gray-400">({{ datePhotos.length }}张)</span>
          </h3>
          
          <!-- Photos Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div 
              v-for="photo in datePhotos" 
              :key="photo.id"
              class="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer bg-gray-100"
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
              
              <!-- Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                <p class="text-white font-medium text-sm truncate">{{ photo.title || photo.description || '无标题' }}</p>
                <p class="text-white/70 text-xs mt-1">{{ formatDate(photo.createdAt) }}</p>
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
    </div>
  </div>
</template>
