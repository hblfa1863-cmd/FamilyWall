<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { auth, families, albums, photos } from './api'

// Components
import LoginView from './views/LoginView.vue'
import RegisterView from './views/RegisterView.vue'
import Header from './components/Header.vue'
import PhotoWall from './views/PhotoWall.vue'
import Timeline from './views/Timeline.vue'
import AlbumList from './views/AlbumList.vue'
import UploadModal from './components/UploadModal.vue'
import AlbumModal from './components/AlbumModal.vue'
import InviteModal from './components/InviteModal.vue'
import PhotoDetail from './components/PhotoDetail.vue'
import FriendsList from './components/FriendsList.vue'
import Notifications from './components/Notifications.vue'
import ShareModal from './components/ShareModal.vue'
import SecuritySettings from './components/SecuritySettings.vue'

// State
const user = ref<{ id: string; username: string; email: string } | null>(null)
const familiesList = ref<any[]>([])
const currentFamilyId = ref('')
const albumsList = ref<any[]>([])
const photosList = ref<any[]>([])
const selectedPhoto = ref<any | null>(null)
const view = ref<'wall' | 'timeline' | 'albums' | 'login' | 'register'>('login')
const showUploadModal = ref(false)
const showAlbumModal = ref(false)
const showInviteModal = ref(false)
const newInviteCode = ref('')
const showFriendsList = ref(false)
const showNotifications = ref(false)
const showShareModal = ref(false)
const showSecuritySettings = ref(false)

// 通知未读数
const unreadCount = ref(0)

// Computed
const currentFamily = computed(() => familiesList.value.find(f => f.id === currentFamilyId.value))
const canCreateAlbum = computed(() => currentFamily.value?.role === 'admin' || currentFamily.value?.role === 'maintainer')
const canManageMembers = computed(() => currentFamily.value?.role === 'admin')
const canUpload = computed(() => !!currentFamily.value?.role)
const showAdminPanel = computed(() => canManageMembers.value || canCreateAlbum.value)

// Auth
async function handleLogin(email: string, password: string) {
  const result = await auth.login(email, password)
  if (result?.user) {
    user.value = result.user
    await loadFamilies()
    view.value = 'wall'
  } else {
    alert(result?.error || '登录失败')
  }
}

async function handleRegister(username: string, email: string, password: string, inviteCode?: string) {
  const result = await auth.register(username, email, password, inviteCode)
  if (result?.user) {
    user.value = result.user
    await loadFamilies()
    view.value = 'wall'
  } else {
    alert(result?.error || '注册失败')
  }
}

function logout() {
  auth.logout()
  user.value = null
  familiesList.value = []
  currentFamilyId.value = ''
  view.value = 'login'
}

// Data
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
  await loadPhotoLikes()
}

// Actions
async function createFamily() {
  const name = prompt('请输入家族名称:')
  if (!name) return
  const result = await families.create(name, prompt('请输入家族描述:') || '')
  if (result.id) {
    await loadFamilies()
    currentFamilyId.value = result.id
  }
}

async function switchFamily(familyId: string) {
  currentFamilyId.value = familyId
  await Promise.all([loadAlbums(), loadPhotos()])
}

async function showInviteCode() {
  const result = await families.getInviteCode(currentFamilyId.value)
  newInviteCode.value = result.inviteCode || ''
  showInviteModal.value = true
}

async function createAlbum(data: { name: string; description: string; privacy: string; cover: string }) {
  const result = await albums.create(currentFamilyId.value, data)
  if (result.id) {
    await loadAlbums()
    showAlbumModal.value = false
  }
}

async function deleteAlbum(albumId: string) {
  if (!confirm('确定要删除这个相册吗？')) return
  const result = await albums.delete(albumId)
  if (!result.error) {
    await loadAlbums()
  }
}

async function uploadPhoto(data: { urls: string[]; type?: string; title?: string; description?: string; albumId?: string }) {
  const result = await photos.upload(currentFamilyId.value, data)
  if (!result.error) {
    await loadPhotos()
    showUploadModal.value = false
  }
}

async function addComment(photoId: string, content: string) {
  await photos.addComment(photoId, content)
  const updated = await photos.getById(photoId)
  if (updated.id) {
    const idx = photosList.value.findIndex(p => p.id === photoId)
    if (idx >= 0) photosList.value[idx] = updated
    selectedPhoto.value = updated
  }
}

// 批量删除照片
async function deletePhotos(photoIds: string[]) {
  const result = await photos.deleteMany(photoIds)
  if (result.success) {
    await loadPhotos()
  } else {
    alert('删除失败，请重试')
  }
}

// 点赞状态管理
const photoLikes = ref<Record<string, { liked: boolean; count: number }>>({})

// 加载照片点赞状态
async function loadPhotoLikes() {
  const likes: Record<string, { liked: boolean; count: number }> = {}
  for (const photo of photosList.value) {
    const result = await photos.getLikes(photo.id)
    if (result && !result.error) {
      likes[photo.id] = {
        liked: result.some((l: any) => l.userId === user.value?.id),
        count: result.length
      }
    }
  }
  photoLikes.value = likes
}

