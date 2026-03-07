import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Locale } from '../i18n'

export type ViewType = 'wall' | 'timeline' | 'albums' | 'login' | 'register'

export const useUIStore = defineStore('ui', () => {
  const view = ref<ViewType>('login')
  
  const showUploadModal = ref(false)
  const showAlbumModal = ref(false)
  const showCreateFamilyModal = ref(false)
  const showInviteModal = ref(false)
  const showFriendsList = ref(false)
  const showNotifications = ref(false)
  const showShareModal = ref(false)
  const showSecuritySettings = ref(false)
  const showProfileModal = ref(false)
  const showSettingsModal = ref(false)
  
  const preselectedAlbumId = ref<string | undefined>(undefined)
  const inviteCode = ref('')
  const newlyCreatedFamily = ref<{ id: string; name: string; showUpload: boolean } | null>(null)
  
  const locale = ref<Locale>('zh')
  
  const viewingAlbum = ref<{ id: string; name: string; photos: any[] } | null>(null)
  
  const anyModalOpen = computed(() => 
    showUploadModal.value || 
    showAlbumModal.value || 
    showCreateFamilyModal.value || 
    showInviteModal.value ||
    showFriendsList.value ||
    showNotifications.value ||
    showShareModal.value ||
    showSecuritySettings.value ||
    showProfileModal.value ||
    showSettingsModal.value
  )
  
  function setView(newView: ViewType) {
    view.value = newView
  }
  
  function openUploadModal(albumId?: string) {
    preselectedAlbumId.value = albumId
    showUploadModal.value = true
  }
  
  function closeUploadModal() {
    showUploadModal.value = false
    preselectedAlbumId.value = undefined
  }
  
  function openAlbumModal() {
    showAlbumModal.value = true
  }
  
  function closeAlbumModal() {
    showAlbumModal.value = false
  }
  
  function openCreateFamilyModal() {
    showCreateFamilyModal.value = true
  }
  
  function closeCreateFamilyModal() {
    showCreateFamilyModal.value = false
  }
  
  function openInviteModal(code: string) {
    inviteCode.value = code
    showInviteModal.value = true
  }
  
  function closeInviteModal() {
    showInviteModal.value = false
    inviteCode.value = ''
  }
  
  function openFriendsList() {
    showFriendsList.value = true
  }
  
  function closeFriendsList() {
    showFriendsList.value = false
  }
  
  function openNotifications() {
    showNotifications.value = true
  }
  
  function closeNotifications() {
    showNotifications.value = false
  }
  
  function openShareModal() {
    showShareModal.value = true
  }
  
  function closeShareModal() {
    showShareModal.value = false
  }
  
  function openSecuritySettings() {
    showSecuritySettings.value = true
  }
  
  function closeSecuritySettings() {
    showSecuritySettings.value = false
  }
  
  function openProfileModal() {
    showProfileModal.value = true
  }
  
  function closeProfileModal() {
    showProfileModal.value = false
  }
  
  function openSettingsModal() {
    showSettingsModal.value = true
  }
  
  function closeSettingsModal() {
    showSettingsModal.value = false
  }
  
  function setLocale(newLocale: Locale) {
    locale.value = newLocale
  }
  
  function setViewingAlbum(album: { id: string; name: string; photos: any[] } | null) {
    viewingAlbum.value = album
  }
  
  function setNewlyCreatedFamily(family: { id: string; name: string; showUpload: boolean } | null) {
    newlyCreatedFamily.value = family
  }
  
  function closeAllModals() {
    showUploadModal.value = false
    showAlbumModal.value = false
    showCreateFamilyModal.value = false
    showInviteModal.value = false
    showFriendsList.value = false
    showNotifications.value = false
    showShareModal.value = false
    showSecuritySettings.value = false
    showProfileModal.value = false
    showSettingsModal.value = false
    preselectedAlbumId.value = undefined
  }
  
  return {
    view,
    showUploadModal,
    showAlbumModal,
    showCreateFamilyModal,
    showInviteModal,
    showFriendsList,
    showNotifications,
    showShareModal,
    showSecuritySettings,
    showProfileModal,
    showSettingsModal,
    preselectedAlbumId,
    inviteCode,
    newlyCreatedFamily,
    locale,
    viewingAlbum,
    anyModalOpen,
    setView,
    openUploadModal,
    closeUploadModal,
    openAlbumModal,
    closeAlbumModal,
    openCreateFamilyModal,
    closeCreateFamilyModal,
    openInviteModal,
    closeInviteModal,
    openFriendsList,
    closeFriendsList,
    openNotifications,
    closeNotifications,
    openShareModal,
    closeShareModal,
    openSecuritySettings,
    closeSecuritySettings,
    openProfileModal,
    closeProfileModal,
    openSettingsModal,
    closeSettingsModal,
    setLocale,
    setViewingAlbum,
    setNewlyCreatedFamily,
    closeAllModals
  }
})
