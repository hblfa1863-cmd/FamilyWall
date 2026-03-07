import { defineStore } from 'pinia'
import { ref } from 'vue'
import { friends as friendsApi } from '../api'
import type { Friend } from '../types'

export const useFriendStore = defineStore('friend', () => {
  const friends = ref<Friend[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchFriends() {
    loading.value = true
    error.value = null
    try {
      const data = await friendsApi.getAll()
      friends.value = data || []
      return friends.value
    } catch (e: any) {
      error.value = e.message || '获取好友列表失败'
      return []
    } finally {
      loading.value = false
    }
  }

  async function searchUsers(query: string) {
    try {
      return await friendsApi.search(query)
    } catch (e) {
      return []
    }
  }

  async function addFriend(userId: string) {
    try {
      const result = await friendsApi.add(userId)
      if (result?.success || result?.id) {
        await fetchFriends()
        return true
      }
      return false
    } catch (e) {
      return false
    }
  }

  async function respondToRequest(userId: string, accept: boolean) {
    try {
      const result = await friendsApi.respond(userId, accept)
      if (result?.success) {
        await fetchFriends()
        return true
      }
      return false
    } catch (e) {
      return false
    }
  }

  async function removeFriend(userId: string) {
    try {
      const result = await friendsApi.remove(userId)
      if (result?.success) {
        friends.value = friends.value.filter(f => f.id !== userId)
        return true
      }
      return false
    } catch (e) {
      return false
    }
  }

  return {
    friends, loading, error,
    fetchFriends, searchUsers, addFriend, respondToRequest, removeFriend
  }
})
