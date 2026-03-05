<script setup lang="ts">
import { ref, watch } from 'vue'

const emit = defineEmits<{
  create: [data: { name: string; description: string; createAlbum: boolean; albumName: string }]
  close: []
}>()

const form = ref({
  name: '',
  description: '',
  createAlbum: false,
  albumName: ''
})

const errors = ref<{ name?: string; albumName?: string }>({})

// 监听createAlbum变化，重置albumName
watch(() => form.value.createAlbum, (val) => {
  if (!val) form.value.albumName = ''
})

function validate(): boolean {
  errors.value = {}
  
  if (!form.value.name.trim()) {
    errors.value.name = '请输入家族名称'
    return false
  }
  
  if (form.value.createAlbum && !form.value.albumName.trim()) {
    errors.value.albumName = '请输入相册名称'
    return false
  }
  
  return true
}

function submit() {
  if (!validate()) return
  
  emit('create', {
    name: form.value.name.trim(),
    description: form.value.description.trim(),
    createAlbum: form.value.createAlbum,
    albumName: form.value.albumName.trim()
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
        <h3 class="text-lg font-semibold text-gray-800">新建家族</h3>
        <button @click="emit('close')" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <!-- Form -->
      <form @submit.prevent="submit" class="p-6 space-y-5">
        <!-- Family Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <span class="flex items-center gap-1">
              <span class="text-amber-500">*</span> 家族名称
            </span>
          </label>
          <input 
            v-model="form.name" 
            type="text" 
            placeholder="例如：我的大家庭"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            :class="{ 'border-red-300 focus:ring-red-500/50': errors.name }"
          />
          <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
        </div>
        
        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">家族描述（可选）</label>
          <textarea 
            v-model="form.description" 
            placeholder="介绍一下这个家族..."
            rows="2"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
          ></textarea>
        </div>
        
        <!-- Divider -->
        <div class="border-t border-gray-100"></div>
        
        <!-- Create Album Option -->
        <div class="space-y-3">
          <label class="flex items-center gap-3 cursor-pointer">
            <div class="relative">
              <input 
                v-model="form.createAlbum" 
                type="checkbox" 
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-amber-500 transition-colors"></div>
              <div class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform"></div>
            </div>
            <span class="text-sm font-medium text-gray-700">同时创建一个相册</span>
          </label>
          
          <!-- Album Name (conditional) -->
          <Transition name="slide">
            <div v-if="form.createAlbum" class="ml-14">
              <input 
                v-model="form.albumName" 
                type="text" 
                placeholder="相册名称，例如：2024春节"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                :class="{ 'border-red-300 focus:ring-red-500/50': errors.albumName }"
              />
              <p v-if="errors.albumName" class="mt-1 text-xs text-red-500">{{ errors.albumName }}</p>
            </div>
          </Transition>
        </div>
        
        <!-- Submit Button -->
        <button 
          type="submit" 
          class="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/30 transition-all"
        >
          创 建 家 族
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

.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
