<template>
  <div class="families-page">
    <!-- 头部 -->
    <div class="families-page__header">
      <h1>我的家庭</h1>
    </div>

    <!-- 搜索 -->
    <div class="families-page__search">
      <input v-model="searchKeyword" placeholder="搜索家庭" />
    </div>

    <!-- 家庭列表 -->
    <div class="families-page__list">
      <div 
        v-for="family in filteredFamilies" 
        :key="family.id"
        class="families-page__item"
        @click="router.push(`/families/${family.id}`)"
      >
        <FwAvatar :src="family.avatar" :name="family.name" size="lg" />
        <div class="families-page__item-info">
          <span class="families-page__item-name">{{ family.name }}</span>
          <span class="families-page__item-meta">{{ family.memberCount }}个成员 · {{ family.noteCount }}篇笔记</span>
        </div>
        <span class="families-page__item-arrow">›</span>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredFamilies.length === 0" class="families-page__empty">
      <span>🏠</span>
      <p>还没有加入任何家庭</p>
    </div>

    <!-- 底部按钮 -->
    <div class="families-page__actions">
      <button @click="router.push('/families/new')">＋ 创建家庭</button>
      <button @click="router.push('/families/join')">＋ 加入家庭</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { FwAvatar } from '@/components';

const router = useRouter();
const searchKeyword = ref('');

const families = ref([
  { id: 1, name: '张三的家庭', avatar: '', memberCount: 5, noteCount: 23 },
  { id: 2, name: '李四的家庭', avatar: '', memberCount: 3, noteCount: 10 },
]);

const filteredFamilies = computed(() => {
  if (!searchKeyword.value) return families.value;
  return families.value.filter(f => f.name.includes(searchKeyword.value));
});
</script>

<style scoped>
.families-page {
  min-height: 100vh;
  background: var(--color-background);
  padding: var(--spacing-md);
  padding-bottom: 100px;
}

.families-page__header h1 {
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-md);
}

.families-page__search input {
  width: 100%;
  height: 44px;
  border: none;
  border-radius: var(--radius-xl);
  padding: 0 var(--spacing-md);
  background: var(--color-surface);
  margin-bottom: var(--spacing-md);
}

.families-page__item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  margin-bottom: var(--spacing-sm);
  cursor: pointer;
}

.families-page__item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.families-page__item-name {
  font-weight: var(--font-weight-semibold);
}

.families-page__item-meta {
  font-size: var(--font-size-caption);
  color: var(--color-text-tertiary);
}

.families-page__item-arrow {
  font-size: 20px;
  color: var(--color-text-tertiary);
}

.families-page__empty {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-text-tertiary);
}

.families-page__empty span {
  font-size: 64px;
  display: block;
  margin-bottom: var(--spacing-md);
}

.families-page__actions {
  position: fixed;
  bottom: var(--spacing-lg);
  left: 0;
  right: 0;
  display: flex;
  gap: var(--spacing-md);
  padding: 0 var(--spacing-md);
}

.families-page__actions button {
  flex: 1;
  height: 48px;
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-xl);
  background: var(--color-surface);
  color: var(--color-primary);
  font-size: var(--font-size-body);
  cursor: pointer;
}
</style>
