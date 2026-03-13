<template>
  <div class="photo-wall">
    <!-- 顶部家庭切换 -->
    <div class="photo-wall__header" @click="showFamilySelector = true">
      <div class="photo-wall__family-info">
        <FwAvatar :src="currentFamily.avatar" :name="currentFamily.name" size="md" />
        <span class="photo-wall__family-name">{{ currentFamily.name }}</span>
        <span class="photo-wall__arrow">▼</span>
      </div>
      <div class="photo-wall__actions">
        <button class="photo-wall__action-btn">➕ 创建笔记</button>
      </div>
    </div>

    <!-- 筛选标签 -->
    <div class="photo-wall__filters">
      <span :class="['photo-wall__filter', { 'photo-wall__filter--active': filter === 'all' }]" @click="handleFilterChange('all')">
        全部
      </span>
      <span :class="['photo-wall__filter', { 'photo-wall__filter--active': filter === 'mine' }]" @click="handleFilterChange('mine')">
        我的
      </span>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="photo-wall__error">
      {{ error }}
    </div>

    <!-- 瀑布流照片墙 -->
    <div class="photo-wall__grid">
      <div 
        v-for="(note, index) in notes" 
        :key="note.id"
        class="photo-wall__item"
        @click="goToNoteDetail(note.id)"
      >
        <img :src="note.cover" :alt="note.title" class="photo-wall__image" loading="lazy" />
        <div class="photo-wall__overlay">
          <span class="photo-wall__title">{{ note.title }}</span>
          <div class="photo-wall__meta">
            <FwAvatar :src="note.author.avatar" :name="note.author.nickname" size="xs" />
            <span>{{ note.author.nickname }}</span>
          </div>
        </div>
        <div v-if="note.imagesCount > 1" class="photo-wall__count">
          {{ note.imagesCount }}
        </div>
      </div>
    </div>

    <!-- 加载更多 -->
    <div v-if="loading" class="photo-wall__loading">
      <span>加载中...</span>
    </div>
    <div v-else-if="notes.length === 0" class="photo-wall__empty">
      <span class="photo-wall__empty-icon">📷</span>
      <p>还没有任何回忆</p>
      <p>点击下方按钮创建第一个</p>
    </div>

    <!-- 家庭选择器弹窗 -->
    <Teleport to="body">
      <Transition name="slide-up">
        <div v-if="showFamilySelector" class="family-selector-mask" @click="showFamilySelector = false">
          <div class="family-selector" @click.stop>
            <div class="family-selector__handle"></div>
            <div class="family-selector__title">选择家庭</div>
            
            <div class="family-selector__section">
              <div class="family-selector__section-title">我的家庭</div>
              <div 
                v-for="family in myFamilies" 
                :key="family.id"
                :class="['family-selector__item', { 'family-selector__item--active': family.id === currentFamily.id }]"
                @click="selectFamily(family)"
              >
                <FwAvatar :src="family.avatar" :name="family.name" size="md" />
                <div class="family-selector__item-info">
                  <span class="family-selector__item-name">{{ family.name }}</span>
                  <span class="family-selector__item-meta">{{ family.memberCount }}个成员 · {{ family.noteCount }}篇笔记</span>
                </div>
                <span v-if="family.id === currentFamily.id" class="family-selector__check">✓</span>
              </div>
            </div>

            <div class="family-selector__section">
              <div class="family-selector__section-title">我的家族</div>
              <div 
                v-for="clan in myClans" 
                :key="clan.id"
                class="family-selector__item"
                @click="selectClan(clan)"
              >
                <FwAvatar :src="clan.avatar" :name="clan.name" size="md" />
                <div class="family-selector__item-info">
                  <span class="family-selector__item-name">{{ clan.name }}</span>
                  <span class="family-selector__item-meta">{{ clan.familyCount }}个家庭 · {{ clan.noteCount }}篇笔记</span>
                </div>
              </div>
            </div>

            <div class="family-selector__actions">
              <FwButton type="secondary" size="md" @click="showFamilySelector = false; router.push('/families/new')">
                ＋ 创建家庭
              </FwButton>
              <FwButton type="secondary" size="md" @click="showFamilySelector = false; router.push('/families/join')">
                ＋ 加入家庭
              </FwButton>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { FwButton, FwAvatar } from '@/components';
