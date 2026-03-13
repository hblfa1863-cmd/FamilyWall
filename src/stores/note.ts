import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/services/api';
import type { Note } from '@/types';

export const useNoteStore = defineStore('note', () => {
  // State
  const notes = ref<Note[]>([]);
  const currentNote = ref<Note | null>(null);
  const photos = ref<Note[]>([]);
  const timeline = ref<Record<string, Note[]>>({});
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref({
    currentPage: 1,
    perPage: 20,
    total: 0,
    lastPage: 1,
  });

  // Actions
  async function fetchNotes(familyId?: number, page = 1) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.getNotes(familyId, page);
      if (res.success && res.data) {
        if (page === 1) {
          notes.value = res.data.data;
        } else {
          notes.value.push(...res.data.data);
        }
        pagination.value = res.data.pagination;
      }
      return res;
    } catch (e: unknown) {
      error.value = e.response?.data?.message || '获取笔记列表失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function createNote(note: {
    title: string;
    content: string;
    family_id: number;
    visibility?: 'family' | 'clan' | 'public';
    location_name?: string;
    location_lat?: number;
    location_lng?: number;
    images?: string[];
    videos?: string[];
  }) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.createNote(note);
      if (res.success && res.data) {
        notes.value.unshift(res.data);
      }
      return res;
    } catch (e: unknown) {
      error.value = e.response?.data?.message || '创建笔记失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function fetchNote(id: number) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.getNote(id);
      if (res.success && res.data) {
        currentNote.value = res.data;
      }
      return res;
    } catch (e: unknown) {
      error.value = e.response?.data?.message || '获取笔记详情失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function updateNote(id: number, note: Partial<Note>) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.updateNote(id, note);
      if (res.success && res.data) {
        const index = notes.value.findIndex(n => n.id === id);
        if (index !== -1) {
          notes.value[index] = res.data;
        }
        if (currentNote.value?.id === id) {
          currentNote.value = res.data;
        }
      }
      return res;
    } catch (e: unknown) {
      error.value = e.response?.data?.message || '更新笔记失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function deleteNote(id: number) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.deleteNote(id);
      if (res.success) {
        notes.value = notes.value.filter(n => n.id !== id);
        if (currentNote.value?.id === id) {
          currentNote.value = null;
        }
      }
      return res;
    } catch (e: unknown) {
      error.value = e.response?.data?.message || '删除笔记失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function addComment(noteId: number, content: string, parentId?: number) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.addComment(noteId, content, parentId);
      if (res.success && currentNote.value?.id === noteId) {
        // 刷新笔记详情
        await fetchNote(noteId);
      }
      return res;
    } catch (e: unknown) {
      error.value = e.response?.data?.message || '评论失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function deleteComment(noteId: number, commentId: number) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.deleteComment(noteId, commentId);
      if (res.success && currentNote.value?.id === noteId) {
        await fetchNote(noteId);
      }
      return res;
    } catch (e: unknown) {
      error.value = e.response?.data?.message || '删除评论失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function toggleLike(noteId: number) {
    try {
      const res = await api.toggleLike(noteId);
      if (res.success) {
        // 更新本地状态
        const note = notes.value.find(n => n.id === noteId);
        if (note) {
          note.is_liked = res.data?.is_liked;
          note.like_count = (note.like_count || 0) + (res.data?.is_liked ? 1 : -1);
        }
        if (currentNote.value?.id === noteId) {
          currentNote.value.is_liked = res.data?.is_liked;
          currentNote.value.like_count = (currentNote.value.like_count || 0) + (res.data?.is_liked ? 1 : -1);
        }
      }
      return res;
    } catch (e: unknown) {
      error.value = e.response?.data?.message || '操作失败';
      throw e;
    }
  }

  async function toggleFavorite(noteId: number) {
    try {
      const res = await api.toggleFavorite(noteId);
      if (res.success) {
        const note = notes.value.find(n => n.id === noteId);
        if (note) {
          note.is_favorited = res.data?.is_favorited;
        }
        if (currentNote.value?.id === noteId) {
          currentNote.value.is_favorited = res.data?.is_favorited;
        }
      }
      return res;
    } catch (e: unknown) {
      error.value = e.response?.data?.message || '操作失败';
      throw e;
    }
  }

  async function fetchPhotos(page = 1) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.getPhotos(page);
      if (res.success && res.data) {
        if (page === 1) {
          photos.value = res.data.data;
        } else {
          photos.value.push(...res.data.data);
        }
        pagination.value = res.data.pagination;
      }
      return res;
    } catch (e: unknown) {
      error.value = e.response?.data?.message || '获取照片墙失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function fetchTimeline() {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.getTimeline();
      if (res.success && res.data) {
        timeline.value = res.data;
      }
      return res;
    } catch (e: unknown) {
      error.value = e.response?.data?.message || '获取时光轴失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  return {
    // State
    notes,
    currentNote,
    photos,
    timeline,
    loading,
    error,
    pagination,
    // Actions
    fetchNotes,
    createNote,
    fetchNote,
    updateNote,
    deleteNote,
    addComment,
    deleteComment,
    toggleLike,
    toggleFavorite,
    fetchPhotos,
    fetchTimeline,
  };
});
