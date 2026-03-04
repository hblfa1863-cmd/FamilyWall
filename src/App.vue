<script setup lang="ts">
import { ref, computed } from 'vue'
import { auth, families, albums, photos } from './api'

// Components
import LoginView from './views/LoginView.vue'
import RegisterView from './views/RegisterView.vue'
import Header from './components/Header.vue'
import PhotoWall from './views/PhotoWall.vue'
import AlbumList from './views/AlbumList.vue'
import UploadModal from './components/UploadModal.vue'
import AlbumModal from './components/AlbumModal.vue'
import InviteModal from './components/InviteModal.vue'
import PhotoDetail from './components/PhotoDetail.vue'

// State
const user = ref<{ id: string; username: string; email: string } | null>(null)
const familiesList = ref<any[]>([])
const currentFamilyId = ref('')
const albumsList = ref<any[]>([])
const photosList = ref<any[]>([])
const selectedPhoto = ref<any | null>(null)
const view = ref<'wall' | 'albums' | 'login' | 'register'>('login')
const showUploadModal = ref(false)
const showAlbumModal = ref(false)
const showInviteModal = ref(false)
const newInviteCode = ref('')

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
    await loadFamilies()
    view.value = 'wall'
  } else {
    alert(result.error || '注册失败')
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

async function showInviteCode() {
  if (!currentFamilyId.value) return
  const result = await families.getInviteCode(currentFamilyId.value)
  newInviteCode.value = result.inviteCode || ''
  showInviteModal.value = true
}

async function createAlbum(data: { name: string; description: string; privacy: string; cover: string }) {
  if (!currentFamilyId.value) return
  const result = await albums.create(currentFamilyId.value, data)
  if (result.id) {
    await loadAlbums()
    showAlbumModal.value = false
  }
}

async function deleteAlbum(albumId: string) {
  if (!confirm('确定删除?')) return
  await albums.delete(albumId)
  await loadAlbums()
}

async function uploadPhoto(data: { urls: string[]; type: string; title: string; description: string; albumId?: string }) {
  if (!currentFamilyId.value) return
  const result = await photos.upload(currentFamilyId.value, data)
  if (!result.error) {
    await loadPhotos()
    showUploadModal.value = false
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

// Init
auth.isLoggedIn() && auth.getMe().then(u => {
  if (u.id) {
    user.value = u
    loadFamilies().then(() => view.value = 'wall')
  }
})
</script>

<template>
  <div class="min-h-screen bg-[#0D0D0F] text-white">
    <LoginView v-if="view === 'login'" @login="handleLogin" @switch-to-register="view = 'register'" />
    <RegisterView v-else-if="view === 'register'" @register="handleRegister" @switch-to-login="view = 'login'" />
    <div v-else>
      <Header :user="user" :families="familiesList" :current-family-id="currentFamilyId" @switch-family="switchFamily" @create-family="createFamily" @show-invite-code="showInviteCode" @logout="logout" />
      <main class="pt-24 pb-12 px-6">
        <div v-if="showAdminPanel" class="mb-8 flex gap-3">
          <button @click="view = 'albums'" :class="['px-4 py-2 rounded-xl text-sm font-medium', view === 'albums' ? 'bg-amber-400 text-black' : 'bg-white/5 border border-white/10']">📁 相册管理</button>
        </div>
        <AlbumList v-if="view === 'albums'" :albums="albumsList" :can-create-album="canCreateAlbum" @create-album="showAlbumModal = true" @delete-album="deleteAlbum" />
        <PhotoWall v-else :photos="photosList" :family-name="currentFamily?.name" :can-upload="canUpload" @select-photo="selectedPhoto = $event" @open-upload="showUploadModal = true" />
      </main>
      <UploadModal v-if="showUploadModal" :albums="albumsList" @upload="uploadPhoto" @close="showUploadModal = false" />
      <AlbumModal v-if="showAlbumModal" @create="createAlbum" @close="showAlbumModal = false" />
      <InviteModal v-if="showInviteModal" :code="newInviteCode" @close="showInviteModal = false" />
      <PhotoDetail v-if="selectedPhoto" :photo="selectedPhoto" @close="selectedPhoto = null" @add-comment="addComment" />
    </div>
  </div>
</template>
