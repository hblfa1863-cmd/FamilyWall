<script setup lang="ts">
import { ref, computed, onMounted, provide } from 'vue'
import { auth, families, albums, photos } from './api'
import { t, type Locale, messages } from './i18n'

// Components
import LoginView from './views/LoginView.vue'
import RegisterView from './views/RegisterView.vue'
import Header from './components/Header.vue'
import PhotoWall from './views/PhotoWall.vue'
import Timeline from './views/Timeline.vue'
import AlbumList from './views/AlbumList.vue'
import UploadModal from './components/UploadModal.vue'
import AlbumModal from './components/AlbumModal.vue'
import CreateFamilyModal from './components/CreateFamilyModal.vue'
import InviteModal from './components/InviteModal.vue'
import PhotoDetail from './components/PhotoDetail.vue'
import AlbumDetail from './components/AlbumDetail.vue'
import FriendsList from './components/FriendsList.vue'
import Notifications from './components/Notifications.vue'
import ShareModal from './components/ShareModal.vue'
import SecuritySettings from './components/SecuritySettings.vue'
import ProfileModal from './components/ProfileModal.vue'
import SettingsModal from './components/SettingsModal.vue'

// 多语言状态
const locale = ref<Locale>('zh')

// 提供翻译函数给子组件
provide('locale', locale)
provide('t', (key: string) => t(key, locale.value))

// 更新语言
function setLocale(newLocale: Locale) {
  locale.value = newLocale
}

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
const showCreateFamilyModal = ref(false)
const showInviteModal = ref(false)
const newInviteCode = ref('')
const showFriendsList = ref(false)
const showNotifications = ref(false)
const showShareModal = ref(false)
const showSecuritySettings = ref(false)
const showProfileModal = ref(false)
const showSettingsModal = ref(false)

// 上传模态框预选的相册ID
const preselectedAlbumId = ref<string | undefined>(undefined)

// 相册详情
const viewingAlbum = ref<{ id: string; name: string; photos: any[] } | null>(null)

// 加载相册照片
async function loadAlbumPhotos(albumId: string, albumName: string) {
  const allPhotos = await photos.getByFamily(currentFamilyId.value)
  const filtered = allPhotos.filter((p: any) => p.albumId === albumId)
  viewingAlbum.value = { id: albumId, name: albumName, photos: filtered }
}

// 关闭相册详情
function closeAlbumDetail() {
  viewingAlbum.value = null
}

// 打开上传模态框（可选预选相册ID）
function openUploadModal(albumId?: string) {
  preselectedAlbumId.value = albumId
  showUploadModal.value = true
}

// 通知未读数
const unreadCount = ref(0)

// 新建家族成功后的状态
const newlyCreatedFamily = ref<{ id: string; name: string; showUpload: boolean } | null>(null)

// Computed
const currentFamily = computed(() => familiesList.value.find(f => f.id === currentFamilyId.value))
// 新用户没有家族时，允许创建家族和相册
const canCreateAlbum = computed(() => {
  if (!currentFamilyId.value) return true
  return currentFamily.value?.role === 'admin' || currentFamily.value?.role === 'maintainer'
})
const canManageMembers = computed(() => currentFamily.value?.role === 'admin')
const canUpload = computed(() => !!currentFamilyId.value || familiesList.value.length === 0)
const showAdminPanel = computed(() => canManageMembers.value || canCreateAlbum.value || familiesList.value.length === 0)

// 是否需要引导创建家族
const needsFamilyGuide = computed(() => familiesList.value.length === 0 && currentFamilyId.value === '')

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
// 显示新建家族弹窗
function showCreateFamily() {
  showCreateFamilyModal.value = true
}