import api from '@/services/api';
import type { Family, Clan, Note } from '@/types';

const router = useRouter();

const showFamilySelector = ref(false);
const filter = ref<'all' | 'mine'>('all');
const loading = ref(false);
const error = ref('');

// 类型定义
interface SimpleFamily {
  id: number;
  name: string;
  avatar?: string;
  memberCount?: number;
  noteCount?: number;
}

interface SimpleClan {
  id: number;
  name: string;
  avatar?: string;
  familyCount?: number;
  noteCount?: number;
}

interface SimpleNote {
  id: number;
  title: string;
  cover?: string;
  imagesCount?: number;
  author: {
    nickname: string;
    avatar?: string;
  };
}

const currentFamily = reactive<SimpleFamily>({
  id: 0,
  name: '请选择家庭',
  avatar: '',
});

const myFamilies = ref<SimpleFamily[]>([]);
const myClans = ref<SimpleClan[]>([]);
const notes = ref<SimpleNote[]>([]);

// 获取家庭列表
const fetchFamilies = async () => {
  try {
    const res = await api.getFamilies();
    if (res.success && res.data) {
      myFamilies.value = res.data.map((f: Family) => ({
        id: f.id,
        name: f.name,
        avatar: f.avatar,
        memberCount: f.member_count,
        noteCount: f.note_count,
      }));
      // 设置第一个家庭为当前
      if (myFamilies.value.length > 0 && currentFamily.id === 0) {
        selectFamily(myFamilies.value[0]);
      }
    }
  } catch (e: any) {
    error.value = '获取家庭列表失败';
    console.error(e);
  }
};

// 获取笔记列表
const fetchNotes = async () => {
  loading.value = true;
  error.value = '';
  try {
    const res = await api.getPhotos();
    if (res.success && res.data) {
      notes.value = res.data.map((note: Note) => ({
        id: note.id,
        title: note.title,
        cover: note.cover || note.media?.[0]?.url,
        imagesCount: note.media?.filter(m => m.type === 'image').length || 1,
        author: {
          nickname: note.user?.nickname || '未知',
          avatar: note.user?.avatar,
        },
      }));
    }
  } catch (e: any) {
    error.value = '获取笔记失败';
    console.error(e);
  } finally {
    loading.value = false;
  }
};

// 初始化
onMounted(async () => {
  await fetchFamilies();
  await fetchNotes();
});

const selectFamily = (family: SimpleFamily) => {
  currentFamily.id = family.id;
  currentFamily.name = family.name;
  currentFamily.avatar = family.avatar || '';
  showFamilySelector.value = false;
  // 切换家庭后重新获取笔记
  fetchNotes();
};

const selectClan = (clan: SimpleClan) => {
  showFamilySelector.value = false;
};

const goToNoteDetail = (id: number) => {
  router.push(`/notes/${id}`);
};

// 筛选
const handleFilterChange = (newFilter: 'all' | 'mine') => {
  filter.value = newFilter;
  fetchNotes();
};
</script>

<style scoped>
.photo-wall {
  min-height: 100vh;
  background: var(--color-background);
  padding-bottom: calc(var(--tabbar-height) + var(--spacing-md));
}

/* 头部 */
.photo-wall__header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-surface);
  padding: var(--spacing-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow-sm);
}

.photo-wall__family-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
}

.photo-wall__family-name {
  font-size: var(--font-size-h5);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.photo-wall__arrow {
  font-size: 10px;
  color: var(--color-text-tertiary);
}

.photo-wall__action-btn {
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  padding: var(--spacing-xs) var(--spacing-md);
  font-size: var(--font-size-body-sm);
  cursor: pointer;
}

/* 筛选 */
.photo-wall__filters {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-surface);
}

