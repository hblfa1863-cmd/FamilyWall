<template>
  <div :class="['note-card', { 'note-card--compact': compact }]" @click="goToDetail">
    <!-- 图片轮播 -->
    <div class="note-card__images" v-if="note.images && note.images.length > 0">
      <div class="note-card__image-wrapper">
        <img 
          :src="note.images[0].url" 
          :alt="note.title" 
          class="note-card__image"
          :class="{ 'note-card__image--multiple': note.images.length > 1 }"
        />
        <div v-if="note.images.length > 1" class="note-card__image-count">
          {{ note.images.length }}
        </div>
      </div>
    </div>

    <!-- 视频标记 -->
    <div v-if="note.videos && note.videos.length > 0" class="note-card__video-badge">
      <span>🎬</span>
    </div>

    <!-- 内容 -->
    <div class="note-card__content">
      <!-- 标题 -->
      <h3 class="note-card__title">{{ note.title }}</h3>

      <!-- 摘要 -->
      <p v-if="!compact && note.content" class="note-card__excerpt">
        {{ note.content }}
      </p>

      <!-- 位置 -->
      <div v-if="note.location" class="note-card__location">
        <span class="note-card__location-icon">📍</span>
        <span class="note-card__location-name">{{ note.location.name }}</span>
      </div>

      <!-- 底部信息 -->
      <div class="note-card__footer">
        <div class="note-card__author">
          <FwAvatar :src="note.author.avatar" :name="note.author.nickname" size="xs" />
          <span class="note-card__author-name">{{ note.author.nickname }}</span>
        </div>

        <div class="note-card__stats">
          <span v-if="note.likesCount > 0" class="note-card__stat">
            ❤️ {{ note.likesCount }}
          </span>
          <span v-if="note.commentsCount > 0" class="note-card__stat">
            💬 {{ note.commentsCount }}
          </span>
          <span class="note-card__time">{{ formatTime(note.createdAt) }}</span>
        </div>
      </div>

      <!-- 可见性标签 -->
      <div class="note-card__visibility">
        <FwTag v-if="note.visibility === 'clan'" type="clan" size="sm">家族可见</FwTag>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FwAvatar, FwTag } from '@/components';

interface NoteImage {
  id: number;
  url: string;
}

interface NoteVideo {
  id: number;
  url: string;
  cover: string;
}

interface Author {
  id: number;
  nickname: string;
  avatar: string;
}

interface Location {
  id: number;
  name: string;
  address: string;
}

interface Note {
  id: number;
  title: string;
  content: string;
  images: NoteImage[];
  videos: NoteVideo[];
  author: Author;
  location?: Location;
  visibility: 'family' | 'clan';
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

interface Props {
  note: Note;
  compact?: boolean;
}

withDefaults(defineProps<Props>(), {
  compact: false,
});

const router = useRouter();

const goToDetail = () => {
  router.push(`/notes/${props.note.id}`);
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
};
</script>

<style scoped>
.note-card {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);
}

.note-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

/* 图片 */
.note-card__images {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.note-card__image-wrapper {
  position: relative;
}

.note-card__image {
  width: 100%;
  height: auto;
  display: block;
}

.note-card__image--multiple {
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.note-card__image-count {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-tiny);
}

/* 视频标记 */
.note-card__video-badge {
  position: absolute;
  top: var(--spacing-sm);
  left: var(--spacing-sm);
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

/* 内容 */
.note-card__content {
  padding: var(--spacing-md);
}

.note-card__title {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.note-card__excerpt {
  font-size: var(--font-size-body-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 位置 */
.note-card__location {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-caption);
  color: var(--color-text-tertiary);
  margin-bottom: var(--spacing-sm);
}

.note-card__location-icon {
  font-size: 12px;
}

.note-card__location-name {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 底部 */
.note-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.note-card__author {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.note-card__author-name {
  font-size: var(--font-size-caption);
  color: var(--color-text-secondary);
}

.note-card__stats {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.note-card__stat {
  font-size: var(--font-size-tiny);
  color: var(--color-text-tertiary);
}

.note-card__time {
  font-size: var(--font-size-tiny);
  color: var(--color-text-tertiary);
}

/* 可见性 */
.note-card__visibility {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
}

/* 紧凑模式 */
.note-card--compact .note-card__content {
  padding: var(--spacing-sm);
}

.note-card--compact .note-card__title {
  font-size: var(--font-size-body-sm);
}

.note-card--compact .note-card__excerpt {
  display: none;
}

.note-card--compact .note-card__location,
.note-card--compact .note-card__stats {
  display: none;
}
</style>
