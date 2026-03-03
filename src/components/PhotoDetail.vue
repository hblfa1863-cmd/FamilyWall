<script setup lang="ts">
import type { Photo } from '../api'

defineProps<{
  photo: Photo
}>()

const emit = defineEmits<{
  close: []
  addComment: [photoId: string, content: string]
}>()
</script>

<template>
  <div class="fixed inset-0 bg-black/90 flex items-center justify-center z-50" @click.self="emit('close')">
    <div class="w-full max-w-4xl">
      <div class="aspect-video">
        <img :src="photo.urls[0]" class="w-full h-full object-contain" />
      </div>
      <div class="bg-[#141416] p-6">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-xl font-bold">{{ photo.title || '无标题' }}</h3>
            <p class="text-white/50">{{ photo.description }}</p>
            <p class="text-sm text-white/40 mt-1">上传者: {{ photo.uploader }}</p>
          </div>
          <button @click="emit('close')" class="text-2xl">✕</button>
        </div>
        <div class="border-t border-white/10 pt-4">
          <h4 class="text-sm font-bold mb-3">评论</h4>
          <div class="space-y-3 mb-4 max-h-40 overflow-y-auto">
            <div v-for="c in photo.comments" :key="c.id" class="flex gap-3">
              <div class="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-black text-sm font-bold">{{ c.username[0] }}</div>
              <div>
                <span class="font-medium text-sm">{{ c.username }}</span>
                <p class="text-white/60 text-sm">{{ c.content }}</p>
              </div>
            </div>
          </div>
          <form @submit.prevent="emit('addComment', photo.id, ($event.target as HTMLFormElement).querySelector('input')!.value); ($event.target as HTMLFormElement).querySelector('input')!.value = ''" class="flex gap-3">
            <input type="text" placeholder="添加评论..." class="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30" />
            <button type="submit" class="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold rounded-xl">发送</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
