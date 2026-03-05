<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Photo } from '../types'

const props = defineProps<{
  photos: Photo[]
  familyName?: string
  canUpload: boolean
}>()

const emit = defineEmits<{
  selectPhoto: [photo: Photo]
  openUpload: []
  deletePhotos: [ids: string[]]
}>()

// 排序状态
type SortOption = 'newest' | 'oldest' | 'name'
const sortBy = ref<SortOption>('newest')

// 排序后的照片
const sortedPhotos = computed(() => {
  const list = [...props.photos]
  switch (sortBy.value) {
    case 'newest':
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    case 'oldest':
      return list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    case 'name':
      return list.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
    default:
      return list
  }
})

// 批量选择状态
const selectedIds = ref<Set<string>>(new Set())
const isSelectionMode = ref(false)

// 切换选择模式
function toggleSelectionMode() {
  isSelectionMode.value = !isSelectionMode.value
  if (!isSelectionMode.value) {
    selectedIds.value.clear()
  }
}

// 切换单个选择
function toggleSelect(photoId: string) {
  if (selectedIds.value.has(photoId)) {
    selectedIds.value.delete(photoId)
  } else {
    selectedIds.value.add(photoId)
  }
}

// 全选
function selectAll() {
  if (selectedIds.value.size === sortedPhotos.value.length) {
    selectedIds.value.clear()
  } else {
    selectedIds.value = new Set(sortedPhotos.value.map(p => p.id))
  }
}

// 删除选中
function deleteSelected() {
  if (selectedIds.value.size === 0) return
  if (confirm(`确定删除选中的 ${selectedIds.value.size} 张照片吗？`)) {
    emit('deletePhotos', Array.from(selectedIds.value))
    selectedIds.value.clear()
    isSelectionMode.value = false
  }
}

// 是否有选中
const hasSelection = computed(() => selectedIds.value.size > 0)

// 格式化日期
function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}
</script>

<template>
  <div class="py-6">
    <!-- Header with Actions -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl sm:text-3xl font-semibold text-gray-800 font-display">
          {{ familyName || '美好时光' }}
        </h2>
        <p class="text-gray-400 mt-1">
          {{ photos.length }} 张照片
        </p>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex items-center gap-2">
        <!-- Selection Toggle -->
        <button 
          @click="toggleSelectionMode"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-all',
            isSelectionMode 
              ? 'bg-amber-500 text-white' 
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          ]"
        >
          {{ isSelectionMode ? '取消选择' : '选择' }}
        </button>
        
        <!-- Sort Options - Custom Button Group -->
        <div v-if="photos.length > 0 && !isSelectionMode" class="flex items-center bg-white rounded-full p-1 border border-gray-200">
          <button 
            v-for="option in [
              { value: 'newest', label: '最新', icon: '⬆️' },
              { value: 'oldest', label: '最早', icon: '⬇️' },
              { value: 'name', label: '名称', icon: '📝' }
            ]"
            :key="option.value"
            @click="sortBy = option.value as SortOption"
            :class="[
              'px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1',
              sortBy === option.value 
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
                : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            <span>{{ option.icon }}</span>
            <span>{{ option.label }}</span>
          </button>
        </div>
        
        <!-- Select All (when in selection mode) -->
        <button 
          v-if="isSelectionMode && sortedPhotos.length > 0"
          @click="selectAll"
          class="px-4 py-2 bg-white text-gray-600 border border-gray-200 rounded-full text-sm hover:bg-gray-50 transition-all"
        >
          {{ selectedIds.size === sortedPhotos.length ? '取消全选' : '全选' }}
        </button>
        
        <!-- Delete Selected -->
        <button 
          v-if="hasSelection"
          @click="deleteSelected"
          class="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600 transition-all"
        >
          删除 ({{ selectedIds.size }})
        </button>
      </div>
    </div>
    
    <!-- Photo Grid -->
    <div v-if="sortedPhotos.length > 0" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      <div 
        v-for="(photo, index) in sortedPhotos" 
        :key="photo.id"
        :class="[
          'group relative aspect-[4/5] sm:aspect-square overflow-hidden rounded-2xl sm:rounded-3xl cursor-pointer bg-gray-100',
          selectedIds.has(photo.id) ? 'ring-4 ring-amber-500 ring-offset-2' : ''
        ]"
        :style="{ animationDelay: `${index * 0.03}s` }"
        @click="isSelectionMode ? toggleSelect(photo.id) : emit('selectPhoto', photo)"
      >
        <!-- Selection Checkbox -->
        <div 
          v-if="isSelectionMode"
          :class="[
            'absolute top-3 left-3 z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
            selectedIds.has(photo.id) 
              ? 'bg-amber-500 border-amber-500' 
              : 'bg-white/80 border-gray-400'
          ]"
        >
          <svg v-if="selectedIds.has(photo.id)" class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
        </div>
        
        <!-- Image -->
        <img 
          v-if="photo.type === 'image' || !photo.type" 
          :src="photo.urls?.[0] || photo.url" 
          :alt="photo.title || '照片'"
          class="w-full h-full object-cover transition-transform duration-500"
          :class="selectedIds.has(photo.id) ? 'scale-105' : 'group-hover:scale-110'"
          loading="lazy"
        />
        <video 
          v-else 
          :src="photo.url" 
          class="w-full h-full object-cover transition-transform duration-500"
          :class="selectedIds.has(photo.id) ? 'scale-105' : 'group-hover:scale-110'"
          muted
          loop
          playsinline
        />
        
        <!-- Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 pointer-events-none">
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
    
    <!-- Empty State -->
    <div v-else class="text-center py-20">
      <div class="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
        <span class="text-4xl">📷</span>
      </div>
      <h3 class="text-xl text-gray-600 mb-2">还没有照片</h3>
      <p class="text-gray-400 mb-6">上传第一张照片开始记录美好时光</p>
    </div>
    
    <!-- Upload FAB -->
    <button 
      v-if="canUpload && !isSelectionMode"
      @click="emit('openUpload')"
      class="fixed bottom-6 right-6 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full shadow-xl shadow-amber-500/30 hover:scale-110 hover:shadow-2xl transition-all duration-300 flex items-center justify-center z-40"
      aria-label="上传照片"
    >
      <svg class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
      </svg>
    </button>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}

.grid > div {
  animation: fade-in 0.5s ease-out backwards;
}
</style>
