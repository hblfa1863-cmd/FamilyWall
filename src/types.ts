// ============================================
// 类型定义
// ============================================

export interface User {
  id: string
  username: string
  email: string
}

export interface Family {
  id: string
  name: string
  description?: string
  role?: 'admin' | 'maintainer' | 'member'
  inviteCode?: string
  createdAt?: string
  members?: FamilyMember[]
}

export interface FamilyMember {
  id: string
  userId: string
  username: string
  email: string
  role: 'admin' | 'maintainer' | 'member'
  joinedAt?: string
}

export interface Album {
  id: string
  familyId: string
  name: string
  description?: string
  cover?: string
  privacy: 'public' | 'private' | 'protected'
  createdBy: string
  createdAt: string
  updatedAt: string
  photoCount?: number
}

export interface Photo {
  id: string
  familyId: string
  albumId?: string
  urls: string[]
  url?: string
  type: 'image' | 'video'
  title?: string
  description?: string
  uploadedBy: string
  createdAt: string
  likeCount?: number
  commentCount?: number
  comments?: Comment[]
}

export interface Comment {
  id: string
  photoId: string
  author: string
  authorId?: string
  text: string
  createdAt: string
}

export interface Like {
  id: string
  userId: string
  username: string
  createdAt: string
}

export interface Friend {
  id: string
  userId: string
  username: string
  email: string
  status: 'pending' | 'accepted'
  createdAt?: string
}

export interface Notification {
  id: string
  type: 'like' | 'comment' | 'friend_request' | 'family_invite'
  fromUserId: string
  fromUsername?: string
  toUserId: string
  photoId?: string
  familyId?: string
  read: boolean
  createdAt: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

// API 请求类型
export interface CreateAlbumRequest {
  name: string
  description?: string
  privacy?: 'public' | 'private' | 'protected'
  cover?: string
}

export interface UpdateAlbumRequest {
  name?: string
  description?: string
  privacy?: 'public' | 'private' | 'protected'
  cover?: string
}

export interface UploadPhotoRequest {
  urls: string[]
  type?: 'image' | 'video'
  title?: string
  description?: string
  albumId: string
}

export interface CreateFamilyRequest {
  name: string
  description?: string
}

export interface InviteCodeResponse {
  code: string
  expiresAt?: string
}
