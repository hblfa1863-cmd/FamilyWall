// 类型定义

export interface User {
  id: number;
  email: string;
  nickname: string;
  avatar?: string;
  bio?: string;
  gender?: 'male' | 'female' | 'other';
  birthday?: string;
  phone?: string;
  wechat_openid?: string;
  status: 'active' | 'deactivated' | 'banned';
  email_verified_at?: string;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  id: number;
  user_id: number;
  comment_notify: boolean;
  like_notify: boolean;
  mention_notify: boolean;
  show_location: boolean;
}

export interface Family {
  id: number;
  name: string;
  avatar?: string;
  owner_id: number;
  member_count?: number;
  note_count?: number;
  members?: FamilyMember[];
  created_at: string;
  updated_at: string;
}

export interface FamilyMember {
  id: number;
  family_id: number;
  user_id: number;
  role: 'admin' | 'member';
  nickname?: string;
  joined_at: string;
  user?: User;
}

export interface Clan {
  id: number;
  name: string;
  avatar?: string;
  bio?: string;
  owner_id: number;
  family_count?: number;
  note_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: number;
  user_id: number;
  family_id: number;
  title: string;
  content: string;
  location_name?: string;
  location_lat?: number;
  location_lng?: number;
  visibility: 'family' | 'clan' | 'public';
  cover?: string;
  user?: User;
  family?: Family;
  media?: NoteMedia[];
  comments?: Comment[];
  is_liked?: boolean;
  is_favorited?: boolean;
  like_count?: number;
  comment_count?: number;
  created_at: string;
  updated_at: string;
}

export interface NoteMedia {
  id: number;
  note_id: number;
  type: 'image' | 'video';
  url: string;
  sort_order: number;
}

export interface Comment {
  id: number;
  note_id: number;
  user_id: number;
  parent_id?: number;
  content: string;
  user?: User;
  created_at: string;
}

export interface Notification {
  id: number;
  user_id: number;
  type: 'comment' | 'like' | 'mention' | 'follow' | 'system';
  title: string;
  content?: string;
  data?: Record<string, any>;
  is_read: boolean;
  created_at: string;
}

export interface InviteCode {
  code: string;
  expires_at: string;
  max_uses: number;
  used_count: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
  is_new?: boolean;
}

// ==================== 搜索相关 ====================

export interface SearchResult {
  users: User[];
  families: Family[];
  clans: Clan[];
  notes: Note[];
}

export interface SearchResponse {
  success: boolean;
  data: SearchResult;
}

// ==================== 通用类型 ====================

export interface SimpleFamily {
  id: number;
  name: string;
  avatar?: string;
  member_count?: number;
  note_count?: number;
}

export interface SimpleClan {
  id: number;
  name: string;
  avatar?: string;
  bio?: string;
  family_count?: number;
  note_count?: number;
}

export interface SimpleNote {
  id: number;
  title: string;
  cover?: string;
  user_id?: number;
  family_id?: number;
  created_at?: string;
}

export interface NoteAuthor {
  id: number;
  nickname: string;
  avatar?: string;
}

export interface NoteWithAuthor extends SimpleNote {
  author: NoteAuthor;
  media?: NoteMedia[];
}

export interface TimelineItem {
  date: string;
  notes: NoteWithAuthor[];
}

// ==================== 响应类型 ====================

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface ApiSuccess<T> {
  success: true;
  message?: string;
  data: T;
}

export type ApiResult<T> = ApiSuccess<T> | ApiError;

// ==================== 请求类型 ====================

export interface LoginRequest {
  email: string;
  password?: string;
  code?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  code: string;
  nickname: string;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  family_id: number;
  visibility?: 'family' | 'clan' | 'public';
  location_name?: string;
  location_lat?: number;
  location_lng?: number;
  images?: string[];
  videos?: string[];
}

export interface UpdateNoteRequest extends Partial<CreateNoteRequest> {
  id: number;
}

export interface CreateFamilyRequest {
  name: string;
  avatar?: string;
}

export interface CreateClanRequest {
  name: string;
  bio?: string;
  avatar?: string;
}

export interface JoinFamilyRequest {
  code: string;
}

// ==================== 错误类型 ====================

export interface ApiException {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
  message?: string;
}

// ==================== 映射类型 ====================

export interface NoteListItem {
  id: number;
  title: string;
  cover?: string;
  imagesCount?: number;
  author: {
    nickname: string;
    avatar?: string;
  };
}

export interface FamilyListItem {
  id: number;
  name: string;
  avatar?: string;
  memberCount?: number;
  noteCount?: number;
}

export interface ClanListItem {
  id: number;
  name: string;
  avatar?: string;
  bio?: string;
  familyCount?: number;
  noteCount?: number;
}

export interface MemberItem {
  id: number;
  nickname: string;
  avatar?: string;
  role: 'admin' | 'member';
  joinedAt: string;
}
