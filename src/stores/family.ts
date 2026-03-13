import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/services/api';
import type { Family, FamilyMember, InviteCode } from '@/types';

export const useFamilyStore = defineStore('family', () => {
  // State
  const families = ref<Family[]>([]);
  const currentFamily = ref<Family | null>(null);
  const members = ref<FamilyMember[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const currentFamilyId = computed(() => currentFamily.value?.id);

  // Actions
  async function fetchFamilies() {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.getFamilies();
      if (res.success && res.data) {
        families.value = res.data;
      }
      return res;
    } catch (e: any) {
      error.value = e.response?.data?.message || '获取家庭列表失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function createFamily(name: string, avatar?: string) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.createFamily(name, avatar);
      if (res.success && res.data) {
        families.value.unshift(res.data);
      }
      return res;
    } catch (e: any) {
      error.value = e.response?.data?.message || '创建家庭失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function fetchFamily(id: number) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.getFamily(id);
      if (res.success && res.data) {
        currentFamily.value = res.data;
      }
      return res;
    } catch (e: any) {
      error.value = e.response?.data?.message || '获取家庭详情失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function updateFamily(id: number, data: { name?: string; avatar?: string }) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.updateFamily(id, data);
      if (res.success && res.data) {
        const index = families.value.findIndex(f => f.id === id);
        if (index !== -1) {
          families.value[index] = res.data;
        }
        if (currentFamily.value?.id === id) {
          currentFamily.value = res.data;
        }
      }
      return res;
    } catch (e: any) {
      error.value = e.response?.data?.message || '更新家庭失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function deleteFamily(id: number) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.deleteFamily(id);
      if (res.success) {
        families.value = families.value.filter(f => f.id !== id);
        if (currentFamily.value?.id === id) {
          currentFamily.value = null;
        }
      }
      return res;
    } catch (e: any) {
      error.value = e.response?.data?.message || '删除家庭失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function generateInviteCode(familyId: number) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.generateInviteCode(familyId);
      return res;
    } catch (e: any) {
      error.value = e.response?.data?.message || '生成邀请码失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function joinFamily(code: string) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.joinFamily(code);
      if (res.success && res.data) {
        await fetchFamilies(); // 刷新列表
      }
      return res;
    } catch (e: any) {
      error.value = e.response?.data?.message || '加入家庭失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function fetchMembers(familyId: number) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.getFamilyMembers(familyId);
      if (res.success && res.data) {
        members.value = res.data;
      }
      return res;
    } catch (e: any) {
      error.value = e.response?.data?.message || '获取成员列表失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function removeMember(familyId: number, userId: number) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.removeFamilyMember(familyId, userId);
      if (res.success) {
        members.value = members.value.filter(m => m.user_id !== userId);
      }
      return res;
    } catch (e: any) {
      error.value = e.response?.data?.message || '移除成员失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  return {
    // State
    families,
    currentFamily,
    members,
    loading,
    error,
    // Getters
    currentFamilyId,
    // Actions
    fetchFamilies,
    createFamily,
    fetchFamily,
    updateFamily,
    deleteFamily,
    generateInviteCode,
    joinFamily,
    fetchMembers,
    removeMember,
  };
});
