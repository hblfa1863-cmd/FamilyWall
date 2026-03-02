<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { auth, families, albums, photos } from './api'

// Types
interface Photo { id: string; type: string; urls: string[]; title: string; description: string; familyId: string; albumId?: string; uploader: string; comments: any[] }
interface Album { id: string; name: string; description: string; cover: string; privacy: string; photoCount: number }
interface Family { id: string; name: string; description: string; role: string; inviteCode?: string }
interface User { id: string; username: string; email: string }

// State
const isLoggedIn = ref(false)
const user = ref<User | null>(null)
const familiesList = ref<Family[]>([])
const currentFamilyId = ref('')
const albumsList = ref<Album[]>([])
const photosList = ref<Photo[]>([])
const selectedPhoto = ref<Photo | null>(null)
const view = ref<'wall' | 'albums' | 'login' | 'register'>('login')
const showUploadModal = ref(false)
const showAlbumModal = ref(false)
const showInviteModal = ref(false)
const newInviteCode = ref('')

const loginForm = ref({ email: '', password: '' })
const registerForm = ref({ username: '', email: '', password: '', inviteCode: '' })
const uploadForm = ref({ urls: '', title: '', description: '', albumId: '', type: 'image' })
const albumForm = ref({ name: '', description: '', privacy: 'public', cover: '' })

const currentFamily = computed(() => familiesList.value.find(f => f.id === currentFamilyId.value))
const canCreateAlbum = computed(() => currentFamily.value?.role === 'admin' || currentFamily.value?.role === 'maintainer')
const canManageMembers = computed(() => currentFamily.value?.role === 'admin')
const canUpload = computed(() => !!currentFamily.value?.role)
const showAdminPanel = computed(() => canManageMembers.value || canCreateAlbum.value)

onMounted(async () => {
  if (auth.isLoggedIn()) {
    const userData = await auth.getMe()
    if (userData.id) {
      user.value = userData
      isLoggedIn.value = true
      await loadFamilies()
      view.value = 'wall'
    }
  }
})

async function loadFamilies() {
  familiesList.value = await families.getAll()
  if (familiesList.value.length > 0 && !currentFamilyId.value) {
    currentFamilyId.value = familiesList.value[0].id
    await Promise.all([loadAlbums(), loadPhotos()])
  }
}

async function loadAlbums() {
  if (!currentFamilyId.value) return
  albumsList.value = await albums.getByFamily(currentFamilyId.value)
}

async function loadPhotos() {
  if (!currentFamilyId.value) return
  photosList.value = await photos.getByFamily(currentFamilyId.value)
}

async function handleLogin() {
  const result = await auth.login(loginForm.value.email, loginForm.value.password)
  if (result.user) {
    user.value = result.user
    isLoggedIn.value = true
    await loadFamilies()
    view.value = 'wall'
  } else {
    alert(result.error || '登录失败')
  }
}

async function handleRegister() {
  const result = await auth.register(registerForm.value.username, registerForm.value.email, registerForm.value.password, registerForm.value.inviteCode || undefined)
  if (result.user) {
    user.value = result.user
    isLoggedIn.value = true
    await loadFamilies()
    view.value = 'wall'
  } else {
    alert(result.error || '注册失败')
  }
}

function logout() {
  auth.logout()
  isLoggedIn.value = false
  user.value = null
  familiesList.value = []
  currentFamilyId.value = ''
  view.value = 'login'
}

async function createFamily() {
  const name = prompt('请输入家族名称:')
  if (!name) return
  const result = await families.create(name, prompt('请输入家族描述:') || '')
  if (result.id || "") {
    await loadFamilies()
    currentFamilyId.value = result.id
  }
}

async function showInviteCode() {
  if (!currentFamilyId.value) return
  const result = await families.getInviteCode(currentFamilyId.value)
  newInviteCode.value = result.inviteCode || ''
  showInviteModal.value = true
}

async function createAlbum() {
  if (!currentFamilyId.value) return
  const result = await albums.create(currentFamilyId.value, albumForm.value)
  if (result.id || "") {
    await loadAlbums()
    showAlbumModal.value = false
    albumForm.value = { name: '', description: '', privacy: 'public', cover: '' }
  }
}

async function deleteAlbum(albumId: string) {
  if (!confirm('确定删除?')) return
  await albums.delete(albumId)
  await loadAlbums()
}

async function uploadPhoto() {
  if (!currentFamilyId.value) return
  const urls = uploadForm.value.urls.split('\n').map(s => s.trim()).filter(s => s)
  if (urls.length === 0) return alert('请输入URL')
  const result = await photos.upload(currentFamilyId.value, { urls, type: uploadForm.value.type, title: uploadForm.value.title, description: uploadForm.value.description, albumId: uploadForm.value.albumId || undefined })
  if (!result.error) {
    await loadPhotos()
    showUploadModal.value = false
    uploadForm.value = { urls: '', title: '', description: '', albumId: '', type: 'image' }
  }
}

