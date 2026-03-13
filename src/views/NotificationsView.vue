<template>
  <div class="notifications-page">
    <!-- 顶部 -->
    <div class="notifications-page__header">
      <h1>通知</h1>
      <button 
        v-if="hasUnread"
        class="notifications-page__read-all"
        @click="handleReadAll"
      >
        全部已读
      </button>
    </div>

    <!-- 筛选标签 -->
    <div class="notifications-page__tabs">
      <span 
        v-for="tab in tabs" 
        :key="tab.value"
        :class="['notifications-page__tab', { 'notifications-page__tab--active': activeTab === tab.value }]"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
        <span v-if="tab.count" class="notifications-page__tab-count">{{ tab.count }}</span>
      </span>
    </div>

    <!-- 通知列表 -->
    <div class="notifications-page__list">
      <NotificationItem
        v-for="notification in filteredNotifications"
        :key="notification.id"
        :notification="notification"
        show-delete
        @click="handleNotificationClick"
        @delete="handleDelete"
      />
      
      <!-- 空状态 -->
      <div v-if="filteredNotifications.length === 0" class="notifications-page__empty">
        <span>🔔</span>
        <p>暂无通知</p>
      </div>
    </div>

    <!-- 通知详情弹窗 -->
    <Teleport to="body">
      <Transition name="slide-up">
        <div v-if="selectedNotification" class="notifications-page__detail-mask" @click="selectedNotification = null">
          <div class="notifications-page__detail" @click.stop>
            <div class="notifications-page__detail-header">
              <h3>{{ selectedNotification.from }}</h3>
              <span>{{ formatTime(selectedNotification.createdAt) }}</span>
            </div>
            <div class="notifications-page__detail-content">
              {{ selectedNotification.content }}
            </div>
            <div v-if="selectedNotification.target" class="notifications-page__detail-target">
              <img v-if="selectedNotification.targetImage" :src="selectedNotification.targetImage" />
              <span>"{{ selectedNotification.target }}"</span>
            </div>
            <div class="notifications-page__detail-actions">
              <FwButton 
                v-if="selectedNotification.actionUrl" 
                type="primary" 
                size="sm" 
                block
                @click="handleAction"
              >
                查看详情
              </FwButton>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { FwButton } from '@/components';
import api from '@/services/api';
import NotificationItem from '@/components/common/NotificationItem.vue';

interface Notification {
  id: number;
  type: string;
  from: string;
  avatar: string;
  content: string;
  target?: string;
  targetImage?: string;
  actionUrl?: string;
  unread: boolean;
  createdAt: string;
}

const activeTab = ref('all');
const selectedNotification = ref<Notification | null>(null);

const tabs = computed(() => [
  { label: '全部', value: 'all', count: notifications.value.filter(n => n.unread).length || null },
  { label: '互动', value: '互动', count: null },
  { label: '系统', value: '系统', count: null },
]);

const notifications = ref<Notification[]>([
  {
    id: 1,
    type: 'like',
    from: '李四',
    avatar: '',
    content: '赞了你的笔记',
    target: '春节家庭聚会',
    targetImage: 'https://picsum.photos/100/100?random=1',
    actionUrl: '/notes/1',
    unread: true,
    createdAt: '2024-01-15T14:30:00Z',
  },
  {
    id: 2,
    type: 'comment',
    from: '王五',
    avatar: '',
    content: '评论了你的笔记',
    target: '春节家庭聚会',
    actionUrl: '/notes/1',
    unread: true,
    createdAt: '2024-01-14T10:20:00Z',
  },
  {
    id: 3,
    type: 'clan_approve',
    from: '系统',
    avatar: '',
    content: '你的家族申请已通过',
    target: '王氏家族',
    actionUrl: '/clans/1',
    unread: false,
    createdAt: '2024-01-13T09:00:00Z',
  },
  {
    id: 4,
    type: 'member_join',
    from: '赵六',
    avatar: '',
    content: '加入了你的家庭',
    target: '',
    actionUrl: '/families/1',
    unread: false,
    createdAt: '2024-01-12T15:00:00Z',
  },
  {
    id: 5,
    type: 'mention',
    from: '钱七',
    avatar: '',
    content: '@了你',
    target: '清明踏青',
    actionUrl: '/notes/2',
    unread: true,
    createdAt: '2024-01-11T11:00:00Z',
  },
]);

const filteredNotifications = computed(() => {
  if (activeTab.value === 'all') {
    return notifications.value;
  }
  return notifications.value.filter(n => n.type === activeTab.value);
});

const hasUnread = computed(() => notifications.value.some(n => n.unread));

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', { 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const handleNotificationClick = (notification: Notification) => {
  selectedNotification.value = notification;
  
  // 标记已读
  if (notification.unread) {
    notification.unread = false;
  }
};

const handleDelete = (id: number) => {
  const index = notifications.value.findIndex(n => n.id === id);
  if (index > -1) {
    notifications.value.splice(index, 1);
  }
};

const handleReadAll = () => {
  notifications.value.forEach(n => n.unread = false);
};

const handleAction = () => {
  if (selectedNotification.value?.actionUrl) {
    router.push(selectedNotification.value.actionUrl);
    selectedNotification.value = null;
  }
};
</script>

<style scoped>
.notifications-page {
  min-height: 100vh;
  background: var(--color-background);
  padding-bottom: calc(var(--tabbar-height));
}

.notifications-page__header {
  background: var(--color-surface);
  padding: var(--spacing-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.notifications-page__header h1 {
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-bold);
}

.notifications-page__read-all {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: var(--font-size-body-sm);
  cursor: pointer;
}

/* 标签 */
.notifications-page__tabs {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.notifications-page__tab {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-body-sm);
  color: var(--color-text-tertiary);
  cursor: pointer;
  position: relative;
  padding: var(--spacing-xs) 0;
}

.notifications-page__tab--active {
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}

.notifications-page__tab--active::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-primary);
  border-radius: 1px;
}

.notifications-page__tab-count {
  background: var(--color-danger);
  color: white;
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 10px;
}

/* 列表 */
.notifications-page__list {
  padding: var(--spacing-sm);
}

/* 空状态 */
.notifications-page__empty {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-text-tertiary);
}

.notifications-page__empty span {
  font-size: 64px;
  display: block;
  margin-bottom: var(--spacing-md);
}

/* 详情弹窗 */
.notifications-page__detail-mask {
  position: fixed;
  inset: 0;
  background: var(--color-mask);
  z-index: 2000;
  display: flex;
  align-items: flex-end;
}

.notifications-page__detail {
  width: 100%;
  background: var(--color-surface);
  border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
  padding: var(--spacing-lg);
  padding-bottom: calc(var(--spacing-lg) + env(safe-area-inset-bottom));
}

.notifications-page__detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.notifications-page__detail-header h3 {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
}

.notifications-page__detail-header span {
  font-size: var(--font-size-caption);
  color: var(--color-text-tertiary);
}

.notifications-page__detail-content {
  font-size: var(--font-size-body);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
}

.notifications-page__detail-target {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--color-background);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-lg);
}

.notifications-page__detail-target img {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  object-fit: cover;
}

.notifications-page__detail-target span {
  flex: 1;
  font-size: var(--font-size-body-sm);
  color: var(--color-text-secondary);
}

/* 动画 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform var(--transition-normal), opacity var(--transition-normal);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
