<script setup lang="ts">
defineProps<{
  photos: any[]
  familyName?: string
  canUpload: boolean
}>()

const emit = defineEmits<{
  selectPhoto: [photo: any]
  openUpload: []
}>()

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}
</script>

<template>
  <div class="py-6">
    <!-- Hero Section -->
    <div class="text-center mb-10 animate-fade-in">
      <h2 class="text-3xl sm:text-4xl font-semibold text-gray-800 font-display mb-3">
        {{ familyName || '美好时光' }}
      </h2>
      <p class="text-gray-400 max-w-md mx-auto">
        {{ photos.length }} 张照片 · 记录每一个珍贵瞬间
      </p>
    </div>
    
    <!-- Photo Grid -->
    <div v-if="photos.length > 0" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      <div 
        v-for="(photo, index) in photos" 
        :key="photo.id"
        class="group relative aspect-[4/5] sm:aspect-square overflow-hidden rounded-2xl sm:rounded-3xl cursor-pointer bg-gray-100"
        :style="{ animationDelay: `${index * 0.05}s` }"
        @click="emit('selectPhoto', photo)"
      >
        <!-- Image -->
        <img 
          v-if="photo.type === 'image'" 
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
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <p class="text-white font-medium text-sm truncate">{{ photo.title || photo.description }}</p>
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
      v-if="canUpload"
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
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}

.grid > div {
  animation: fade-in 0.5s ease-out backwards;
}
</style>
