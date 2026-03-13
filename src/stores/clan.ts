import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/services/api';
import type { Clan, Family } from '@/types';

export const useClanStore = defineStore('clan', () => {
  // State
  const myClans = ref<Clan[]>([]);
  const publicClans = ref<Clan[]>([]);
  const currentClan = ref<Clan | null>(null);
  const clanFamilies = ref<Family[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref({
    currentPage: 1,
    perPage: 20,
    total: 0,
    lastPage: 1,
  });

  // Actions
  async function fetchMyClans() {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.getMyClans();
      if (res.success && res.data) {
        myClans.value = res.data;
      }
      return res;
    } catch (e: unknown) {
      error.value = e.response?.data?.message || '获取我的家族失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function fetchPublicClans(keyword?: string, page = 1) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.getPublicClans(keyword);
      if (res.success && res.data) {
        if (page === 1) {
          publicClans.value = res.data.data;
        } else {
          publicClans.value.push(...res.data.data);
        }
        pagination.value = res.data.pagination;
      }
      return res;
    } catch (e: unknown) {
      error.value = e.response?.data?.message || '获取家族广场失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function createClan(name: string, bio?: string, avatar?: string) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.createClan(name, bio, avatar);
      if (res.success && res.data) {
        myClans.value.unshift(res.data);
      }
      return res;
    } catch (e: unknown) {
      error.value = e.response?.data?.message || '创建家族失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function fetchClan(id: number) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.getClan(id);
      if (res.success && res.data) {
        currentClan.value = res.data;
      }
      return res;
    } catch (e: unknown) {
      error.value = e.response?.data?.message || '获取家族详情失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function updateClan(id: number, data: { name?: string; bio?: string; avatar?: string }) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.updateClan(id, data);
      if (res.success && res.data) {
        const index = myClans.value.findIndex(c => c.id === id);
        if (index !== -1) {
          myClans.value[index] = res.data;
        }
        if (currentClan.value?.id === id) {
          currentClan.value = res.data;
        }
      }
      return res;
    } catch (e: unknown) {
      error.value = e.response?.data?.message || '更新家族失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function deleteClan(id: number) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.deleteClan(id);
      if (res.success) {
        myClans.value = myClans.value.filter(c => c.id !== id);
        if (currentClan.value?.id === id) {
          currentClan.value = null;
        }
      }
      return res;
    } catch (e: unknown) {
      error.value = e.response?.data?.message || '删除家族失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function applyJoinClan(clanId: number, familyId?: number) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.applyJoinClan(clanId, familyId);
      return res;
    } catch (e: unknown) {
      error.value = e.response?.data?.message || '申请加入失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function fetchClanFamilies(clanId: number) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.getClanFamilies(clanId);
      if (res.success && res.data) {
        clanFamilies.value = res.data;
      }
      return res;
    } catch (e: unknown) {
      error.value = e.response?.data?.message || '获取家族家庭列表失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  return {
    // State
    myClans,
    publicClans,
    currentClan,
    clanFamilies,
    loading,
    error,
    pagination,
    // Actions
    fetchMyClans,
    fetchPublicClans,
    createClan,
    fetchClan,
    updateClan,
    deleteClan,
    applyJoinClan,
    fetchClanFamilies,
  };
});
