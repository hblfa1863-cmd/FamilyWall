import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { auth as authApi, type User } from '../api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isLoggedIn = computed(() => !!token.value && !!user.value)

  function init() {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
    }
  }

  async function login(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const result = await authApi.login(email, password)
      if (result?.user && result?.token) {
        token.value = result.token
        user.value = result.user
        localStorage.setItem('token', result.token)
        localStorage.setItem('user', JSON.stringify(result.user))
        return result
      }
      error.value = result?.error || '登录失败'
      return result
    } catch (e: any) {
      error.value = e.message || '登录失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function register(username: string, email: string, password: string, inviteCode?: string) {
    loading.value = true
    error.value = null
    try {
      const result = await authApi.register(username, email, password, inviteCode)
      if (result?.token) {
        token.value = result.token
        user.value = result.user || { id: result.id, username, email }
        localStorage.setItem('token', result.token)
        localStorage.setItem('user', JSON.stringify(user.value))
        return result
      }
      error.value = result?.error || '注册失败'
      return result
    } catch (e: any) {
      error.value = e.message || '注册失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchUser() {
    if (!token.value) return null
    try {
      const result = await authApi.getMe()
      if (result) {
        user.value = result
        localStorage.setItem('user', JSON.stringify(result))
      }
      return result
    } catch (e) {
      logout()
      return null
    }
  }

  function logout() {
    authApi.logout()
    user.value = null
    token.value = null
  }

  init()

  return {
    user,
    token,
    loading,
    error,
    isLoggedIn,
    login,
    register,
    fetchUser,
    logout,
    init
  }
})
