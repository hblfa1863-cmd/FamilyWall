<template>
  <div class="clans-page">
    <!-- 头部 -->
    <div class="clans-page__header">
      <h1>我的家族</h1>
    </div>

    <!-- 家族列表 -->
    <div class="clans-page__list">
      <div 
        v-for="clan in clans" 
        :key="clan.id"
        class="clans-page__item"
        @click="router.push(`/clans/${clan.id}`)"
      >
        <FwAvatar :src="clan.avatar" :name="clan.name" size="lg" />
        <div class="clans-page__item-info">
          <span class="clans-page__item-name">{{ clan.name }}</span>
          <span class="clans-page__item-meta">{{ clan.familyCount }}个家庭 · {{ clan.noteCount }}篇笔记</span>
        </div>
        <span class="clans-page__item-arrow">›</span>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="clans.length === 0" class="clans-page__empty">
      <span>🏛️</span>
      <p>还没有加入任何家族</p>
      <button @click="router.push('/clans/new')">创建家族</button>
    </div>

    <!-- 底部按钮 -->
    <button v-if="clans.length > 0" class="clans-page__create" @click="router.push('/clans/new')">
      ＋ 创建家族
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FwAvatar } from '@/components';

const router = useRouter();

const clans = ref([
  { id: 1, name: '王氏家族', avatar: '', familyCount: 3, noteCount: 89 },
]);
</script>

<style scoped>
.clans-page {
  min-height: 100vh;
  background: var(--color-background);
  padding: var(--spacing-md);
  padding-bottom: 100px;
}

.clans-page__header h1 {
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-md);
}

.clans-page__item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  margin-bottom: var(--spacing-sm);
  cursor: pointer;
}

.clans-page__item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.clans-page__item-name {
  font-weight: var(--font-weight-semibold);
}

.clans-page__item-meta {
  font-size: var(--font-size-caption);
  color: var(--color-text-tertiary);
}

.clans-page__item-arrow {
  font-size: 20px;
  color: var(--color-text-tertiary);
}

.clans-page__empty {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-text-tertiary);
}

.clans-page__empty span {
  font-size: 64px;
  display: block;
  margin-bottom: var(--spacing-md);
}

.clans-page__empty button {
  margin-top: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
}

.clans-page__create {
  position: fixed;
  bottom: var(--spacing-lg);
  left: 50%;
  transform: translateX(-50%);
  padding: var(--spacing-md) var(--spacing-xl);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  font-size: var(--font-size-body);
  cursor: pointer;
  box-shadow: var(--shadow-lg);
}
</style>