// 创建家族
async function handleCreateFamily(data: { name: string; description: string; createAlbum: boolean; albumName: string }) {
  const result = await families.create(data.name, data.description)
  if (result.id) {
    await loadFamilies()
    
    // 如果需要同时创建相册
    if (data.createAlbum && data.albumName) {
      await albums.create(result.id, { name: data.albumName })
      await loadAlbums()
    }
    
    // 切换到新创建的家族
    currentFamilyId.value = result.id
    await loadPhotos()
    
    showCreateFamilyModal.value = false
    
    // 显示成功提示和上传入口
    newlyCreatedFamily.value = { id: result.id, name: data.name, showUpload: true }
    
    // 3秒后隐藏提示
    setTimeout(() => {
      if (newlyCreatedFamily.value?.id === result.id) {
        newlyCreatedFamily.value = null
      }
    }, 5000)
  } else {
    alert(result?.error || '创建家族失败')
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
        @create-family="showCreateFamily" 
        @show-invite-code="showInviteCode" 
        @show-notifications="showNotifications = true"
        @show-friends="showFriendsList = true"
        @show-share="showShareModal = true"
        @show-security="showSecuritySettings = true"
        @show-profile="showProfileModal = true"
        @show-settings="showSettingsModal = true"
        @logout="logout" 
      />
      
      <main class="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <!-- New User Guide - Create Family -->
        <div v-if="needsFamilyGuide" class="mb-8">
          <div class="bg-white rounded-3xl p-8 shadow-lg border border-amber-100 text-center">
            <div class="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-4xl shadow-lg shadow-amber-500/30">
              🏠
            </div>
            <h2 class="text-2xl font-semibold text-gray-800 mb-2">欢迎使用照片墙！</h2>
            <p class="text-gray-500 mb-6">创建或加入一个家族，开始记录美好回忆</p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                @click="showCreateFamilyModal = true"
                class="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-full hover:shadow-lg hover:shadow-amber-500/30 transition-all"
              >
                + 创建家族
              </button>
              <div class="flex items-center gap-2">
                <input 
                  id="joinFamilyCode"
                  type="text" 
                  placeholder="输入邀请码"
                  class="px-4 py-3 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 w-32"
                />
                <button 
                  class="px-4 py-3 bg-white border border-gray-200 text-gray-600 font-medium rounded-full hover:bg-gray-50 transition-all text-sm"
                >
                  加入
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- View Tabs - Custom Styled -->
        <div class="mb-6">
          <div class="inline-flex items-center bg-white rounded-2xl p-1 shadow-sm border border-gray-100">
            <button 
              @click="view = 'wall'" 
              :class="[
                'px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2',
                view === 'wall' 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              ]"
            >
              <span>📷</span>
              <span>照片墙</span>
            </button>
            <button 
              @click="view = 'timeline'" 
              :class="[
                'px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2',
                view === 'timeline' 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              ]"
            >
              <span>📅</span>
              <span>时光轴</span>
            </button>
            <button 
              v-if="canCreateAlbum"
              @click="view = 'albums'" 
              :class="[
                'px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2',
                view === 'albums' 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              ]"
            >
              <span>📁</span>
              <span>相册管理</span>
            </button>
          </div>
        </div>
        
        <AlbumList 
          v-if="view === 'albums'" 
          :albums="albumsList" 
          :can-create-album="canCreateAlbum" 
          @create-album="showAlbumModal = true" 
          @delete-album="deleteAlbum"
          @open-album="loadAlbumPhotos($event.id, $event.name)"
        />
        
        <!-- Album Detail View -->
        <AlbumDetail
          v-else-if="viewingAlbum"
          :photos="viewingAlbum.photos"
          :album-name="viewingAlbum.name"
          @close="closeAlbumDetail"
          @select-photo="selectedPhoto = $event"
          @upload="openUploadModal(viewingAlbum?.id)"
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
          @open-upload="openUploadModal()"
          @delete-photos="deletePhotos"
        />
      </main>
      
      <!-- New Family Success Toast with Upload Button -->
      <Transition name="toast">
        <div 
          v-if="newlyCreatedFamily"
          class="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4"
        >
          <div class="flex items-center gap-2">
            <span class="text-xl">🎉</span>
            <div>
              <p class="font-medium">家族 "{{ newlyCreatedFamily.name }}" 创建成功！</p>
              <p class="text-sm text-white/80">立即上传照片记录美好时刻</p>
            </div>
          </div>
          <button 
            @click="showUploadModal = true; newlyCreatedFamily = null"
            class="px-4 py-2 bg-white text-green-600 font-medium rounded-full hover:bg-gray-100 transition-colors"
          >
            上传照片
          </button>
          <button 
            @click="newlyCreatedFamily = null"
            class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </Transition>
      
      <!-- Modals -->
      <CreateFamilyModal 
        v-if="showCreateFamilyModal" 
        @create="handleCreateFamily" 
        @close="showCreateFamilyModal = false" 
      />
      
      <UploadModal 
        v-if="showUploadModal" 
        :albums="albumsList"
        :family-id="currentFamilyId"
        :preselected-album-id="preselectedAlbumId"
        @upload="uploadPhoto" 
        @close="showUploadModal = false; preselectedAlbumId = undefined" 
      />
      
      <AlbumModal 
        v-if="showAlbumModal" 
        :existing-albums="albumsList"
        :family-id="currentFamilyId"
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
        :current-locale="locale"
        @close="showShareModal = false"
      />
      
      <SecuritySettings 
        v-if="showSecuritySettings" 
        @close="showSecuritySettings = false"
      />
      
      <ProfileModal 
        v-if="showProfileModal" 
        :current-locale="locale"
        @close="showProfileModal = false"
        @update-user="(data) => { user = { ...user, ...data } }"
        @locale-change="setLocale"
      />
      
      <SettingsModal 
        v-if="showSettingsModal" 
        @close="showSettingsModal = false"
        @logout="logout"
        @locale-change="setLocale"
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
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
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
