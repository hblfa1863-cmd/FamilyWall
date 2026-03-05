<script setup lang="ts">
import { ref, computed } from 'vue'
import { albums } from '../api'

const props = defineProps<{
  albums: any[]
  familyId: string
}>()

const emit = defineEmits<{
  upload: [data: { urls: string[]; type?: string; title?: string; description: string; albumId: string }]
  close: []
}>()

// 步骤：1-选择/创建相册  2-上传照片
const step = ref(props.albums.length > 0 ? 1 : 2)

// 相册选择/创建
const albumMode = ref<'select' | 'create'>('select')
const selectedAlbumId = ref('')

// 新建相册表单
const newAlbum = ref({
  name: '',
  description: '',
  privacy: 'public'
})
const isCreatingAlbum = ref(false)
const albumError = ref('')

// 照片上传表单
const form = ref({
  url: '',
  title: '',
  description: ''
})

// 判断是否有相册
const hasAlbums = computed(() => props.albums.length > 0)

// 创建相册
async function createAlbum() {
  if (!newAlbum.value.name.trim()) {
    albumError.value = '请输入相册名称'
    return
  }
  
  isCreatingAlbum.value = true
  albumError.value = ''
  
  try {
    const result = await albums.create(props.familyId, {
      name: newAlbum.value.name.trim(),
      description: newAlbum.value.description.trim(),
      privacy: newAlbum.value.privacy
    })
    
    if (result.id) {
      selectedAlbumId.value = result.id
      step.value = 2
    } else {
      albumError.value = result.error || '创建相册失败'
    }
  } catch (e) {
    albumError.value = '创建相册失败，请重试'
  } finally {
    isCreatingAlbum.value = false
  }
}

// 上传照片
function submit() {
  if (!form.value.url.trim()) {
    alert('请输入图片链接')
    return
  }
  
  if (!selectedAlbumId.value) {
    alert('请选择或创建相册')
    return
  }
  
  // 判断是图片还是视频
  const isVideo = form.value.url.match(/\.(mp4|webm|mov|avi)$/i)
  
  emit('upload', {
    urls: [form.value.url.trim()],
    type: isVideo ? 'video' : 'image',
    title: form.value.title,
    description: form.value.description,
    albumId: selectedAlbumId.value
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
        <h3 class="text-lg font-semibold text-gray-800">
          {{ step === 1 ? '选择相册' : '上传照片' }}
        </h3>
        <button @click="emit('close')" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <!-- Step 1: Select/Create Album -->
      <div v-if="step === 1" class="p-6 space-y-4">
        <!-- Album Mode Toggle -->
        <div class="flex mb-4 bg-gray-100 rounded-xl p-1">
          <button 
            @click="albumMode = 'select'"
            :class="[
              'flex-1 py-2 rounded-lg text-sm font-medium transition-all',
              albumMode === 'select' 
                ? 'bg-white text-amber-600 shadow-sm' 
                : 'text-gray-500'
            ]"
          >
            选择已有相册
          </button>
          <button 
            @click="albumMode = 'create'"
            :class="[
              'flex-1 py-2 rounded-lg text-sm font-medium transition-all',
              albumMode === 'create' 
                ? 'bg-white text-amber-600 shadow-sm' 
                : 'text-gray-500'
            ]"
          >
            创建新相册
          </button>
        </div>
        
        <!-- Select Existing Album -->
        <div v-if="albumMode === 'select'">
          <div v-if="albums.length === 0" class="text-center py-8 text-gray-500">
            <p class="mb-4">还没有相册</p>
            <button 
              @click="albumMode = 'create'"
              class="text-amber-600 hover:text-amber-700 font-medium"
            >
              创建第一个相册 →
            </button>
          </div>
          <div v-else class="space-y-2 max-h-60 overflow-y-auto">
            <button
              v-for="album in albums"
              :key="album.id"
              @click="selectedAlbumId = album.id"
              :class="[
                'w-full p-4 rounded-xl text-left transition-all flex items-center gap-3',
                selectedAlbumId === album.id 
                  ? 'bg-amber-50 border-2 border-amber-500' 
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
              ]"
            >
              <div class="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center text-xl">
                📁
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-800">{{ album.name }}</p>
                <p class="text-xs text-gray-500">{{ album.description || '暂无描述' }}</p>
              </div>
              <span v-if="selectedAlbumId === album.id" class="text-amber-500">✓</span>
            </button>
          </div>
          
          <button 
            v-if="selectedAlbumId"
            @click="step = 2"
            class="w-full mt-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/30 transition-all"
          >
            下一步：上传照片 →
          </button>
        </div>
        
        <!-- Create New Album -->
        <div v-if="albumMode === 'create'" class="space-y-4">
          <div v-if="albumError" class="p-3 bg-red-50 border border-red-200 rounded-xl">
            <p class="text-sm text-red-600">{{ albumError }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">相册名称 *</label>
            <input 
              v-model="newAlbum.name" 
              type="text" 
              placeholder="例如：2024春节聚会"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">描述（可选）</label>
            <textarea 
              v-model="newAlbum.description" 
              placeholder="相册描述"
              rows="2"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">可见性</label>
            <div class="flex gap-3">
              <label class="flex-1 flex items-center justify-center gap-2 p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-amber-300 transition-colors" :class="newAlbum.privacy === 'public' ? 'border-amber-500 bg-amber-50' : ''">
                <input v-model="newAlbum.privacy" type="radio" value="public" class="sr-only" />
                <span>🌎 公开</span>
              </label>
              <label class="flex-1 flex items-center justify-center gap-2 p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-amber-300 transition-colors" :class="newAlbum.privacy === 'private' ? 'border-amber-500 bg-amber-50' : ''">
                <input v-model="newAlbum.privacy" type="radio" value="private" class="sr-only" />
                <span>🔒 私有</span>
              </label>
            </div>
          </div>
          
          <button 
            @click="createAlbum"
            :disabled="isCreatingAlbum"
            class="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <svg v-if="isCreatingAlbum" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isCreatingAlbum ? '创建中...' : '创建并下一步' }}</span>
          </button>
        </div>
      </div>
      
      <!-- Step 2: Upload Photo -->
      <div v-if="step === 2" class="p-6 space-y-4">
        <!-- Selected Album Info -->
        <div class="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
          <div class="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center text-lg">
            📁
          </div>
          <div class="flex-1">
            <p class="font-medium text-gray-800">{{ albums.find(a => a.id === selectedAlbumId)?.name || '已选择相册' }}</p>
            <p class="text-xs text-gray-500">将上传到此相册</p>
          </div>
          <button @click="step = 1" class="text-amber-600 text-sm">更换</button>
        </div>
        
        <form @submit.prevent="submit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">图片/视频链接 *</label>
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
          
          <button 
            type="submit" 
            class="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/30 transition-all"
          >
            上 传
          </button>
        </form>
      </div>
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
