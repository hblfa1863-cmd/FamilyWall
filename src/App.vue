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
  { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800', desc: '全家福合影 - 2024年春节', year: 2024, author: '爸爸', comments: [{ author: '妈妈', text: '这张拍得真好！', time: '2小时前' }] },
  { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=800', desc: '清明时节全家出游', year: 2024, author: '妈妈', comments: [] },
  { id: 3, type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', desc: '生日派对精彩瞬间', year: 2024, author: '哥哥', comments: [] },
  { id: 4, type: 'image', url: 'https://images.unsplash.com/photo-1536337005238-94b997371b40?w=800', desc: '奶奶的80大寿', year: 2023, author: '爸爸', comments: [] },
  { id: 5, type: 'image', url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800', desc: '中秋赏月', year: 2023, author: '妈妈', comments: [] },
  { id: 6, type: 'image', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', desc: '春节庙会', year: 2022, author: '爸爸', comments: [] },
]

const years = [2024, 2023, 2022]
const currentYear = ref(2024)
const selectedPhoto = ref<Photo | null>(null)

const filteredPhotos = computed(() => mockPhotos.filter(p => p.year === currentYear.value))
</script>

<template>
  <div class="min-h-screen bg-[#0D0D0F] text-white overflow-x-hidden">
    <!-- 背景装饰 -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-[120px]"></div>
      <div class="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-rose-500/15 to-transparent rounded-full blur-[100px]"></div>
      <div class="absolute top-1/2 left-0 w-[300px] h-[300px] bg-gradient-to-br from-violet-500/10 to-transparent rounded-full blur-[80px]"></div>
    </div>

    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-[#0D0D0F]/80 backdrop-blur-2xl border-b border-white/5">
      <div class="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="relative">
            <div class="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-amber-500/20"></div>
            <div class="absolute -inset-0.5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl blur opacity-30"></div>
          </div>
          <div>
            <h1 class="text-xl font-bold tracking-tight">FamilyWall</h1>
            <p class="text-xs text-white/40 -mt-0.5">家族照片墙</p>
          </div>
        </div>
        
        <div class="flex items-center gap-3">
          <button class="group px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-all duration-300 hover:border-white/20 hover:scale-[1.02]">
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4 text-white/60 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              成员
            </span>
          </button>
          <button class="group px-5 py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-semibold rounded-xl text-sm transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40">
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              上传照片
            </span>
          </button>
        </div>
      </div>
    </header>

    <!-- Hero -->
    <section class="relative pt-40 pb-16 px-6 lg:px-12">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-end justify-between flex-wrap gap-8">
          <div class="max-w-2xl">
            <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white/50 mb-8 animate-fade-in">
              <span class="w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-pulse"></span>
              记录每一刻珍贵回忆
            </div>
            
            <h2 class="text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in" style="animation-delay: 0.1s">
              <span class="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">{{ currentYear }}</span>
              <br>
              <span class="bg-gradient-to-r from-amber-200 via-orange-200 to-rose-200 bg-clip-text text-transparent">美好时光</span>
            </h2>
            
            <p class="text-lg text-white/50 max-w-lg mb-10 animate-fade-in" style="animation-delay: 0.2s">
              用镜头记录生活的每一个精彩瞬间，让美好回忆永远珍藏。
            </p>

            <div class="flex items-center gap-10 animate-fade-in" style="animation-delay: 0.3s">
              <div class="group cursor-pointer">
                <div class="text-4xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent group-hover:from-amber-400 group-hover:to-orange-500 transition-all duration-500">{{ mockPhotos.length }}</div>
                <div class="text-sm text-white/40 mt-1">张照片</div>
              </div>
              <div class="w-px h-12 bg-white/10"></div>
              <div class="group cursor-pointer">
                <div class="text-4xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent group-hover:from-amber-400 group-hover:to-orange-500 transition-all duration-500">{{ years.length }}</div>
                <div class="text-sm text-white/40 mt-1">年回忆</div>
              </div>
              <div class="w-px h-12 bg-white/10"></div>
              <div class="group cursor-pointer">
                <div class="text-4xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent group-hover:from-amber-400 group-hover:to-orange-500 transition-all duration-500">8</div>
                <div class="text-sm text-white/40 mt-1">位家人</div>
              </div>
            </div>
          </div>

          <!-- 年份选择器 -->
          <div class="flex flex-col items-end gap-4">
            <div class="text-sm text-white/40 uppercase tracking-widest mb-2">选择年份</div>
            <div class="flex gap-2">
              <button 
                v-for="year in years" 
                :key="year"
                @click="currentYear = year"
                :class="[
                  'relative px-8 py-4 rounded-2xl text-base font-semibold transition-all duration-500 overflow-hidden',
                  currentYear === year 
                    ? 'text-black shadow-2xl shadow-amber-500/30' 
                    : 'text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10'
                ]"
              >
                <span class="relative z-10">{{ year }}</span>
                <div v-if="currentYear === year" class="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 照片网格 -->
    <section class="relative px-6 lg:px-12 pb-24">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="(photo, index) in filteredPhotos" 
            :key="photo.id"
            @click="selectedPhoto = photo"
            class="group relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-2"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <!-- 图片容器 -->
            <div class="relative aspect-[4/3] overflow-hidden">
              <img 
                v-if="photo.type === 'image'"
                :src="photo.url" 
                :alt="photo.desc"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <video 
                v-else
                :src="photo.url"
                muted
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              <!-- 遮罩 -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <!-- 序号 -->
              <div class="absolute top-4 left-4 w-10 h-10 bg-black/50 backdrop-blur-md rounded-xl flex items-center justify-center text-sm font-bold text-amber-400 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-100 scale-75">
                {{ String(index + 1).padStart(2, '0') }}
              </div>
              
              <!-- 视频标签 -->
              <div v-if="photo.type === 'video'" class="absolute top-4 right-4 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-xs font-semibold text-amber-400 flex items-center gap-1.5 border border-white/10">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"></path></svg>
                视频
              </div>

              <!-- 悬浮时的操作按钮 -->
              <div class="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                <button class="w-full py-3 bg-white/20 backdrop-blur-md rounded-xl text-sm font-medium text-white border border-white/20 hover:bg-white/30 transition-colors">
                  查看详情
                </button>
              </div>
            </div>

            <!-- 信息 -->
            <div class="p-5">
              <h3 class="text-base font-semibold text-white mb-3 line-clamp-2 group-hover:text-amber-100 transition-colors">{{ photo.desc }}</h3>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 text-sm text-white/40">
                  <span class="w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-black">{{ photo.author[0] }}</span>
                  {{ photo.author }}
                </div>
                <div class="flex items-center gap-1.5 text-sm text-amber-400/80">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                  {{ photo.comments.length }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 悬浮按钮 -->
    <button class="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 text-black rounded-2xl text-3xl font-bold flex items-center justify-center shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-110 transition-all duration-300 z-40">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
    </button>

    <!-- Modal -->
    <Teleport to="body">
      <div 
        v-if="selectedPhoto" 
        class="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4 lg:p-8"
        @click.self="selectedPhoto = null"
      >
        <div class="bg-[#141418] border border-white/10 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-modal-in">
          <!-- 媒体 -->
          <div class="relative bg-black aspect-video">
            <img 
              v-if="selectedPhoto.type === 'image'"
              :src="selectedPhoto.url" 
              :alt="selectedPhoto.desc"
              class="w-full h-full object-contain"
            />
            <video 
              v-else
              :src="selectedPhoto.url"
              controls
              autoplay
              class="w-full h-full object-contain"
            />
            
            <button 
              @click="selectedPhoto = null"
              class="absolute top-4 right-4 w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          
          <!-- 详情 -->
          <div class="p-6 lg:p-8 overflow-y-auto max-h-[40vh]">
            <div class="flex items-start justify-between gap-4 mb-6">
              <div>
                <h3 class="text-2xl font-bold mb-2">{{ selectedPhoto.desc }}</h3>
                <div class="flex items-center gap-4 text-sm text-white/50">
                  <span class="flex items-center gap-2">
                    <span class="w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-black">{{ selectedPhoto.author[0] }}</span>
                    {{ selectedPhoto.author }}
                  </span>
                  <span>·</span>
                  <span>{{ selectedPhoto.year }}年</span>
                </div>
              </div>
            </div>

            <!-- 评论 -->
            <div class="border-t border-white/10 pt-6">
              <h4 class="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">
                评论 ({{ selectedPhoto.comments.length }})
              </h4>
              
              <div v-if="selectedPhoto.comments.length > 0" class="flex flex-col gap-4 mb-6">
                <div v-for="(comment, i) in selectedPhoto.comments" :key="i" class="flex gap-4 animate-comment" :style="{ animationDelay: `${i * 0.05}s` }">
                  <div class="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
                    {{ comment.author[0] }}
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="font-semibold text-white">{{ comment.author }}</span>
                      <span class="text-xs text-white/40">{{ comment.time }}</span>
                    </div>
                    <div class="text-sm text-white/60">{{ comment.text }}</div>
                  </div>
                </div>
              </div>
              
              <div v-else class="text-sm text-white/40 mb-6">暂无评论</div>

              <!-- 评论输入 -->
              <form class="flex gap-3 pt-4 border-t border-white/10">
                <input 
                  type="text" 
                  placeholder="写下你的评论..."
                  class="flex-1 px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all"
                />
                <button 
                  type="submit"
                  class="px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all"
                >
                  发送
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes modal-in {
  from { opacity: 0; transform: scale(0.95) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes comment-in {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out both;
}

.animate-modal-in {
  animation: modal-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.animate-comment {
  animation: comment-in 0.3s ease-out both;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 滚动条 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
