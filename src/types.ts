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
}

export interface Photo {
  id: string
  familyId: string
  albumId?: string
  urls: string[]
  type: 'image' | 'video'
  title?: string
  description?: string
  uploadedBy: string
  createdAt: string
  likeCount?: number
  commentCount?: number
}

export interface Comment {
  id: string
  photoId: string
  author: string
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
  createdAt: string
}

export interface Notification {
  id: string
  type: 'like' | 'comment' | 'friend_request' | 'family_invite'
  fromUserId: string
  fromUsername?: string
  toUserId: string
  photoId?: string
  read: boolean
  createdAt: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
