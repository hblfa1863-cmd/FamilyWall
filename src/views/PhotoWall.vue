<script setup lang="ts">
import type { Photo } from '../api'

defineProps<{
  photos: Photo[]
  familyName?: string
  canUpload: boolean
}>()

const emit = defineEmits<{
  selectPhoto: [photo: Photo]
  openUpload: []
}>()
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold">{{ familyName }} - 照片墙</h2>
      <button v-if="canUpload" @click="emit('openUpload')" class="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-black text-sm font-bold rounded-xl">+ 上传照片</button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="photo in photos" :key="photo.id" @click="emit('selectPhoto', photo)" class="bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-amber-400/30 transition-all">
        <div class="aspect-video">
          <img :src="photo.urls[0]" class="w-full h-full object-cover" />
        </div>
        <div class="p-4">
          <h3 class="font-medium mb-1">{{ photo.title || '无标题' }}</h3>
          <p class="text-sm text-white/50">{{ photo.uploader }}</p>
        </div>
      </div>
    </div>
    <div v-if="photos.length === 0" class="text-center py-20 text-white/50">暂无照片</div>
  </div>
</template>
