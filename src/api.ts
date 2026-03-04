// API 配置
const API_BASE = 'https://family-wall-backend.vercel.app/api'

// 辅助函数：统一处理响应，兼容成功和失败格式
const handleResponse = async (res: Response) => {
  const data = await res.json()
  if (data.success === false) {
    // 后端返回错误
    return { error: data.error, ...data }
  }
  // 成功响应
  return data.data
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
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
    const res = await fetch(`${API_BASE}/families`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    return handleResponse(res)
  },

  async create(name: string, description: string) {
    const res = await fetch(`${API_BASE}/families`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ name, description }),
    })
    return handleResponse(res)
  },

  async getMembers(familyId: string) {
    const res = await fetch(`${API_BASE}/families/${familyId}/members`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    return handleResponse(res)
  },

  async getInviteCode(familyId: string) {
    const res = await fetch(`${API_BASE}/families/${familyId}/invite-code`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    return handleResponse(res)
  },

  async regenerateInviteCode(familyId: string) {
    const res = await fetch(`${API_BASE}/families/${familyId}/regenerate-invite-code`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    return handleResponse(res)
  },

  async leave(familyId: string) {
    const res = await fetch(`${API_BASE}/families/${familyId}/leave`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    return handleResponse(res)
  },

  async delete(familyId: string) {
    const res = await fetch(`${API_BASE}/families/${familyId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    return handleResponse(res)
  },
}

export const albums = {
  async getByFamily(familyId: string) {
    const res = await fetch(`${API_BASE}/families/${familyId}/albums`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    return handleResponse(res)
  },

  async create(familyId: string, data: { name: string; description?: string; cover?: string; privacy?: string; allowedMembers?: string[] }) {
    const res = await fetch(`${API_BASE}/families/${familyId}/albums`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify(data),
    })
    return handleResponse(res)
  },

  async delete(albumId: string) {
    const res = await fetch(`${API_BASE}/albums/${albumId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    return handleResponse(res)
  },
}

export const photos = {
  async getByFamily(familyId: string) {
    const res = await fetch(`${API_BASE}/families/${familyId}/photos`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    return handleResponse(res)
  },

  async upload(familyId: string, data: { urls: string[]; type?: string; title?: string; description?: string; albumId?: string }) {
    const res = await fetch(`${API_BASE}/families/${familyId}/photos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify(data),
    })
    return handleResponse(res)
  },

  async getById(photoId: string) {
    const res = await fetch(`${API_BASE}/photos/${photoId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    return handleResponse(res)
  },

  async delete(photoId: string) {
    const res = await fetch(`${API_BASE}/photos/${photoId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    return handleResponse(res)
  },

  async addComment(photoId: string, content: string) {
    const res = await fetch(`${API_BASE}/photos/${photoId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ content }),
    })
    return handleResponse(res)
  },

  // 批量删除照片
  async deleteMany(photoIds: string[]) {
    const results = await Promise.all(
      photoIds.map(id => this.delete(id))
    )
    return { success: !results.some(r => r.error), deleted: results.length }
  },
}
