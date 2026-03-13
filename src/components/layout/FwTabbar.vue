<template>
  <div class="fw-tabbar safe-area-bottom">
    <div
      v-for="item in items"
      :key="item.path"
      :class="['fw-tabbar__item', { 'fw-tabbar__item--active': active === item.path }]"
      @click="handleClick(item.path)"
    >
      <span class="fw-tabbar__icon">{{ item.icon }}</span>
      <span class="fw-tabbar__label">{{ item.label }}</span>
      <span v-if="item.badge" class="fw-tabbar__badge">{{ item.badge }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TabItem {
  path: string;
  label: string;
  icon: string;
  badge?: string | number;
}

interface Props {
  active?: string;
  items?: TabItem[];
}

withDefaults(defineProps<Props>(), {
  active: '',
  items: () => [
    { path: '/', label: '首页', icon: '🏠' },
    { path: '/timeline', label: '时光轴', icon: '📅' },
    { path: '/map', label: '地图', icon: '🗺️' },
    { path: '/notifications', label: '通知', icon: '🔔' },
    { path: '/profile', label: '我的', icon: '👤' },
  ],
});

const emit = defineEmits<{
  change: [path: string];
}>();

const handleClick = (path: string) => {
  emit('change', path);
};
</script>

<style scoped>
.fw-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--tabbar-height);
  background: var(--color-surface);
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 1000;
}

.fw-tabbar__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: var(--color-text-tertiary);
  cursor: pointer;
  position: relative;
  transition: color var(--transition-fast);
}

.fw-tabbar__item--active {
  color: var(--color-primary);
}

.fw-tabbar__icon {
  font-size: 22px;
  position: relative;
}

.fw-tabbar__label {
  font-size: var(--font-size-mini);
}

.fw-tabbar__badge {
  position: absolute;
  top: 0;
  right: 50%;
  transform: translateX(14px);
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: var(--radius-full);
  background: var(--color-danger);
  color: white;
  font-size: 10px;
  font-weight: var(--font-weight-bold);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
