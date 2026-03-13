import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse, AuthResponse, User, UserSettings, Family, Clan, Note, Notification, InviteCode, PaginatedResponse } from '@/types';

// 从 localStorage 获取 API 地址
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('api_url') || '';
  }
  return '';
};

class ApiService {
  private token: string | null = null;

  // 创建 axios 实例
  private createClient() {
    const client = axios.create({
      baseURL: getBaseUrl() || 'http://localhost:8000/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 请求拦截器
    client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (this.token && config.headers) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        // 动态更新 baseURL
        config.baseURL = getBaseUrl() || config.baseURL;
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 响应拦截器
    client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiResponse>) => {
        if (error.response?.status === 401) {
          this.token = null;
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    return client;
  }

  // Token管理
  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  // API 地址管理
  setApiUrl(url: string) {
    localStorage.setItem('api_url', url);
  }

  getApiUrl(): string {
    return localStorage.getItem('api_url') || '';
  }

  // ==================== 认证 ====================

  async sendVerifyCode(email: string, type: 'register' | 'login' | 'reset_password'): Promise<ApiResponse<{ code: string; expires_in: number }>> {
    const { data } = await this.createClient().post('/auth/verify-code', { email, type });
    return data;
  }

  async register(email: string, password: string, code: string, nickname: string): Promise<ApiResponse<AuthResponse>> {
    const { data } = await this.createClient().post('/auth/register', {
      email, password, password_confirmation: password, code, nickname,
    });
    if (data.success && data.data?.token) {
      this.setToken(data.data.token);
    }
    return data;
  }

  async login(email: string, password?: string, code?: string): Promise<ApiResponse<AuthResponse>> {
    const payload: any = { email };
    if (password) payload.password = password;
    if (code) payload.code = code;
    const { data } = await this.createClient().post('/auth/login', payload);
    if (data.success && data.data?.token) {
      this.setToken(data.data.token);
    }
    return data;
  }

  async logout(): Promise<ApiResponse> {
    try {
      await this.createClient().post('/auth/logout');
    } finally {
      this.setToken(null);
    }
    return { success: true, message: '登出成功' };
  }

  async resetPassword(email: string, password: string, code: string): Promise<ApiResponse> {
    const { data } = await this.createClient().post('/auth/reset-password', { email, password, code });
    return data;
  }

  async wechatLogin(code: string, nickname?: string, avatar?: string): Promise<ApiResponse<AuthResponse>> {
    const { data } = await this.createClient().post('/auth/wechat/login', { code, nickname, avatar });
    if (data.success && data.data?.token) {
      this.setToken(data.data.token);
    }
    return data;
  }

  // ==================== 用户 ====================

  async getProfile(): Promise<ApiResponse<User>> {
    const { data } = await this.createClient().get('/user');
    return data;
  }

  async updateProfile(profile: Partial<User>): Promise<ApiResponse<User>> {
    const { data } = await this.createClient().put('/user', profile);
    return data;
  }

  async updatePassword(currentPassword: string, password: string): Promise<ApiResponse> {
    const { data } = await this.createClient().put('/user/password', {
      current_password: currentPassword,
      password,
      password_confirmation: password,
    });
    return data;
  }

  async getSettings(): Promise<ApiResponse<UserSettings>> {
    const { data } = await this.createClient().get('/user/settings');
    return data;
  }

  async updateSettings(settings: Partial<UserSettings>): Promise<ApiResponse<UserSettings>> {
    const { data } = await this.createClient().put('/user/settings', settings);
    return data;
  }

  async deactivate(password: string): Promise<ApiResponse> {
    const { data } = await this.createClient().post('/user/deactivate', { password });
    this.setToken(null);
    return data;
  }

  async cancelDeactivation(): Promise<ApiResponse> {
    const { data } = await this.createClient().post('/user/cancel-deactivation');
    return data;
  }

  // ==================== 家庭 ====================

  async getFamilies(): Promise<ApiResponse<Family[]>> {
    const { data } = await this.createClient().get('/families');
    return data;
  }

  async createFamily(name: string, avatar?: string): Promise<ApiResponse<Family>> {
    const { data } = await this.createClient().post('/families', { name, avatar });
    return data;
  }

  async getFamily(id: number): Promise<ApiResponse<Family>> {
    const { data } = await this.createClient().get(`/families/${id}`);
    return data;
  }

  async updateFamily(id: number, info: { name?: string; avatar?: string }): Promise<ApiResponse<Family>> {
    const { data } = await this.createClient().put(`/families/${id}`, info);
    return data;
  }

  async deleteFamily(id: number): Promise<ApiResponse> {
    const { data } = await this.createClient().delete(`/families/${id}`);
    return data;
  }

  async generateInviteCode(familyId: number): Promise<ApiResponse<InviteCode>> {
    const { data } = await this.createClient().post(`/families/${familyId}/invite`);
    return data;
  }

  async joinFamily(code: string): Promise<ApiResponse<Family>> {
    const { data } = await this.createClient().post('/families/join', { code });
    return data;
  }

  async getFamilyMembers(familyId: number): Promise<ApiResponse<any[]>> {
    const { data } = await this.createClient().get(`/families/${familyId}/members`);
    return data;
  }

  async removeFamilyMember(familyId: number, userId: number): Promise<ApiResponse> {
    const { data } = await this.createClient().delete(`/families/${familyId}/members/${userId}`);
    return data;
  }

  // ==================== 家族 ====================

  async getMyClans(): Promise<ApiResponse<Clan[]>> {
    const { data } = await this.createClient().get('/clans');
    return data;
  }

  async getPublicClans(keyword?: string): Promise<ApiResponse<PaginatedResponse<Clan>>> {
    const { data } = await this.createClient().get('/clans/public', { params: { keyword } });
    return data;
  }

  async createClan(name: string, bio?: string, avatar?: string): Promise<ApiResponse<Clan>> {
    const { data } = await this.createClient().post('/clans', { name, bio, avatar });
    return data;
  }

  async getClan(id: number): Promise<ApiResponse<Clan>> {
    const { data } = await this.createClient().get(`/clans/${id}`);
    return data;
  }

  async updateClan(id: number, info: { name?: string; bio?: string; avatar?: string }): Promise<ApiResponse<Clan>> {
    const { data } = await this.createClient().put(`/clans/${id}`, info);
    return data;
  }

  async deleteClan(id: number): Promise<ApiResponse> {
    const { data } = await this.createClient().delete(`/clans/${id}`);
    return data;
  }

  async applyJoinClan(clanId: number, familyId?: number): Promise<ApiResponse> {
    const { data } = await this.createClient().post(`/clans/${clanId}/apply`, { family_id: familyId });
    return data;
  }

  async getClanFamilies(clanId: number): Promise<ApiResponse<Family[]>> {
    const { data } = await this.createClient().get(`/clans/${clanId}/families`);
    return data;
  }

  // ==================== 笔记 ====================

  async getNotes(familyId?: number, page = 1): Promise<ApiResponse<PaginatedResponse<Note>>> {
    const { data } = await this.createClient().get('/notes', { params: { family_id: familyId, page } });
    return data;
  }

  async createNote(note: {
    title: string;
    content: string;
    family_id: number;
    visibility?: 'family' | 'clan' | 'public';
    location_name?: string;
    location_lat?: number;
    location_lng?: number;
    images?: string[];
    videos?: string[];
  }): Promise<ApiResponse<Note>> {
    const { data } = await this.createClient().post('/notes', note);
    return data;
  }

  async getNote(id: number): Promise<ApiResponse<Note>> {
    const { data } = await this.createClient().get(`/notes/${id}`);
    return data;
  }

  async updateNote(id: number, note: Partial<Note>): Promise<ApiResponse<Note>> {
    const { data } = await this.createClient().put(`/notes/${id}`, note);
    return data;
  }

  async deleteNote(id: number): Promise<ApiResponse> {
    const { data } = await this.createClient().delete(`/notes/${id}`);
    return data;
  }

  async addComment(noteId: number, content: string, parentId?: number): Promise<ApiResponse<any>> {
    const { data } = await this.createClient().post(`/notes/${noteId}/comments`, { content, parent_id: parentId });
    return data;
  }

  async deleteComment(noteId: number, commentId: number): Promise<ApiResponse> {
    const { data } = await this.createClient().delete(`/notes/${noteId}/comments/${commentId}`);
    return data;
  }

  async toggleLike(noteId: number): Promise<ApiResponse<{ is_liked: boolean }>> {
    const { data } = await this.createClient().post(`/notes/${noteId}/like`);
    return data;
  }

  async toggleFavorite(noteId: number): Promise<ApiResponse<{ is_favorited: boolean }>> {
    const { data } = await this.createClient().post(`/notes/${noteId}/favorite`);
    return data;
  }

  // 搜索
  async search(keyword: string): Promise<ApiResponse<any>> {
    const { data } = await this.createClient().get("/search", { params: { keyword } });
    return data;
  }

  async getPhotos(page = 1): Promise<ApiResponse<PaginatedResponse<Note>>> {
    const { data } = await this.createClient().get('/photos', { params: { page } });
    return data;
  }

  async getTimeline(): Promise<ApiResponse<Record<string, Note[]>>> {
    const { data } = await this.createClient().get('/timeline');
    return data;
  }

  // ==================== 通知 ====================

  async getNotifications(unread?: boolean, page = 1): Promise<ApiResponse<PaginatedResponse<Notification>>> {
    const { data } = await this.createClient().get('/notifications', { params: { unread, page } });
    return data;
  }

  async markNotificationRead(id: number): Promise<ApiResponse> {
    const { data } = await this.createClient().put(`/notifications/${id}/read`);
    return data;
  }

  async markAllNotificationsRead(): Promise<ApiResponse> {
    const { data } = await this.createClient().post('/notifications/read-all');
    return data;
  }
}

export const api = new ApiService();
export default api;
