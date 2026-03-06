import type { User, Family, Album, Photo, Comment, Like, Friend, Notification } from './types'

// API 配置
const API_BASE = 'https://family-wall-backend.vercel.app/api'

// 辅助函数：统一处理响应，兼容成功和失败格式
const handleResponse = async (res: Response) => {
  try {
    const data = await res.json()
    console.log('API Response:', data) // 添加日志
    if (data.success === false) {
      return { error: data.error, ...data }
    }
    return data.data || data
  } catch (e) {
    console.error('API response parse error:', e)
    return { error: '响应解析失败' }
  }
}

// 获取带缓存控制的headers - 所有API调用必须使用这个函数
const getAuthHeaders = (extraHeaders: Record<string, string> = {}) => ({
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  ...extraHeaders
})

// 添加时间戳到URL防止缓存
const addCacheBuster = (url: string) => {
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}_=${Date.now()}`
}

export const validateInviteCode = async (code: string) => {
  if (!code) return { valid: true }
  const res = await fetch(addCacheBuster(`${API_BASE}/families/validate-invite?code=${encodeURIComponent(code)}`), {
    headers: getAuthHeaders(),
  })
  return handleResponse(res)
}

export const auth = {
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const result = await handleResponse(res)
    if (result?.token) {
      localStorage.setItem('token', result.token)
      localStorage.setItem('user', JSON.stringify(result.user))
    }
    return result
  },

  async register(username: string, email: string, password: string, inviteCode?: string) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, inviteCode }),
    })
    const result = await handleResponse(res)
    if (result?.token) {
      localStorage.setItem('token', result.token)
      localStorage.setItem('user', JSON.stringify(result.user))
    }
    return result
  },

  async getMe() {
    const res = await fetch(addCacheBuster(`${API_BASE}/auth/me`), {
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('currentFamily')
  },

  getUser() {
    return JSON.parse(localStorage.getItem('user') || '{}')
  },

  isLoggedIn() {
    return !!localStorage.getItem('token')
  },
}

export const families = {
  async getAll() {
    const res = await fetch(addCacheBuster(`${API_BASE}/families`), {
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },

  async create(name: string, description: string) {
    const res = await fetch(`${API_BASE}/families`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ name, description }),
    })
    return handleResponse(res)
  },

  async getMembers(familyId: string) {
    const res = await fetch(addCacheBuster(`${API_BASE}/families/${familyId}/members`), {
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },

  async getInviteCode(familyId: string) {
    const res = await fetch(addCacheBuster(`${API_BASE}/families/${familyId}/invite-code`), {
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },

  async regenerateInviteCode(familyId: string) {
    const res = await fetch(`${API_BASE}/families/${familyId}/regenerate-invite-code`, {
      method: 'POST',
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },

  async leave(familyId: string) {
    const res = await fetch(`${API_BASE}/families/${familyId}/leave`, {
      method: 'POST',
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },

  async delete(familyId: string) {
    const res = await fetch(`${API_BASE}/families/${familyId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },
}

export const albums = {
  async getByFamily(familyId: string) {
    if (!familyId) return []
    const res = await fetch(addCacheBuster(`${API_BASE}/families/${familyId}/albums`), {
      headers: getAuthHeaders(),
    })
    if (res.status === 403) {
      console.warn('Access to albums forbidden')
      return []
    }
    return handleResponse(res)
  },

  async create(familyId: string, data: { name: string; description?: string; cover?: string; privacy?: string; allowedMembers?: string[] }) {
    if (!familyId) {
      return { error: '请先选择一个家族', id: null }
    }
    const res = await fetch(`${API_BASE}/families/${familyId}/albums`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data),
    })
    const result = await handleResponse(res)
    if (res.status === 403) {
      return { error: '没有权限创建相册，请确认您已是该家族成员', id: null }
    }
    return result
  },

  async delete(albumId: string) {
    const res = await fetch(`${API_BASE}/albums/${albumId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },

  async getById(albumId: string) {
    const res = await fetch(addCacheBuster(`${API_BASE}/albums/${albumId}`), {
      headers: getAuthHeaders(),
    })
    if (res.status === 403) {
      return { error: '没有权限访问此相册' }
    }
    return handleResponse(res)
  },
}

export const photos = {
  async getByFamily(familyId: string) {
    const res = await fetch(addCacheBuster(`${API_BASE}/families/${familyId}/photos`), {
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },

  async upload(familyId: string, data: { urls: string[]; type?: string; title?: string; description?: string; albumId?: string }) {
    const res = await fetch(`${API_BASE}/families/${familyId}/photos`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data),
    })
    return handleResponse(res)
  },

  async getById(photoId: string) {
    const res = await fetch(addCacheBuster(`${API_BASE}/photos/${photoId}`), {
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },

  async delete(photoId: string) {
    const res = await fetch(`${API_BASE}/photos/${photoId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },

  async addComment(photoId: string, content: string) {
    const res = await fetch(`${API_BASE}/photos/${photoId}/comments`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ content }),
    })
    return handleResponse(res)
  },

  async deleteMany(photoIds: string[]) {
    const results = await Promise.all(
      photoIds.map(id => this.delete(id))
    )
    return { success: !results.some(r => r.error), deleted: results.length }
  },

  async toggleLike(photoId: string) {
    const res = await fetch(`${API_BASE}/photos/${photoId}/like`, {
      method: 'POST',
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },

  async getLikes(photoId: string) {
    const res = await fetch(addCacheBuster(`${API_BASE}/photos/${photoId}/likes`), {
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },
}

export const friends = {
  async search(query: string) {
    const res = await fetch(addCacheBuster(`${API_BASE}/users/search?q=${encodeURIComponent(query)}`), {
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },

  async add(friendId: string) {
    const res = await fetch(`${API_BASE}/friends/${friendId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },

  async getAll() {
    const res = await fetch(addCacheBuster(`${API_BASE}/friends`), {
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },

  async respond(friendId: string, accept: boolean) {
    const res = await fetch(`${API_BASE}/friends/${friendId}/respond`, {
      method: 'PUT',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ accept }),
    })
    return handleResponse(res)
  },

  async remove(friendId: string) {
    const res = await fetch(`${API_BASE}/friends/${friendId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },
}

export const notifications = {
  async getAll() {
    const res = await fetch(addCacheBuster(`${API_BASE}/notifications`), {
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },

  async markRead(notifId: string) {
    const res = await fetch(`${API_BASE}/notifications/${notifId}/read`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },
}

export const reports = {
  async reportPhoto(photoId: string, reason: string) {
    const res = await fetch(`${API_BASE}/photos/${photoId}/report`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ reason }),
    })
    return handleResponse(res)
  },

  async reportUser(userId: string, reason: string) {
    const res = await fetch(`${API_BASE}/users/${userId}/report`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ reason }),
    })
    return handleResponse(res)
  },
}
