import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/services/api';
import type { Notification } from '@/types';

export const useNotificationStore = defineStore('notification', () => {
  // State
  const notifications = ref<Notification[]>([]);
  const unreadCount = ref(0);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref({
    currentPage: 1,
    perPage: 20,
    total: 0,
    lastPage: 1,
  });

  // Getters
  const hasUnread = computed(() => unreadCount.value > 0);

  // Actions
  async function fetchNotifications(unread?: boolean, page = 1) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.getNotifications(unread, page);
      if (res.success && res.data) {
        if (page === 1) {
          notifications.value = res.data.data;
        } else {
          notifications.value.push(...res.data.data);
        }
        pagination.value = res.data.pagination;
      }
      return res;
    } catch (e: any) {
      error.value = e.response?.data?.message || '获取通知列表失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function fetchUnreadCount() {
    try {
      const res = await api.getNotifications(true, 1);
      if (res.success) {
        unreadCount.value = (res as any).unread_count || 0;
      }
      return res;
    } catch (e: any) {
      console.error('获取未读数量失败', e);
    }
  }

  async function markAsRead(id: number) {
    try {
      const res = await api.markNotificationRead(id);
      if (res.success) {
        const notification = notifications.value.find(n => n.id === id);
        if (notification && !notification.is_read) {
          notification.is_read = true;
          unreadCount.value = Math.max(0, unreadCount.value - 1);
        }
      }
      return res;
    } catch (e: any) {
      error.value = e.response?.data?.message || '标记已读失败';
      throw e;
    }
  }

  async function markAllAsRead() {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.markAllNotificationsRead();
      if (res.success) {
        notifications.value.forEach(n => n.is_read = true);
        unreadCount.value = 0;
      }
      return res;
    } catch (e: any) {
      error.value = e.response?.data?.message || '标记全部已读失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  return {
    // State
    notifications,
    unreadCount,
    loading,
    error,
    pagination,
    // Getters
    hasUnread,
    // Actions
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
  };
});