.photo-wall__filter {
  font-size: var(--font-size-body-sm);
  color: var(--color-text-tertiary);
  cursor: pointer;
  padding: var(--spacing-xs) var(--spacing-sm);
  position: relative;
}

.photo-wall__filter--active {
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}

.photo-wall__filter--active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-primary);
  border-radius: 1px;
}

/* 瀑布流 */
.photo-wall__grid {
  column-count: 2;
  column-gap: var(--spacing-sm);
  padding: var(--spacing-sm);
}

@media (min-width: 768px) {
  .photo-wall__grid {
    column-count: 3;
    column-gap: var(--spacing-md);
    padding: var(--spacing-md);
  }
}

@media (min-width: 1024px) {
  .photo-wall__grid {
    column-count: 4;
  }
}

.photo-wall__item {
  break-inside: avoid;
  margin-bottom: var(--spacing-sm);
  border-radius: var(--radius-lg);
  overflow: hidden;
  position: relative;
  cursor: pointer;
}

.photo-wall__image {
  width: 100%;
  display: block;
  transition: transform var(--transition-normal);
}

.photo-wall__item:hover .photo-wall__image {
  transform: scale(1.05);
}

.photo-wall__overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
  padding: 40px var(--spacing-sm) var(--spacing-sm);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.photo-wall__item:hover .photo-wall__overlay {
  opacity: 1;
}

.photo-wall__title {
  color: white;
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-medium);
  display: block;
  margin-bottom: var(--spacing-xs);
}

.photo-wall__meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: rgba(255, 255, 255, 0.8);
  font-size: var(--font-size-tiny);
}

.photo-wall__count {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-tiny);
}

/* 空状态 */
.photo-wall__empty {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-text-tertiary);
}

.photo-wall__empty-icon {
  font-size: 64px;
  display: block;
  margin-bottom: var(--spacing-md);
}

.photo-wall__loading {
  text-align: center;
  padding: var(--spacing-lg);
  color: var(--color-text-tertiary);
}

/* 家庭选择器 */
.family-selector-mask {
  position: fixed;
  inset: 0;
  background: var(--color-mask);
  z-index: 2000;
}

.family-selector {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--color-surface);
  border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
  max-height: 80vh;
  overflow-y: auto;
  padding: var(--spacing-md) var(--spacing-lg) calc(var(--spacing-lg) + env(safe-area-inset-bottom));
}

.family-selector__handle {
  width: 36px;
  height: 4px;
  background: var(--color-border);
  border-radius: 2px;
  margin: 0 auto var(--spacing-md);
}

.family-selector__title {
  font-size: var(--font-size-h4);
  font-weight: var(--font-weight-semibold);
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.family-selector__section {
  margin-bottom: var(--spacing-lg);
}

.family-selector__section-title {
  font-size: var(--font-size-body-sm);
  color: var(--color-text-tertiary);
  margin-bottom: var(--spacing-sm);
}

.family-selector__item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  cursor: pointer;
}

.family-selector__item:hover {
  background: var(--color-background);
}

.family-selector__item--active {
  background: var(--color-success-light);
}

.family-selector__item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.family-selector__item-name {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
}

.family-selector__item-meta {
  font-size: var(--font-size-caption);
  color: var(--color-text-tertiary);
}

.family-selector__check {
  color: var(--color-primary);
  font-weight: var(--font-weight-bold);
}

.family-selector__actions {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.family-selector__actions .fw-button {
  flex: 1;
}

/* 动画 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity var(--transition-normal);
}

.slide-up-enter-active .family-selector,
.slide-up-leave-active .family-selector {
  transition: transform var(--transition-normal);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
}

.slide-up-enter-from .family-selector,
.slide-up-leave-to .family-selector {
  transform: translateY(100%);
}
</style>
