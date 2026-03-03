<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  create: [data: { name: string; description: string; privacy: string; cover: string }]
  close: []
}>()

const form = ref({ name: '', description: '', privacy: 'public', cover: '' })

function submit() {
  emit('create', { ...form.value })
}
</script>

<template>
  <div class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" @click.self="emit('close')">
    <div class="bg-[#141416] border border-white/10 rounded-2xl w-full max-w-lg p-6">
      <h3 class="text-xl font-bold mb-4">新建相册</h3>
      <div class="space-y-4">
        <input v-model="form.name" type="text" placeholder="相册名称" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30" />
        <textarea v-model="form.description" placeholder="描述(选填)" rows="2" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30"></textarea>
        <input v-model="form.cover" type="text" placeholder="封面图URL(选填)" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30" />
        <select v-model="form.privacy" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white">
          <option value="public">完全公开</option>
          <option value="private">完全隐藏</option>
          <option value="partial">部分成员可见</option>
        </select>
      </div>
      <div class="flex gap-3 mt-6">
        <button @click="emit('close')" class="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl">取消</button>
        <button @click="submit" class="flex-1 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold rounded-xl">创建</button>
      </div>
    </div>
  </div>
</template>
