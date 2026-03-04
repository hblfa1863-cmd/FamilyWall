<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const props = defineProps<{
  fallbackMessage?: string
}>()

const emit = defineEmits<{
  retry: []
}>()

const error = ref<Error | null>(null)
const hasError = ref(false)

onErrorCaptured((err: Error) => {
  error.value = err
  hasError.value = true
  console.error('[ErrorBoundary]', err)
  return false // 阻止错误传播
})

function retry() {
  hasError.value = false
  error.value = null
  emit('retry')
}
</script>

<template>
  <div v-if="hasError" class="min-h-[200px] flex items-center justify-center p-8">
    <div class="text-center">
      <div class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
        <span class="text-3xl">⚠️</span>
      </div>
      <h3 class="text-lg font-medium text-gray-800 mb-2">出错了</h3>
      <p class="text-gray-500 mb-4">{{ fallbackMessage || error?.message || '加载失败，请重试' }}</p>
      <button 
        @click="retry"
        class="px-6 py-2 bg-amber-500 text-white rounded-full font-medium hover:bg-amber-600 transition-colors"
      >
        重试
      </button>
    </div>
  </div>
  <slot v-else />
</template>
