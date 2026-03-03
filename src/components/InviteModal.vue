<script setup lang="ts">
defineProps<{
  code: string
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <div class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" @click.self="emit('close')">
    <div class="bg-[#141416] border border-white/10 rounded-2xl w-full max-w-md p-6">
      <h3 class="text-xl font-bold mb-4">邀请码</h3>
      <div class="bg-white/5 p-4 rounded-xl text-center mb-4">
        <p class="text-2xl font-mono text-amber-400">{{ code }}</p>
      </div>
      <button @click="emit('close')" class="w-full py-3 bg-white/5 border border-white/10 rounded-xl">关闭</button>
    </div>
  </div>
</template>
