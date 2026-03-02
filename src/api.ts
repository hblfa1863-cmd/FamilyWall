// API 配置
const API_BASE = 'https://family-wall-backend.vercel.app/api'

export const auth = {
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (data.token) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
    }
    return data
  },

  async register(username: string, email: string, password: string, inviteCode?: string) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, inviteCode }),
    })
    const data = await res.json()
    if (data.token) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
    }
    return data
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    return res.json()
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
    return res.json()
  },

  async create(name: string, description: string) {
    const res = await fetch(`${API_BASE}/families`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ name, description }),
    })
    return res.json()
  },

  async getMembers(familyId: string) {
    const res = await fetch(`${API_BASE}/families/${familyId}/members`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    return res.json()
  },

  async getInviteCode(familyId: string) {
    const res = await fetch(`${API_BASE}/families/${familyId}/invite-code`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    return res.json()
  },

  async regenerateInviteCode(familyId: string) {
    const res = await fetch(`${API_BASE}/families/${familyId}/regenerate-invite-code`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    return res.json()
  },

  async leave(familyId: string) {
    const res = await fetch(`${API_BASE}/families/${familyId}/leave`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    return res.json()
  },

  async delete(familyId: string) {
    const res = await fetch(`${API_BASE}/families/${familyId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    return res.json()
  },
}

export const albums = {
  async getByFamily(familyId: string) {
    const res = await fetch(`${API_BASE}/families/${familyId}/albums`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    return res.json()
  },

  async create(familyId: string, data: { name: string; description?: string; cover?: string; privacy?: string; allowedMembers?: string[] }) {
    const res = await fetch(`${API_BASE}/families/${familyId}/albums`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify(data),
    })
    return res.json()
  },

  async delete(albumId: string) {
    const res = await fetch(`${API_BASE}/albums/${albumId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    return res.json()
  },
}

export const photos = {
  async getByFamily(familyId: string) {
    const res = await fetch(`${API_BASE}/families/${familyId}/photos`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    return res.json()
  },

  async upload(familyId: string, data: { urls: string[]; type?: string; title?: string; description?: string; albumId?: string }) {
    const res = await fetch(`${API_BASE}/families/${familyId}/photos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify(data),
    })
    return res.json()
  },

  async getById(photoId: string) {
    const res = await fetch(`${API_BASE}/photos/${photoId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    return res.json()
  },

  async delete(photoId: string) {
    const res = await fetch(`${API_BASE}/photos/${photoId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    return res.json()
  },

  async addComment(photoId: string, content: string) {
    const res = await fetch(`${API_BASE}/photos/${photoId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ content }),
    })
    return res.json()
  },
}
