<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
}>()

const emit = defineEmits<{
  close: []
}>()

const visible = ref(true)

watch(() => props.message, () => {
  visible.value = true
  if (props.duration !== 0) {
    setTimeout(() => {
      visible.value = false
      emit('close')
    }, props.duration || 2000)
  }
}, { immediate: true })

const icons = {
  success: '✓',
  error: '✕',
  info: 'ℹ'
}

const colors = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500'
}
</script>

<template>
  <Transition name="toast">
    <div 
      v-if="visible"
      :class="['fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-4 py-3 rounded-full text-white shadow-lg', colors[type || 'info']]"
    >
      <span class="text-lg">{{ icons[type || 'info'] }}</span>
      <span class="text-sm font-medium">{{ message }}</span>
    </div>
  </Transition>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style>
