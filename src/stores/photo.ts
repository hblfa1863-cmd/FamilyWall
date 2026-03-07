import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Photo, Comment } from '../types'

export const usePhotoStore = defineStore('photo', () => {
  const photos = ref<Photo[]>([])
  const selectedPhoto = ref<Photo | null>(null)
  const photoLikes = ref<Record<string, { liked: boolean; count: number }>>({})
  const loading = ref(false)
  const uploading = ref(false)
  const error = ref<string | null>(null)

  function setPhotos(newPhotos: Photo[]) {
    photos.value = newPhotos || []
  }

  function addPhoto(photo: Photo) {
    photos.value.unshift(photo)
  }

  function removePhoto(photoId: string) {
    photos.value = photos.value.filter(p => p.id !== photoId)
  }

  function removePhotos(photoIds: string[]) {
    photos.value = photos.value.filter(p => !photoIds.includes(p.id))
  }

  function selectPhoto(photo: Photo | null) {
    selectedPhoto.value = photo
  }

  function updatePhotoLikes(photoId: string, liked: boolean, count: number) {
    photoLikes.value[photoId] = { liked, count }
  }

  function addComment(photoId: string, comment: Comment) {
    const photo = photos.value.find(p => p.id === photoId)
    if (photo) {
      if (!photo.comments) photo.comments = []
      photo.comments.push(comment)
      photo.commentCount = (photo.commentCount || 0) + 1
    }
  }

  function setLoading(val: boolean) {
    loading.value = val
  }

  function setUploading(val: boolean) {
    uploading.value = val
  }

  function setError(err: string | null) {
    error.value = err
  }

  return {
    photos, selectedPhoto, photoLikes, loading, uploading, error,
    setPhotos, addPhoto, removePhoto, removePhotos, selectPhoto,
    updatePhotoLikes, addComment, setLoading, setUploading, setError
  }
})
