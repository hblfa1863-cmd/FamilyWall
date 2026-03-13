import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/services/api';
import type { User, AuthResponse } from '@/types';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const token = ref<string | null>(api.getToken());
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const isLoggedIn = computed(() => !!token.value && !!user.value);
  const isAdmin = computed(() => false); // 根据用户角色判断

  // Actions
  async function sendVerifyCode(email: string, type: 'register' | 'login' | 'reset_password') {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.sendVerifyCode(email, type);
      if (!res.success) {
        error.value = res.message || '发送失败';
        return res;
      }
      return res;
    } catch (e: unknown) {
      error.value = e.response?.data?.message || '网络错误';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function register(email: string, password: string, code: string, nickname: string) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.register(email, password, code, nickname);
      if (res.success && res.data) {
        token.value = res.data.token;
        user.value = res.data.user;
      } else {
        error.value = res.message || '注册失败';
      }
      return res;
    } catch (e: unknown) {
      error.value = e.response?.data?.message || '网络错误';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function login(email: string, password?: string, code?: string) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.login(email, password, code);
      if (res.success && res.data) {
        token.value = res.data.token;
        user.value = res.data.user;
      } else {
        error.value = res.message || '登录失败';
      }
      return res;
    } catch (e: unknown) {
      error.value = e.response?.data?.message || '网络错误';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    loading.value = true;
    try {
      await api.logout();
    } finally {
      user.value = null;
      token.value = null;
      loading.value = false;
    }
  }

  async function fetchProfile() {
    if (!token.value) return;
    
    loading.value = true;
    error.value = null;
    try {
      const res = await api.getProfile();
      if (res.success && res.data) {
        user.value = res.data;
      }
      return res;
    } catch (e: unknown) {
      if (e.response?.status === 401) {
        user.value = null;
        token.value = null;
      }
      error.value = e.response?.data?.message || '获取用户信息失败';
    } finally {
      loading.value = false;
    }
  }

  async function updateProfile(profile: Partial<User>) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.updateProfile(profile);
      if (res.success && res.data) {
        user.value = res.data;
      }
      return res;
    } catch (e: unknown) {
      error.value = e.response?.data?.message || '更新失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function updatePassword(currentPassword: string, password: string) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.updatePassword(currentPassword, password);
      return res;
    } catch (e: unknown) {
      error.value = e.response?.data?.message || '修改密码失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  // 初始化 - 恢复登录状态
  async function init() {
    if (token.value) {
      await fetchProfile();
    }
  }

  return {
    // State
    user,
    token,
    loading,
    error,
    // Getters
    isLoggedIn,
    isAdmin,
    // Actions
    sendVerifyCode,
    register,
    login,
    logout,
    fetchProfile,
    updateProfile,
    updatePassword,
    init,
  };
});
