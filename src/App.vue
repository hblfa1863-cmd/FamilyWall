<script setup lang="ts">
import { ref, computed } from 'vue'

interface Photo {
  id: number
  type: 'image' | 'video'
  url: string
  desc: string
  year: number
  author: string
  comments: { author: string; text: string; time: string }[]
}

const mockPhotos: Photo[] = [
  { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600', desc: '全家福合影 - 2024年春节', year: 2024, author: '爸爸', comments: [{ author: '妈妈', text: '这张拍得真好！', time: '2小时前' }] },
  { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=600', desc: '清明时节全家出游', year: 2024, author: '妈妈', comments: [] },
  { id: 3, type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', desc: '生日派对精彩瞬间', year: 2024, author: '哥哥', comments: [] },
  { id: 4, type: 'image', url: 'https://images.unsplash.com/photo-1536337005238-94b997371b40?w=600', desc: '奶奶的80大寿', year: 2023, author: '爸爸', comments: [] },
  { id: 5, type: 'image', url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600', desc: '中秋赏月', year: 2023, author: '妈妈', comments: [] },
  { id: 6, type: 'image', url: 'https://images.unsplash.com/photo-1514525253161-7a46?w=600', desc: 'd19cd819春节庙会', year: 2022, author: '爸爸', comments: [] },
]

const years = [2024, 2023, 2022]
const currentYear = ref(2024)
const selectedPhoto = ref<Photo | null>(null)

const filteredPhotos = computed(() => mockPhotos.filter(p => p.year === currentYear.value))
</script>

<template>
  <div class="min-h-screen bg-[#0A0A0B] text-white">
    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0B]/90 backdrop-blur-xl border-b border-white/10">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-[#E8FF47] rounded-xl flex items-center justify-center text-xl">🏠</div>
          <span class="text-xl font-bold">FamilyWall</span>
        </div>
        <div class="flex items-center gap-3">
          <button class="px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20">👥 成员</button>
          <button class="px-4 py-2 bg-[#E8FF47] text-black rounded-lg text-sm font-medium">➕ 上传</button>
        </div>
      </div>
    </header>

    <!-- Hero -->
    <section class="pt-32 pb-12 px-6">
      <div class="max-w-6xl mx-auto">
        <h1 class="text-5xl font-bold mb-4"><span class="text-[#E8FF47]">{{ currentYear }}</span> 美好时光</h1>
        <p class="text-white/60 mb-8">记录家庭每一个珍贵瞬间</p>
        <div class="flex gap-8">
          <div><div class="text-3xl font-bold">{{ mockPhotos.length }}</div><div class="text-white/40 text-sm">张照片</div></div>
          <div><div class="text-3xl font-bold">{{ years.length }}</div><div class="text-white/40 text-sm">年回忆</div></div>
        </div>
      </div>
    </section>

    <!-- Year Selector -->
    <section class="px-6 pb-8">
      <div class="max-w-6xl mx-auto">
        <div class="flex gap-3">
          <button v-for="year in years" :key="year" @click="currentYear = year" :class="['px-6 py-2 rounded-full text-sm font-medium transition-all', currentYear === year ? 'bg-[#E8FF47] text-black' : 'bg-white/10 hover:bg-white/20']">{{ year }}</button>
        </div>
      </div>
    </section>

    <!-- Photo Grid -->
    <section class="px-6 pb-20">
      <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="photo in filteredPhotos" :key="photo.id" @click="selectedPhoto = photo" class="bg-white/5 rounded-2xl overflow-hidden cursor-pointer hover:bg-white/10 transition-all hover:scale-[1.02]">
          <div class="aspect-video">
            <img v-if="photo.type === 'image'" :src="photo.url" class="w-full h-full object-cover" />
            <video v-else :src="photo.url" muted class="w-full h-full object-cover" />
          </div>
          <div class="p-4">
            <div class="font-medium mb-1">{{ photo.desc }}</div>
            <div class="text-white/40 text-sm">👤 {{ photo.author }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal -->
    <div v-if="selectedPhoto" class="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6" @click.self="selectedPhoto = null">
      <div class="bg-[#141416] rounded-2xl max-w-2xl w-full overflow-hidden">
        <div class="aspect-video">
          <img v-if="selectedPhoto.type === 'image'" :src="selectedPhoto.url" class="w-full h-full object-contain bg-black" />
        </div>
        <div class="p-6">
          <h3 class="text-xl font-semibold mb-2">{{ selectedPhoto.desc }}</h3>
          <p class="text-white/50 text-sm mb-4">👤 {{ selectedPhoto.author }} · {{ selectedPhoto.year }}年</p>
        </div>
      </div>
    </div>
  </div>
</template>
