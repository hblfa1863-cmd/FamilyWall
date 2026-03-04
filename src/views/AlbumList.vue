<script setup lang="ts">
defineProps<{
  albums: any[]
  canCreateAlbum: boolean
}>()

const emit = defineEmits<{
  createAlbum: []
  deleteAlbum: [albumId: string]
}>()

function getPrivacyText(privacy: string) {
  const map: Record<string, string> = {
    public: '公开',
    private: '私有',
    protected: '限定'
  }
  return map[privacy] || privacy
}
</script>

<template>
  <div class="py-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-2xl sm:text-3xl font-semibold text-gray-800 font-display">相册</h2>
        <p class="text-gray-400 mt-1">{{ albums.length }} 个相册</p>
      </div>
      <button 
        v-if="canCreateAlbum"
        @click="emit('createAlbum')"
        class="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-full hover:shadow-lg hover:shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all duration-300"
      >
        + 新建相册
      </button>
    </div>
    
    <!-- Album Grid -->
    <div v-if="albums.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="album in albums" 
        :key="album.id"
        class="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      >
        <!-- Cover -->
        <div class="aspect-video bg-gray-100 relative overflow-hidden">
          <img 
            v-if="album.cover" 
            :src="album.cover" 
            :alt="album.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-amber-100 to-orange-100">
            📁
          </div>
          
          <!-- Privacy Badge -->
          <span class="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-600">
            {{ getPrivacyText(album.privacy) }}
          </span>
        </div>
        
        <!-- Info -->
        <div class="p-5">
          <h3 class="font-semibold text-gray-800 mb-1 group-hover:text-amber-600 transition-colors">
            {{ album.name }}
          </h3>
          <p class="text-sm text-gray-400 line-clamp-2">{{ album.description }}</p>
        </div>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else class="text-center py-20">
      <div class="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
        <span class="text-4xl">📁</span>
      </div>
      <h3 class="text-xl text-gray-600 mb-2">还没有相册</h3>
      <p class="text-gray-400">创建相册来整理你的照片</p>
    </div>
  </div>
</template>
