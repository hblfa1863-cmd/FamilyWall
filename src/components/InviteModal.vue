<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  code: string
}>()

const emit = defineEmits<{
  close: []
}>()

const copied = ref(false)

async function copyCode(code: string) {
  try {
    await navigator.clipboard.writeText(code)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch {
    alert('复制失败，请手动复制')
  }
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="emit('close')"></div>
    
    <!-- Modal -->
    <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-800">邀请家人</h3>
        <button @click="emit('close')" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <!-- Content -->
      <div class="p-6 text-center">
        <p class="text-gray-500 mb-4">分享邀请码给家人，让他们加入你的家族</p>
        
        <div class="bg-gray-50 rounded-2xl p-4 mb-4">
          <p class="text-3xl font-mono font-bold text-gray-800 tracking-wider">{{ code }}</p>
        </div>
        
        <button 
          @click="copyCode(code)"
          class="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/30 transition-all"
        >
          {{ copied ? '✓ 已复制!' : '复制邀请码' }}
        </button>
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
