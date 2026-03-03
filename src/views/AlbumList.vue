<script setup lang="ts">
import type { Album } from '../api'

defineProps<{
  albums: Album[]
  canCreateAlbum: boolean
}>()

const emit = defineEmits<{
  createAlbum: []
  deleteAlbum: [albumId: string]
}>()
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold">相册列表</h2>
      <button v-if="canCreateAlbum" @click="emit('createAlbum')" class="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-black text-sm font-bold rounded-xl">+ 新建相册</button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="album in albums" :key="album.id" class="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div class="aspect-video bg-white/10 flex items-center justify-center text-6xl">{{ album.cover || '📁' }}</div>
        <div class="p-4">
          <h3 class="font-bold mb-1">{{ album.name }}</h3>
          <p class="text-sm text-white/50 mb-2">{{ album.description }}</p>
          <div class="flex items-center justify-between">
            <span class="text-xs text-white/40">{{ album.photoCount }} 张 · {{ album.privacy }}</span>
            <button v-if="canCreateAlbum" @click="emit('deleteAlbum', album.id)" class="text-red-400 text-sm hover:underline">删除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
