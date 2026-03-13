import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse, AuthResponse, User, UserSettings, Family, Clan, Note, Notification, InviteCode, PaginatedResponse } from '@/types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiService {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 请求拦截器 - 添加Token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (this.token && config.headers) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 响应拦截器 - 统一错误处理
    this.client.interceptors.response.use(
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

  // ==================== 认证 ====================

  // 发送验证码
  async sendVerifyCode(email: string, type: 'register' | 'login' | 'reset_password'): Promise<ApiResponse<{ code: string; expires_in: number }>> {
    const { data } = await this.client.post('/auth/verify-code', { email, type });
    return data;
  }

  // 注册
  async register(email: string, password: string, code: string, nickname: string): Promise<ApiResponse<AuthResponse>> {
    const { data } = await this.client.post('/auth/register', {
      email,
      password,
      password_confirmation: password,
      code,
      nickname,
    });
    if (data.success && data.data?.token) {
      this.setToken(data.data.token);
    }
    return data;
  }

  // 登录
  async login(email: string, password?: string, code?: string): Promise<ApiResponse<AuthResponse>> {
    const payload: any = { email };
    if (password) payload.password = password;
    if (code) payload.code = code;

    const { data } = await this.client.post('/auth/login', payload);
    if (data.success && data.data?.token) {
      this.setToken(data.data.token);
    }
    return data;
  }

  // 登出
  async logout(): Promise<ApiResponse> {
    try {
      await this.client.post('/auth/logout');
    } finally {
      this.setToken(null);
    }
    return { success: true, message: '登出成功' };
  }

  // 重置密码
  async resetPassword(email: string, password: string, code: string): Promise<ApiResponse> {
    const { data } = await this.client.post('/auth/reset-password', { email, password, code });
    return data;
  }

  // 微信登录
  async wechatLogin(code: string, nickname?: string, avatar?: string): Promise<ApiResponse<AuthResponse>> {
    const { data } = await this.client.post('/auth/wechat/login', { code, nickname, avatar });
    if (data.success && data.data?.token) {
      this.setToken(data.data.token);
    }
    return data;
  }

  // ==================== 用户 ====================

  // 获取当前用户信息
  async getProfile(): Promise<ApiResponse<User>> {
    const { data } = await this.client.get('/user');
    return data;
  }

  // 更新用户资料
  async updateProfile(profile: Partial<User>): Promise<ApiResponse<User>> {
    const { data } = await this.client.put('/user', profile);
    return data;
  }

  // 修改密码
  async updatePassword(currentPassword: string, password: string): Promise<ApiResponse> {
    const { data } = await this.client.put('/user/password', {
      current_password: currentPassword,
      password,
      password_confirmation: password,
    });
    return data;
  }

  // 获取用户设置
  async getSettings(): Promise<ApiResponse<UserSettings>> {
    const { data } = await this.client.get('/user/settings');
    return data;
  }

  // 更新用户设置
  async updateSettings(settings: Partial<UserSettings>): Promise<ApiResponse<UserSettings>> {
    const { data } = await this.client.put('/user/settings', settings);
    return data;
  }

  // 注销账号
  async deactivate(password: string): Promise<ApiResponse> {
    const { data } = await this.client.post('/user/deactivate', { password });
    this.setToken(null);
    return data;
  }

  // 取消注销
  async cancelDeactivation(): Promise<ApiResponse> {
    const { data } = await this.client.post('/user/cancel-deactivation');
    return data;
  }

  // ==================== 家庭 ====================

  // 获取家庭列表
  async getFamilies(): Promise<ApiResponse<Family[]>> {
    const { data } = await this.client.get('/families');
    return data;
  }

  // 创建家庭
  async createFamily(name: string, avatar?: string): Promise<ApiResponse<Family>> {
    const { data } = await this.client.post('/families', { name, avatar });
    return data;
  }

  // 获取家庭详情
  async getFamily(id: number): Promise<ApiResponse<Family>> {
    const { data } = await this.client.get(`/families/${id}`);
    return data;
  }

  // 更新家庭
  async updateFamily(id: number, data: { name?: string; avatar?: string }): Promise<ApiResponse<Family>> {
    const { data: res } = await this.client.put(`/families/${id}`, data);
    return res;
  }

  // 删除家庭
  async deleteFamily(id: number): Promise<ApiResponse> {
    const { data } = await this.client.delete(`/families/${id}`);
    return data;
  }

  // 生成邀请码
  async generateInviteCode(familyId: number): Promise<ApiResponse<InviteCode>> {
    const { data } = await this.client.post(`/families/${familyId}/invite`);
    return data;
  }

  // 加入家庭
  async joinFamily(code: string): Promise<ApiResponse<Family>> {
    const { data } = await this.client.post('/families/join', { code });
    return data;
  }

  // 获取家庭成员
  async getFamilyMembers(familyId: number): Promise<ApiResponse<any[]>> {
    const { data } = await this.client.get(`/families/${familyId}/members`);
    return data;
  }

  // 移除成员
  async removeFamilyMember(familyId: number, userId: number): Promise<ApiResponse> {
    const { data } = await this.client.delete(`/families/${familyId}/members/${userId}`);
    return data;
  }

  // ==================== 家族 ====================

  // 获取我的家族
  async getMyClans(): Promise<ApiResponse<Clan[]>> {
    const { data } = await this.client.get('/clans');
    return data;
  }

  // 获取家族广场
  async getPublicClans(keyword?: string): Promise<ApiResponse<PaginatedResponse<Clan>>> {
    const { data } = await this.client.get('/clans/public', { params: { keyword } });
    return data;
  }

  // 创建家族
  async createClan(name: string, bio?: string, avatar?: string): Promise<ApiResponse<Clan>> {
    const { data } = await this.client.post('/clans', { name, bio, avatar });
    return data;
  }

  // 获取家族详情
  async getClan(id: number): Promise<ApiResponse<Clan>> {
    const { data } = await this.client.get(`/clans/${id}`);
    return data;
  }

  // 更新家族
  async updateClan(id: number, data: { name?: string; bio?: string; avatar?: string }): Promise<ApiResponse<Clan>> {
    const { data: res } = await this.client.put(`/clans/${id}`, data);
    return res;
  }

  // 删除家族
  async deleteClan(id: number): Promise<ApiResponse> {
    const { data } = await this.client.delete(`/clans/${id}`);
    return data;
  }

  // 申请加入家族
  async applyJoinClan(clanId: number, familyId?: number): Promise<ApiResponse> {
    const { data } = await this.client.post(`/clans/${clanId}/apply`, { family_id: familyId });
    return data;
  }

  // 获取家族中的家庭
  async getClanFamilies(clanId: number): Promise<ApiResponse<Family[]>> {
    const { data } = await this.client.get(`/clans/${clanId}/families`);
    return data;
  }

  // ==================== 笔记 ====================

  // 获取笔记列表
  async getNotes(familyId?: number, page = 1): Promise<ApiResponse<PaginatedResponse<Note>>> {
    const { data } = await this.client.get('/notes', { params: { family_id: familyId, page } });
    return data;
  }

  // 创建笔记
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
    const { data } = await this.client.post('/notes', note);
    return data;
  }

  // 获取笔记详情
  async getNote(id: number): Promise<ApiResponse<Note>> {
    const { data } = await this.client.get(`/notes/${id}`);
    return data;
  }

  // 更新笔记
  async updateNote(id: number, note: Partial<Note>): Promise<ApiResponse<Note>> {
    const { data } = await this.client.put(`/notes/${id}`, note);
    return data;
  }

  // 删除笔记
  async deleteNote(id: number): Promise<ApiResponse> {
    const { data } = await this.client.delete(`/notes/${id}`);
    return data;
  }

  // 添加评论
  async addComment(noteId: number, content: string, parentId?: number): Promise<ApiResponse<any>> {
    const { data } = await this.client.post(`/notes/${noteId}/comments`, { content, parent_id: parentId });
    return data;
  }

  // 删除评论
  async deleteComment(noteId: number, commentId: number): Promise<ApiResponse> {
    const { data } = await this.client.delete(`/notes/${noteId}/comments/${commentId}`);
    return data;
  }

  // 点赞/取消点赞
  async toggleLike(noteId: number): Promise<ApiResponse<{ is_liked: boolean }>> {
    const { data } = await this.client.post(`/notes/${noteId}/like`);
    return data;
  }

  // 收藏/取消收藏
  async toggleFavorite(noteId: number): Promise<ApiResponse<{ is_favorited: boolean }>> {
    const { data } = await this.client.post(`/notes/${noteId}/favorite`);
    return data;
  }

  // 获取照片墙
  async getPhotos(page = 1): Promise<ApiResponse<PaginatedResponse<Note>>> {
    const { data } = await this.client.get('/photos', { params: { page } });
    return data;
  }

  // 获取时光轴
  async getTimeline(): Promise<ApiResponse<Record<string, Note[]>>> {
    const { data } = await this.client.get('/timeline');
    return data;
  }

  // ==================== 通知 ====================

  // 获取通知列表
  async getNotifications(unread?: boolean, page = 1): Promise<ApiResponse<PaginatedResponse<Notification>>> {
    const { data } = await this.client.get('/notifications', { params: { unread, page } });
    return data;
  }

  // 标记通知为已读
  async markNotificationRead(id: number): Promise<ApiResponse> {
    const { data } = await this.client.put(`/notifications/${id}/read`);
    return data;
  }

  // 全部标记为已读
  async markAllNotificationsRead(): Promise<ApiResponse> {
    const { data } = await this.client.post('/notifications/read-all');
    return data;
  }
}

export const api = new ApiService();
export default api;