// 点赞变化处理
function handleLikeChange(photoId: string, liked: boolean, count: number) {
  photoLikes.value[photoId] = { liked, count }
  const idx = photosList.value.findIndex(p => p.id === photoId)
  if (idx >= 0) {
    photosList.value[idx].likeCount = count
  }
  if (selectedPhoto.value?.id === photoId) {
    selectedPhoto.value.likeCount = count
  }
}

// 加载通知未读数
async function loadUnreadCount() {
  const { notifications } = await import('./api')
  const list = await notifications.getAll()
  unreadCount.value = list?.filter((n: any) => !n.read).length || 0
}

// Initialize
onMounted(async () => {
  if (auth.isLoggedIn()) {
    const me = await auth.getMe()
    if (me.id) {
      user.value = me
      await loadFamilies()
      await loadUnreadCount()
      view.value = 'wall'
    }
  }
})
</script>

<template>
  <div class="min-h-screen bg-[#FFFEF8] text-gray-800 font-sans">
    <!-- Login/Register Views -->
    <LoginView v-if="view === 'login'" @login="handleLogin" @switch-to-register="view = 'register'" />
    <RegisterView v-else-if="view === 'register'" @register="handleRegister" @switch-to-login="view = 'login'" />
    
    <!-- Main App -->
    <div v-else class="min-h-screen bg-gradient-to-br from-[#FFFEF8] via-[#FFF8F0] to-[#FFF5E6]">
      <Header 
        :user="user" 
        :families="familiesList" 
        :current-family-id="currentFamilyId" 
        :unread-count="unreadCount"
        @switch-family="switchFamily" 
        @create-family="createFamily" 
        @show-invite-code="showInviteCode" 
        @show-notifications="showNotifications = true"
        @show-friends="showFriendsList = true"
        @show-share="showShareModal = true"
        @show-security="showSecuritySettings = true"
        @logout="logout" 
      />
      
      <main class="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <!-- View Tabs -->
        <div v-if="!showAdminPanel" class="mb-6 flex gap-2">
          <button 
            @click="view = 'wall'" 
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
              view === 'wall' 
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30' 
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            ]"
          >
            📷 照片墙
          </button>
          <button 
            @click="view = 'timeline'" 
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
              view === 'timeline' 
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30' 
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            ]"
          >
            📅 时光轴
          </button>
        </div>
        <div v-if="showAdminPanel" class="mb-6 flex gap-2 flex-wrap">
          <button 
            @click="view = 'albums'" 
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
              view === 'albums' 
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30' 
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            ]"
          >
            📁 相册管理
          </button>
        </div>
        
        <AlbumList 
          v-if="view === 'albums'" 
          :albums="albumsList" 
          :can-create-album="canCreateAlbum" 
          @create-album="showAlbumModal = true" 
          @delete-album="deleteAlbum" 
        />
        
        <Timeline 
          v-else-if="view === 'timeline'" 
          :photos="photosList" 
          @select-photo="selectedPhoto = $event" 
        />
        
        <PhotoWall 
          v-else 
          :photos="photosList" 
          :family-name="currentFamily?.name" 
          :can-upload="canUpload" 
          @select-photo="selectedPhoto = $event" 
          @open-upload="showUploadModal = true"
          @delete-photos="deletePhotos"
        />
      </main>
      
      <!-- Modals -->
      <UploadModal 
        v-if="showUploadModal" 
        :albums="albumsList" 
        @upload="uploadPhoto" 
        @close="showUploadModal = false" 
      />
      
      <AlbumModal 
        v-if="showAlbumModal" 
        @create="createAlbum" 
        @close="showAlbumModal = false" 
      />
      
      <InviteModal 
        v-if="showInviteModal" 
        :code="newInviteCode" 
        @close="showInviteModal = false" 
      />
      
      <PhotoDetail 
        v-if="selectedPhoto" 
        :photo="selectedPhoto" 
        :liked="photoLikes[selectedPhoto.id]?.liked"
        :like-count="photoLikes[selectedPhoto.id]?.count"
        @close="selectedPhoto = null" 
        @add-comment="addComment"
        @like-change="handleLikeChange"
      />
      
      <FriendsList 
        v-if="showFriendsList" 
        @close="showFriendsList = false"
        @add-friend="showFriendsList = false"
      />
      
      <Notifications 
        v-if="showNotifications" 
        @close="showNotifications = false"
      />
      
      <ShareModal 
        v-if="showShareModal" 
        :family-name="currentFamily?.name"
        @close="showShareModal = false"
      />
      
      <SecuritySettings 
        v-if="showSecuritySettings" 
        @close="showSecuritySettings = false"
      />
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');

:root {
  font-family: 'Noto Sans SC', sans-serif;
}

.font-display {
  font-family: 'Playfair Display', serif;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #d4d4d4;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a3a3a3;
}

/* Smooth transitions */
* {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
