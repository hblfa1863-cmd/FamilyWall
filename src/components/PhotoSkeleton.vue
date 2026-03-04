<script setup lang="ts">
// 骨架屏照片卡片
defineProps<{
  count?: number
}>()
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
    <div 
      v-for="i in (count || 8)" 
      :key="i"
      class="aspect-[4/5] sm:aspect-square rounded-2xl sm:rounded-3xl bg-gray-200 animate-pulse"
    />
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
