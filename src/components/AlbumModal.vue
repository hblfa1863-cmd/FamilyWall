<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  create: [data: { name: string; description: string; privacy: string; cover?: string }]
  close: []
}>()

const form = ref({
  name: '',
  description: '',
  privacy: 'public'
})

function submit() {
  if (!form.value.name.trim()) {
    alert('请输入相册名称')
    return
  }
  emit('create', {
    name: form.value.name.trim(),
    description: form.value.description.trim(),
    privacy: form.value.privacy
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
        <h3 class="text-lg font-semibold text-gray-800">新建相册</h3>
        <button @click="emit('close')" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <!-- Form -->
      <form @submit.prevent="submit" class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">相册名称</label>
          <input 
            v-model="form.name" 
            type="text" 
            placeholder="例如：2024春节聚会"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            required
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">描述（可选）</label>
          <textarea 
            v-model="form.description" 
            placeholder="相册描述"
            rows="2"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
          ></textarea>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">可见性</label>
          <div class="flex gap-3">
            <label class="flex-1 flex items-center justify-center gap-2 p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-amber-300 transition-colors" :class="form.privacy === 'public' ? 'border-amber-500 bg-amber-50' : ''">
              <input v-model="form.privacy" type="radio" value="public" class="sr-only" />
              <span>🌎 公开</span>
            </label>
            <label class="flex-1 flex items-center justify-center gap-2 p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-amber-300 transition-colors" :class="form.privacy === 'private' ? 'border-amber-500 bg-amber-50' : ''">
              <input v-model="form.privacy" type="radio" value="private" class="sr-only" />
              <span>🔒 私有</span>
            </label>
          </div>
        </div>
        
        <button 
          type="submit" 
          class="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/30 transition-all"
        >
          创 建
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
