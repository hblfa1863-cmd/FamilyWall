<template>
  <div class="clan-detail">
    <div class="clan-detail__header">
      <button @click="router.back()">←</button>
      <div v-if="isAdmin" @click="router.push(`/clans/${clan.id}/manage`)">管理</div>
    </div>

    <div class="clan-detail__info">
      <FwAvatar :src="clan.avatar" :name="clan.name" size="xl" />
      <h1>{{ clan.name }}</h1>
      <p>{{ clan.bio || '暂无简介' }}</p>
      <div class="clan-detail__stats">
        <span>{{ clan.familyCount }} 个家庭</span>
        <span>·</span>
        <span>{{ clan.noteCount }} 篇笔记</span>
      </div>
    </div>

    <div class="clan-detail__tabs">
      <span :class="{ active: activeTab === 'photos' }" @click="activeTab = 'photos'">照片墙</span>
      <span :class="{ active: activeTab === 'families' }" @click="activeTab = 'families'">成员家庭</span>
    </div>

    <div class="clan-detail__content">
      <div v-if="activeTab === 'photos'" class="clan-detail__photos">
        <div class="clan-detail__grid">
          <div v-for="note in notes" :key="note.id" @click="router.push(`/notes/${note.id}`)">
            <img :src="note.cover" />
          </div>
        </div>
      </div>
      <div v-else class="clan-detail__families">
        <div v-for="family in families" :key="family.id" class="clan-detail__family-item">
          <FwAvatar :src="family.avatar" :name="family.name" size="md" />
          <div>
            <span class="name">{{ family.name }}</span>
            <span class="meta">{{ family.memberCount }}个成员</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { FwAvatar } from '@/components';
import api from '@/services/api';

const router = useRouter();
const route = useRoute();
const activeTab = ref('photos');
const loading = ref(false);

const clanId = Number(route.params.id);
const clan = ref<any>(null);
const notes = ref<any[]>([]);
const families = ref<any[]>([]);
const isAdmin = ref(false);

// 获取家族详情
const fetchClan = async () => {
  loading.value = true;
  try {
    const res = await api.getClan(clanId);
    if (res.success && res.data) {
      clan.value = res.data;
    }
  } catch (e) {
    console.error('获取家族失败', e);
  } finally {
    loading.value = false;
  }
};

// 获取家族笔记
const fetchNotes = async () => {
  try {
    const res = await api.getNotes(undefined, 1);
    if (res.success && res.data) {
      notes.value = res.data.data.map((note: unknown) => ({
        id: note.id,
        cover: note.cover || note.media?.[0]?.url,
      }));
    }
  } catch (e) {
    console.error('获取笔记失败', e);
  }
};

// 获取成员家庭
const fetchFamilies = async () => {
  try {
    const res = await api.getClanFamilies(clanId);
    if (res.success && res.data) {
      families.value = res.data.map((f: unknown) => ({
        id: f.id,
        name: f.name,
        avatar: f.avatar,
        memberCount: f.member_count || 0,
      }));
    }
  } catch (e) {
    console.error('获取家庭失败', e);
  }
};

onMounted(() => {
  fetchClan();
  fetchNotes();
  fetchFamilies();
});
</script>

<style scoped>
.clan-detail { min-height: 100vh; background: var(--color-background); padding-bottom: 80px; }
.clan-detail__header { display: flex; justify-content: space-between; padding: var(--spacing-md); background: var(--color-surface); }
.clan-detail__header button { width: 36px; height: 36px; border-radius: var(--radius-full); border: none; background: var(--color-background); font-size: 18px; cursor: pointer; }
.clan-detail__info { text-align: center; padding: var(--spacing-xl); background: var(--color-surface); }
.clan-detail__info h1 { font-size: var(--font-size-h2); font-weight: var(--font-weight-bold); margin: var(--spacing-md) 0 var(--spacing-xs); }
.clan-detail__info p { color: var(--color-text-tertiary); font-size: var(--font-size-body-sm); margin-bottom: var(--spacing-md); }
.clan-detail__stats { display: flex; justify-content: center; gap: var(--spacing-sm); color: var(--color-text-tertiary); font-size: var(--font-size-body-sm); }
.clan-detail__tabs { display: flex; background: var(--color-surface); border-bottom: 1px solid var(--color-border); }
.clan-detail__tabs span { flex: 1; text-align: center; padding: var(--spacing-md); font-size: var(--font-size-body); color: var(--color-text-tertiary); cursor: pointer; position: relative; }
.clan-detail__tabs span.active { color: var(--color-primary); font-weight: var(--font-weight-medium); }
.clan-detail__tabs span.active::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--color-primary); }
.clan-detail__content { padding: var(--spacing-md); }
.clan-detail__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; }
.clan-detail__grid img { width: 100%; aspect-ratio: 1; object-fit: cover; cursor: pointer; }
.clan-detail__family-item { display: flex; align-items: center; gap: var(--spacing-md); padding: var(--spacing-md); background: var(--color-surface); border-radius: var(--radius-lg); margin-bottom: var(--spacing-sm); }
.clan-detail__family-item .name { font-weight: var(--font-weight-medium); display: block; }
.clan-detail__family-item .meta { font-size: var(--font-size-caption); color: var(--color-text-tertiary); }
</style>