async function addComment(photoId: string, content: string) {
  if (!content.trim()) return
  await photos.addComment(photoId, content)
  const updated = await photos.getById(photoId)
  if (updated.id) {
    const idx = photosList.value.findIndex(p => p.id === photoId)
    if (idx >= 0) photosList.value[idx] = updated
    selectedPhoto.value = updated
  }
}

async function switchFamily(familyId: string) {
  currentFamilyId.value = familyId
  await Promise.all([loadAlbums(), loadPhotos()])
}
</script>

<template>
  <div class="min-h-screen bg-[#0D0D0F] text-white">
    <!-- Login -->
    <div v-if="view === 'login'" class="min-h-screen flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="text-5xl mb-4">🏠</div>
          <h1 class="text-3xl font-bold">FamilyWall</h1>
          <p class="text-white/50 mt-2">家族照片墙</p>
        </div>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <input v-model="loginForm.email" type="email" placeholder="邮箱" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30" required />
          <input v-model="loginForm.password" type="password" placeholder="密码" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30" required />
          <button type="submit" class="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold rounded-xl">登录</button>
        </form>
        <p class="text-center mt-6 text-white/50">没有账号? <button @click="view = 'register'" class="text-amber-400 hover:underline">立即注册</button></p>
      </div>
    </div>

    <!-- Register -->
    <div v-else-if="view === 'register'" class="min-h-screen flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-8"><div class="text-5xl mb-4">🏠</div><h1 class="text-3xl font-bold">注册</h1></div>
        <form @submit.prevent="handleRegister" class="space-y-4">
          <input v-model="registerForm.username" type="text" placeholder="用户名" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30" required />
          <input v-model="registerForm.email" type="email" placeholder="邮箱" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30" required />
          <input v-model="registerForm.password" type="password" placeholder="密码" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30" required />
          <input v-model="registerForm.inviteCode" type="text" placeholder="邀请码(选填)" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30" />
          <button type="submit" class="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold rounded-xl">注册</button>
        </form>
        <p class="text-center mt-6 text-white/50">已有账号? <button @click="view = 'login'" class="text-amber-400 hover:underline">立即登录</button></p>
      </div>
    </div>

    <!-- Main -->
    <div v-else>
      <header class="fixed top-0 left-0 right-0 z-50 bg-[#0D0D0F]/90 backdrop-blur-xl border-b border-white/5">
        <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="text-2xl">🏠</div>
            <div><h1 class="text-xl font-bold">FamilyWall</h1><p class="text-xs text-white/40">家族照片墙</p></div>
          </div>
          <div class="flex items-center gap-3">
            <select v-if="familiesList.length > 0" :value="currentFamilyId" @change="switchFamily(($event.target as HTMLSelectElement).value)" class="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm">
              <option v-for="f in familiesList" :key="f.id" :value="f.id">{{ f.name }}</option>
            </select>
            <button @click="createFamily" class="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10">+ 新建家族</button>
            <button @click="showInviteCode" class="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10">邀请码</button>
            <span class="text-sm text-white/50">{{ user?.username }}</span>
            <button @click="logout" class="text-amber-400 hover:underline text-sm">退出</button>
          </div>
        </div>
      </header>

      <main class="pt-24 pb-12 px-6">
        <div v-if="showAdminPanel" class="mb-8 flex gap-3">
          <button @click="view = 'albums'" :class="['px-4 py-2 rounded-xl text-sm font-medium', view === 'albums' ? 'bg-amber-400 text-black' : 'bg-white/5 border border-white/10']">📁 相册管理</button>
        </div>

        <div v-if="view === 'albums'" class="max-w-7xl mx-auto">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold">相册列表</h2>
            <button v-if="canCreateAlbum" @click="showAlbumModal = true" class="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-black text-sm font-bold rounded-xl">+ 新建相册</button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="album in albumsList" :key="album.id" class="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div class="aspect-video bg-white/10 flex items-center justify-center text-6xl">{{ album.cover || '📁' }}</div>
              <div class="p-4">
                <h3 class="font-bold mb-1">{{ album.name }}</h3>
                <p class="text-sm text-white/50 mb-2">{{ album.description }}</p>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-white/40">{{ album.photoCount }} 张 · {{ album.privacy }}</span>
                  <button v-if="canCreateAlbum" @click="deleteAlbum(album.id)" class="text-red-400 text-sm hover:underline">删除</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="max-w-7xl mx-auto">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold">{{ currentFamily?.name }} - 照片墙</h2>
            <button v-if="canUpload" @click="showUploadModal = true" class="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-black text-sm font-bold rounded-xl">+ 上传照片</button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="photo in photosList" :key="photo.id" @click="selectedPhoto = photo" class="bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-amber-400/30 transition-all">
              <div class="aspect-video"><img :src="photo.urls[0]" class="w-full h-full object-cover" /></div>
              <div class="p-4"><h3 class="font-medium mb-1">{{ photo.title || '无标题' }}</h3><p class="text-sm text-white/50">{{ photo.uploader }}</p></div>
            </div>
          </div>
          <div v-if="photosList.length === 0" class="text-center py-20 text-white/50">暂无照片</div>
        </div>
      </main>

      <!-- Upload Modal -->
      <div v-if="showUploadModal" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" @click.self="showUploadModal = false">
        <div class="bg-[#141416] border border-white/10 rounded-2xl w-full max-w-lg p-6">
          <h3 class="text-xl font-bold mb-4">上传照片</h3>
          <div class="space-y-4">
            <textarea v-model="uploadForm.urls" placeholder="照片URL(每行一个)" rows="3" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30"></textarea>
            <input v-model="uploadForm.title" type="text" placeholder="标题(选填)" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30" />
            <textarea v-model="uploadForm.description" placeholder="描述(选填)" rows="2" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30"></textarea>
            <select v-model="uploadForm.albumId" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white">
              <option value="">不放入相册</option>
              <option v-for="a in albumsList" :key="a.id" :value="a.id">{{ a.name }}</option>
            </select>
            <div class="flex gap-4">
              <label class="flex items-center gap-2"><input type="radio" v-model="uploadForm.type" value="image" /> 图片</label>
              <label class="flex items-center gap-2"><input type="radio" v-model="uploadForm.type" value="video" /> 视频</label>
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button @click="showUploadModal = false" class="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl">取消</button>
            <button @click="uploadPhoto" class="flex-1 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold rounded-xl">上传</button>
          </div>
        </div>
      </div>

      <!-- Album Modal -->
      <div v-if="showAlbumModal" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" @click.self="showAlbumModal = false">
        <div class="bg-[#141416] border border-white/10 rounded-2xl w-full max-w-lg p-6">
          <h3 class="text-xl font-bold mb-4">新建相册</h3>
          <div class="space-y-4">
            <input v-model="albumForm.name" type="text" placeholder="相册名称" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30" />
            <textarea v-model="albumForm.description" placeholder="描述(选填)" rows="2" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30"></textarea>
            <input v-model="albumForm.cover" type="text" placeholder="封面图URL(选填)" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30" />
            <select v-model="albumForm.privacy" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white">
              <option value="public">完全公开</option>
              <option value="private">完全隐藏</option>
              <option value="partial">部分成员可见</option>
            </select>
          </div>
          <div class="flex gap-3 mt-6">
            <button @click="showAlbumModal = false" class="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl">取消</button>
            <button @click="createAlbum" class="flex-1 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold rounded-xl">创建</button>
          </div>
        </div>
      </div>

      <!-- Invite Modal -->
      <div v-if="showInviteModal" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" @click.self="showInviteModal = false">
        <div class="bg-[#141416] border border-white/10 rounded-2xl w-full max-w-md p-6">
          <h3 class="text-xl font-bold mb-4">邀请码</h3>
          <div class="bg-white/5 p-4 rounded-xl text-center mb-4"><p class="text-2xl font-mono text-amber-400">{{ newInviteCode }}</p></div>
          <button @click="showInviteModal = false" class="w-full py-3 bg-white/5 border border-white/10 rounded-xl">关闭</button>
        </div>
      </div>

      <!-- Photo Detail -->
      <div v-if="selectedPhoto" class="fixed inset-0 bg-black/90 flex items-center justify-center z-50" @click.self="selectedPhoto = null">
        <div class="w-full max-w-4xl">
          <div class="aspect-video"><img :src="selectedPhoto.urls[0]" class="w-full h-full object-contain" /></div>
          <div class="bg-[#141416] p-6">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="text-xl font-bold">{{ selectedPhoto.title || '无标题' }}</h3>
                <p class="text-white/50">{{ selectedPhoto.description }}</p>
                <p class="text-sm text-white/40 mt-1">上传者: {{ selectedPhoto.uploader }}</p>
              </div>
              <button @click="selectedPhoto = null" class="text-2xl">✕</button>
            </div>
            <div class="border-t border-white/10 pt-4">
              <h4 class="text-sm font-bold mb-3">评论</h4>
              <div class="space-y-3 mb-4 max-h-40 overflow-y-auto">
                <div v-for="c in selectedPhoto.comments" :key="c.id" class="flex gap-3">
                  <div class="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-black text-sm font-bold">{{ c.username[0] }}</div>
                  <div><span class="font-medium text-sm">{{ c.username }}</span><p class="text-white/60 text-sm">{{ c.content }}</p></div>
                </div>
              </div>
              <form @submit.prevent="addComment(selectedPhoto!.id, ($event.target as HTMLFormElement).querySelector('input')!.value); ($event.target as HTMLFormElement).querySelector('input')!.value = ''" class="flex gap-3">
                <input type="text" placeholder="添加评论..." class="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30" />
                <button type="submit" class="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold rounded-xl">发送</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
