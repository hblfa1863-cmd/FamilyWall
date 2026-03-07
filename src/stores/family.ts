import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { families as familiesApi } from '../api'
import type { Family } from '../types'

export const useFamilyStore = defineStore('family', () => {
  const families = ref<Family[]>([])
  const currentFamilyId = ref<string>('')
  const members = ref<Family['members']>([])
  const inviteCode = ref<string>('')
  const loading = ref(false)
  const error = ref<string | null>(null)

  const currentFamily = computed(() => 
    families.value.find(f => f.id === currentFamilyId.value) || null
  )

  const currentFamilyRole = computed(() => currentFamily.value?.role || null)

  const canCreateAlbum = computed(() => {
    if (!currentFamilyId.value) return true
    const role = currentFamilyRole.value
    return role === 'admin' || role === 'maintainer'
  })

  const canManageMembers = computed(() => currentFamilyRole.value === 'admin')

  const hasNoFamily = computed(() => families.value.length === 0 && !currentFamilyId.value)

  async function fetchFamilies() {
    loading.value = true
    error.value = null
    try {
      const data = await familiesApi.getAll()
      families.value = data || []
      const savedFamilyId = localStorage.getItem('currentFamily')
      if (savedFamilyId && families.value.some(f => f.id === savedFamilyId)) {
        currentFamilyId.value = savedFamilyId
      } else if (families.value.length > 0) {
        currentFamilyId.value = families.value[0].id
      }
      return families.value
    } catch (e: any) {
      error.value = e.message || '获取家族列表失败'
      return []
    } finally {
      loading.value = false
    }
  }

  async function createFamily(name: string, description: string) {
    loading.value = true
    error.value = null
    try {
      const result = await familiesApi.create(name, description)
      if (result?.id) {
        families.value.push(result)
        currentFamilyId.value = result.id
        localStorage.setItem('currentFamily', result.id)
        return result
      }
      error.value = result?.error || '创建家族失败'
      return null
    } catch (e: any) {
      error.value = e.message || '创建家族失败'
      return null
    } finally {
      loading.value = false
    }
  }

  async function fetchMembers(familyId?: string) {
    const fid = familyId || currentFamilyId.value
    if (!fid) return []
    try {
      const data = await familiesApi.getMembers(fid)
      members.value = data || []
      return members.value
    } catch (e) {
      return []
    }
  }

  async function fetchInviteCode(familyId?: string) {
    const fid = familyId || currentFamilyId.value
    if (!fid) return ''
    try {
      const data = await familiesApi.getInviteCode(fid)
      inviteCode.value = data?.code || ''
      return inviteCode.value
    } catch (e) {
      return ''
    }
  }

  async function regenerateInviteCode(familyId?: string) {
    const fid = familyId || currentFamilyId.value
    if (!fid) return ''
    try {
      const data = await familiesApi.regenerateInviteCode(fid)
      inviteCode.value = data?.code || ''
      return inviteCode.value
    } catch (e) {
      return ''
    }
  }

  function switchFamily(familyId: string) {
    currentFamilyId.value = familyId
    localStorage.setItem('currentFamily', familyId)
  }

  async function joinFamily(code: string) {
    loading.value = true
    error.value = null
    try {
      const result = await familiesApi.joinByInviteCode(code)
      if (result?.id) {
        await fetchFamilies()
        currentFamilyId.value = result.id
        return result
      }
      error.value = result?.error || '加入家族失败'
      return null
    } catch (e: any) {
      error.value = e.message || '加入家族失败'
      return null
    } finally {
      loading.value = false
    }
  }

  async function leaveFamily(familyId: string) {
    loading.value = true
    error.value = null
    try {
      const result = await familiesApi.leave(familyId)
      if (result?.success) {
        families.value = families.value.filter(f => f.id !== familyId)
        if (currentFamilyId.value === familyId) {
          currentFamilyId.value = families.value[0]?.id || ''
        }
        return true
      }
      error.value = result?.error || '退出家族失败'
      return false
    } catch (e: any) {
      error.value = e.message || '退出家族失败'
      return false
    } finally {
      loading.value = false
    }
  }

  async function removeMember(familyId: string, userId: string) {
    try {
      const result = await familiesApi.removeMember(familyId, userId)
      if (result?.success) {
        members.value = members.value.filter(m => m.id !== userId)
        return true
      }
      return false
    } catch (e) {
      return false
    }
  }

  async function loadAlbumPhotos(albumId: string, albumName: string) {
    if (!currentFamilyId.value) return { id: albumId, name: albumName, photos: [] }
    try {
      const { photos } = await require('../api')
      const allPhotos = await photos.getByFamily(currentFamilyId.value)
      if (!allPhotos || !Array.isArray(allPhotos)) {
        return { id: albumId, name: albumName, photos: [] }
      }
      const filtered = allPhotos.filter((p: any) => p.albumId === albumId)
      return { id: albumId, name: albumName, photos: filtered }
    } catch (e) {
      return { id: albumId, name: albumName, photos: [] }
    }
  }

  async function initializeFamilyData() {
    await fetchFamilies()
    if (families.value.length > 0 && !currentFamilyId.value) {
      currentFamilyId.value = families.value[0].id
      localStorage.setItem('currentFamily', currentFamilyId.value)
    }
  }

  async function loadFamilyData(familyId?: string) {
    const fid = familyId || currentFamilyId.value
    if (!fid) return null
    try {
      const data = await familiesApi.getById(fid)
      return data
    } catch (e) {
      return null
    }
  }

  return {
    families, currentFamilyId, members, inviteCode, loading, error,
    currentFamily, currentFamilyRole, canCreateAlbum, canManageMembers, hasNoFamily,
    fetchFamilies, createFamily, fetchMembers, fetchInviteCode,
    regenerateInviteCode, switchFamily, joinFamily, leaveFamily, removeMember,
    loadFamilyData, loadAlbumPhotos, initializeFamilyData
  }
})
