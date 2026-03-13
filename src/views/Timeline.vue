<template>
  <div class="timeline">
    <!-- 头部 -->
    <div class="timeline__header">
      <h2 class="timeline__title">时光轴</h2>
    </div>

    <!-- 时间线内容 -->
    <div class="timeline__content">
      <div v-for="(yearGroup, year) in groupedNotes" :key="year" class="timeline__year">
        <div class="timeline__year-label">{{ year }}年</div>
        
        <div v-for="(monthGroup, month) in yearGroup" :key="month" class="timeline__month">
          <div class="timeline__month-label">{{ month }}月</div>
          
          <div class="timeline__items">
            <div 
              v-for="note in monthGroup" 
              :key="note.id" 
              class="timeline__item"
              @click="goToNote(note.id)"
            >
              <!-- 时间节点 -->
              <div class="timeline__node">
                <span class="timeline__node-dot"></span>
                <span class="timeline__node-date">{{ note.day }}日</span>
              </div>
              
              <!-- 连接线 -->
              <div class="timeline__line"></div>
              
              <!-- 内容卡片 -->
              <div class="timeline__card">
                <div class="timeline__card-images" v-if="note.images && note.images.length > 0">
                  <img 
                    v-for="(img, idx) in note.images.slice(0, 4)" 
                    :key="idx"
                    :src="img.url" 
                    class="timeline__card-image"
                  />
                  <div v-if="note.images.length > 4" class="timeline__card-more">
                    +{{ note.images.length - 4 }}
                  </div>
                </div>
                
                <h3 class="timeline__card-title">{{ note.title }}</h3>
                
                <div class="timeline__card-meta">
                  <FwAvatar :src="note.author.avatar" :name="note.author.nickname" size="xs" />
                  <span>{{ note.author.nickname }}</span>
                  <span class="timeline__card-divider">·</span>
                  <span>{{ note.location?.name || '' }}</span>
                </div>
                
                <div class="timeline__card-stats">
                  <span>❤️ {{ note.likesCount }}</span>
                  <span>💬 {{ note.commentsCount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-if="Object.keys(groupedNotes).length === 0" class="timeline__empty">
        <span class="timeline__empty-icon">📅</span>
        <p>还没有任何回忆</p>
        <p>点击下方按钮创建第一个</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { FwAvatar } from '@/components';

interface Note {
  id: number;
  title: string;
  content: string;
  day: number;
  images: { url: string }[];
  author: { nickname: string; avatar: string };
  location?: { name: string };
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

const props = defineProps<{
  notes: Note[];
}>();

const router = useRouter();

// 按年份和月份分组
const groupedNotes = computed(() => {
  const groups: Record<string, Record<string, Note[]>> = {};
  
  props.notes.forEach(note => {
    const date = new Date(note.createdAt);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString();
    
    if (!groups[year]) {
      groups[year] = {};
    }
    if (!groups[year][month]) {
      groups[year][month] = [];
    }
    
    note.day = date.getDate();
    groups[year][month].push(note);
  });
  
  // 按年份降序
  const sortedGroups: Record<string, Record<string, Note[]>> = {};
  Object.keys(groups).sort((a, b) => Number(b) - Number(a)).forEach(year => {
    sortedGroups[year] = groups[year];
  });
  
  return sortedGroups;
});

const goToNote = (id: number) => {
  router.push(`/notes/${id}`);
};
</script>

<style scoped>
.timeline {
  min-height: 100vh;
  background: var(--color-background);
  padding-bottom: calc(var(--tabbar-height) + var(--spacing-lg));
}

.timeline__header {
  background: var(--color-surface);
  padding: var(--spacing-md);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-sm);
}

.timeline__title {
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  text-align: center;
}

.timeline__content {
  padding: var(--spacing-lg);
}

.timeline__year {
  margin-bottom: var(--spacing-xl);
}

.timeline__year-label {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin-bottom: var(--spacing-lg);
  padding-left: var(--spacing-md);
}

.timeline__month {
  margin-bottom: var(--spacing-lg);
}

.timeline__month-label {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
  padding-left: 60px;
}

.timeline__items {
  display: flex;
  flex-direction: column;
}

.timeline__item {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  cursor: pointer;
}

/* 时间节点 */
.timeline__node {
  width: 50px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timeline__node-dot {
  width: 12px;
  height: 12px;
  background: var(--color-primary);
  border-radius: var(--radius-full);
  border: 3px solid var(--color-surface);
  box-shadow: 0 0 0 2px var(--color-primary);
  z-index: 1;
}

.timeline__node-date {
  font-size: var(--font-size-tiny);
  color: var(--color-text-tertiary);
  margin-top: var(--spacing-xs);
}

/* 连接线 */
.timeline__line {
  width: 2px;
  background: var(--color-border);
  flex-shrink: 0;
  margin-left: 5px;
}

/* 卡片 */
.timeline__card {
  flex: 1;
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
}

.timeline__item:hover .timeline__card {
  box-shadow: var(--shadow-lg);
  transform: translateX(4px);
}

.timeline__card-images {
  display: flex;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-sm);
}

.timeline__card-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--radius-md);
}

.timeline__card-more {
  width: 60px;
  height: 60px;
  background: var(--color-background);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-body-sm);
  color: var(--color-text-tertiary);
}

.timeline__card-title {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.timeline__card-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-caption);
  color: var(--color-text-tertiary);
  margin-bottom: var(--spacing-xs);
}

.timeline__card-divider {
  color: var(--color-border);
}

.timeline__card-stats {
  display: flex;
  gap: var(--spacing-md);
  font-size: var(--font-size-tiny);
  color: var(--color-text-tertiary);
}

/* 空状态 */
.timeline__empty {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-text-tertiary);
}

.timeline__empty-icon {
  font-size: 64px;
  display: block;
  margin-bottom: var(--spacing-md);
}
</style>
