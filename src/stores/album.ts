import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { albums as albumsApi } from '../api'
import type { Album } from '../types'

export const useAlbumStore = defineStore('album', () => {
  const albums = ref<Album[]>([])
  const currentAlbum = ref<Album | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAlbums(familyId: string) {
    loading.value = true
    error.value = null
    try {
      const data = await albumsApi.getByFamily(familyId)
      albums.value = data || []
      return albums.value
    } catch (e: any) {
      error.value = e.message || '获取相册列表失败'
      return []
    } finally {
      loading.value = false
    }
  }

  async function createAlbum(familyId: string, data: { name: string; description?: string; privacy: string }) {
    loading.value = true
    error.value = null
    try {
      const result = await albumsApi.create(familyId, data)
      if (result?.id) {
        albums.value.push(result)
        return result
      }
      error.value = result?.error || '创建相册失败'
      return null
    } catch (e: any) {
      error.value = e.message || '创建相册失败'
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateAlbum(albumId: string, data: { name?: string; description?: string; privacy?: string }) {
    try {
      const result = await albumsApi.update(albumId, data)
      if (result?.id) {
        const idx = albums.value.findIndex(a => a.id === albumId)
        if (idx >= 0) {
          albums.value[idx] = { ...albums.value[idx], ...result }
        }
        return result
      }
      return null
    } catch (e) {
      return null
    }
  }

  async function deleteAlbum(albumId: string) {
    try {
      const result = await albumsApi.delete(albumId)
      if (result?.success) {
        albums.value = albums.value.filter(a => a.id !== albumId)
        return true
      }
      return false
    } catch (e) {
      return false
    }
  }

  function setCurrentAlbum(album: Album | null) {
    currentAlbum.value = album
  }

  return {
    albums, currentAlbum, loading, error,
    fetchAlbums, createAlbum, updateAlbum, deleteAlbum, setCurrentAlbum
  }
})
