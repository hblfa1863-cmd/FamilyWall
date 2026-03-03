<script setup lang="ts">
import { ref } from 'vue'
import type { Album } from '../api'

defineProps<{
  albums: Album[]
}>()

const emit = defineEmits<{
  upload: [data: { urls: string[]; type: string; title: string; description: string; albumId?: string }]
  close: []
}>()

const form = ref({ urls: '', title: '', description: '', albumId: '', type: 'image' })

function submit() {
  const urls = form.value.urls.split('\n').map(s => s.trim()).filter(s => s)
  if (urls.length === 0) {
    alert('请输入URL')
    return
  }
  emit('upload', {
    urls,
    type: form.value.type,
    title: form.value.title,
    description: form.value.description,
    albumId: form.value.albumId || undefined
  })
}
</script>

<template>
  <div class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" @click.self="emit('close')">
    <div class="bg-[#141416] border border-white/10 rounded-2xl w-full max-w-lg p-6">
      <h3 class="text-xl font-bold mb-4">上传照片</h3>
      <div class="space-y-4">
        <textarea v-model="form.urls" placeholder="照片URL(每行一个)" rows="3" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30"></textarea>
        <input v-model="form.title" type="text" placeholder="标题(选填)" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30" />
        <textarea v-model="form.description" placeholder="描述(选填)" rows="2" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30"></textarea>
        <select v-model="form.albumId" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white">
          <option value="">不放入相册</option>
          <option v-for="a in albums" :key="a.id" :value="a.id">{{ a.name }}</option>
        </select>
        <div class="flex gap-4">
          <label class="flex items-center gap-2">
            <input type="radio" v-model="form.type" value="image" /> 图片
          </label>
          <label class="flex items-center gap-2">
            <input type="radio" v-model="form.type" value="video" /> 视频
          </label>
        </div>
      </div>
      <div class="flex gap-3 mt-6">
        <button @click="emit('close')" class="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl">取消</button>
        <button @click="submit" class="flex-1 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold rounded-xl">上传</button>
      </div>
    </div>
  </div>
</template>
