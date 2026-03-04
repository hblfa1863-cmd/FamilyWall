<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  albums: any[]
}>()

const emit = defineEmits<{
  upload: [data: { urls: string[]; type?: string; title?: string; description?: string; albumId?: string }]
  close: []
}>()

const form = ref({
  url: '',
  title: '',
  description: '',
  albumId: '',
  privacy: 'public'
})

function submit() {
  if (!form.value.url.trim()) {
    alert('请输入图片链接')
    return
  }
  
  // 判断是图片还是视频
  const isVideo = form.value.url.match(/\.(mp4|webm|mov|avi)$/i)
  
  emit('upload', {
    urls: [form.value.url.trim()],
    type: isVideo ? 'video' : 'image',
    title: form.value.title,
    description: form.value.description,
    albumId: form.value.albumId || undefined
  })
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="emit('close')"></div>
    
    <!-- Modal -->
    <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-800">上传照片</h3>
        <button @click="emit('close')" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <!-- Form -->
      <form @submit.prevent="submit" class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">图片/视频链接</label>
          <input 
            v-model="form.url" 
            type="url" 
            placeholder="https://example.com/photo.jpg"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            required
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">标题（可选）</label>
          <input 
            v-model="form.title" 
            type="text" 
            placeholder="照片标题"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">描述（可选）</label>
          <textarea 
            v-model="form.description" 
            placeholder="照片描述"
            rows="2"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
          ></textarea>
        </div>
        
        <div v-if="albums.length > 0">
          <label class="block text-sm font-medium text-gray-700 mb-2">相册（可选）</label>
          <select 
            v-model="form.albumId"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          >
            <option value="">不加入相册</option>
            <option v-for="album in albums" :key="album.id" :value="album.id">
              {{ album.name }}
            </option>
          </select>
        </div>
        
        <button 
          type="submit" 
          class="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/30 transition-all"
        >
          上 传
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scale-in 0.2s ease-out forwards;
}
</style>
