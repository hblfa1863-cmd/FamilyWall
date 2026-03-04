import { describe, it, expect, vi, beforeEach } from 'vitest'
import { auth, families, albums, photos } from '../api'

// Mock fetch
global.fetch = vi.fn()

const mockFetch = global.fetch as ReturnType<typeof vi.fn>

describe('auth API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('login successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          user: { id: 'user1', username: '测试用户', email: 'test@example.com' },
          token: 'mock-token-123'
        }
      })
    })

    const result = await auth.login('test@example.com', 'password123')
    
    expect(result.user).toEqual({ id: 'user1', username: '测试用户', email: 'test@example.com' })
    expect(result.token).toBe('mock-token-123')
    expect(localStorage.getItem('token')).toBe('mock-token-123')
  })

  it('login failed with wrong credentials', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: false,
        error: '邮箱或密码错误'
      })
    })

    const result = await auth.login('wrong@example.com', 'wrongpassword')
    
    expect(result.error).toBe('邮箱或密码错误')
  })

  it('logout clears localStorage', () => {
    localStorage.setItem('token', 'some-token')
    localStorage.setItem('user', JSON.stringify({ id: 'user1' }))
    
    auth.logout()
    
    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
  })

  it('isLoggedIn returns true when token exists', () => {
    localStorage.setItem('token', 'some-token')
    expect(auth.isLoggedIn()).toBe(true)
  })

  it('isLoggedIn returns false when no token', () => {
    localStorage.clear()
    expect(auth.isLoggedIn()).toBe(false)
  })
})

describe('families API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    localStorage.setItem('token', 'test-token')
  })

  it('getAll returns families list', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [
          { id: 'fam1', name: '家族1' },
          { id: 'fam2', name: '家族2' }
        ]
      })
    })

    const result = await families.getAll()
    
    expect(result).toEqual([
      { id: 'fam1', name: '家族1' },
      { id: 'fam2', name: '家族2' }
    ])
  })

  it('create family successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { id: 'fam3', name: '新家族', description: '描述' }
      })
    })

    const result = await families.create('新家族', '描述')
    
    expect(result.id).toBe('fam3')
    expect(result.name).toBe('新家族')
  })
})

describe('photos API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    localStorage.setItem('token', 'test-token')
  })

  it('getByFamily returns photos list', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [
          { id: 'p1', title: '照片1' },
          { id: 'p2', title: '照片2' }
        ]
      })
    })

    const result = await photos.getByFamily('fam1')
    
    expect(result.length).toBe(2)
    expect(result[0].id).toBe('p1')
  })

  it('upload photo successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { id: 'p3', title: '新照片' }
      })
    })

    const result = await photos.upload('fam1', {
      urls: ['https://example.com/new.jpg'],
      title: '新照片'
    })
    
    expect(result.id).toBe('p3')
  })
})
