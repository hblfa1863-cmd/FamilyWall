import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { notifications as notificationsApi } from '../api'
import type { Notification } from '../types'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])
  const loading = ref(false)

  const unreadCount = computed(() => 
    notifications.value.filter(n => !n.read).length
  )

  async function fetchNotifications() {
    loading.value = true
    try {
      const data = await notificationsApi.getAll()
      notifications.value = data || []
      return notifications.value
    } catch (e) {
      return []
    } finally {
      loading.value = false
    }
  }

  async function markAsRead(notifId: string) {
    try {
      await notificationsApi.markRead(notifId)
      const idx = notifications.value.findIndex(n => n.id === notifId)
      if (idx >= 0) {
        notifications.value[idx].read = true
      }
      return true
    } catch (e) {
      return false
    }
  }

  async function markAllAsRead() {
    const unread = notifications.value.filter(n => !n.read)
    await Promise.all(unread.map(n => markAsRead(n.id)))
  }

  return {
    notifications, loading, unreadCount,
    fetchNotifications, markAsRead, markAllAsRead
  }
})
