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
import { ref } from 'vue';
import { FwAvatar } from '@/components';

const router = useRouter();
const route = useRoute();
const activeTab = ref('photos');
const isAdmin = ref(false);

const clan = ref({ id: 1, name: '王氏家族', avatar: '', bio: '', familyCount: 3, noteCount: 89 });
const notes = ref([{ id: 1, cover: 'https://picsum.photos/300/400?r=1' }, { id: 2, cover: 'https://picsum.photos/300/300?r=2' }]);
const families = ref([{ id: 1, name: '张三的家庭', avatar: '', memberCount: 5 }]);
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
