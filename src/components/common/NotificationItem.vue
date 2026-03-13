<template>
  <div class="notification-item" @click="handleClick">
    <div class="notification-item__avatar">
      <FwAvatar :src="notification.avatar" :name="notification.from" size="md" />
      <div v-if="notification.unread" class="notification-item__unread-dot"></div>
    </div>

    <div class="notification-item__content">
      <div class="notification-item__header">
        <span class="notification-item__name">{{ notification.from }}</span>
        <span class="notification-item__type">{{ typeText }}</span>
      </div>
      
      <p class="notification-item__text">{{ notification.content }}</p>
      
      <div class="notification-item__meta">
        <span class="notification-item__time">{{ formatTime(notification.createdAt) }}</span>
        <span v-if="notification.target" class="notification-item__target">
          "{{ notification.target }}"
        </span>
      </div>
    </div>

    <div v-if="notification.targetImage" class="notification-item__preview">
      <img :src="notification.targetImage" alt="" />
    </div>

    <button 
      v-if="showDelete" 
      class="notification-item__delete"
      @click.stop="handleDelete"
    >
      ×
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { FwAvatar } from '@/components';

interface Notification {
  id: number;
  type: string;
  from: string;
  avatar: string;
  content: string;
  target?: string;
  targetImage?: string;
  unread: boolean;
  createdAt: string;
}

interface Props {
  notification: Notification;
  showDelete?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showDelete: false,
});

const emit = defineEmits<{
  click: [notification: Notification];
  delete: [id: number];
}>();

const typeText = computed(() => {
  switch (props.notification.type) {
    case 'like': return '赞了';
    case 'comment': return '评论了';
    case 'mention': return '@了你';
    case 'family_invite': return '邀请你';
    case 'clan_apply': return '申请加入';
    case 'clan_approve': return '通过了';
    case 'member_join': return '加入了';
    case 'system': return '系统通知';
    default: return '';
  }
});

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

const handleClick = () => {
  emit('click', props.notification);
};

const handleDelete = () => {
  emit('delete', props.notification.id);
};
</script>

<style scoped>
.notification-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-surface);
  cursor: pointer;
  position: relative;
}

.notification-item:hover {
  background: var(--color-background);
}

.notification-item__avatar {
  position: relative;
  flex-shrink: 0;
}

.notification-item__unread-dot {
  position: absolute;
  top: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background: var(--color-danger);
  border-radius: var(--radius-full);
  border: 2px solid var(--color-surface);
}

.notification-item__content {
  flex: 1;
  min-width: 0;
}

.notification-item__header {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-bottom: 2px;
}

.notification-item__name {
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.notification-item__type {
  font-size: var(--font-size-caption);
  color: var(--color-text-tertiary);
}

.notification-item__text {
  font-size: var(--font-size-body-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notification-item__meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.notification-item__time {
  font-size: var(--font-size-tiny);
  color: var(--color-text-tertiary);
}

.notification-item__target {
  font-size: var(--font-size-tiny);
  color: var(--color-primary);
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notification-item__preview {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  overflow: hidden;
  flex-shrink: 0;
}

.notification-item__preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.notification-item__delete {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background);
  border: none;
  border-radius: var(--radius-full);
  color: var(--color-text-tertiary);
  font-size: 14px;
  cursor: pointer;
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.notification-item:hover .notification-item__delete {
  opacity: 1;
}
</style>
