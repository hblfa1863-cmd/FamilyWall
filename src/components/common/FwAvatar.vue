<template>
  <div :class="['fw-avatar', `fw-avatar--${size}`]" @click="handleClick">
    <img
      v-if="src && !imageError"
      :src="src"
      :alt="alt"
      class="fw-avatar__image"
      @error="handleImageError"
    />
    <div v-else class="fw-avatar__placeholder">
      {{ initials }}
    </div>
    
    <span v-if="showBadge" class="fw-avatar__badge" :class="`fw-avatar__badge--${badgeType}`">
      {{ badge }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
interface Props {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  name?: string;
  showBadge?: boolean;
  badge?: string | number;
  badgeType?: 'primary' | 'success' | 'warning' | 'danger';
}

const props = withDefaults(defineProps<Props>(), {
  src: '',
  alt: '',
  size: 'md',
  name: '',
  showBadge: false,
  badge: '',
  badgeType: 'primary',
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const imageError = ref(false);

const initials = computed(() => {
  if (!props.name) return '?';
  const chars = props.name.trim().split('').filter(c => c !== ' ');
  if (chars.length >= 2) {
    return chars[0] + chars[chars.length - 1];
  }
  return chars[0] || '?';
});

const handleClick = (event: MouseEvent) => {
  emit('click', event);
};

const handleImageError = () => {
  imageError.value = true;
};
</script>

<style scoped>
.fw-avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  overflow: visible;
  flex-shrink: 0;
}

/* ==================== 尺寸 ==================== */
.fw-avatar--xs {
  width: 24px;
  height: 24px;
  font-size: 10px;
}

.fw-avatar--sm {
  width: 32px;
  height: 32px;
  font-size: 12px;
}

.fw-avatar--md {
  width: 44px;
  height: 44px;
  font-size: 16px;
}

.fw-avatar--lg {
  width: 60px;
  height: 60px;
  font-size: 20px;
}

.fw-avatar--xl {
  width: 80px;
  height: 80px;
  font-size: 28px;
}

/* ==================== 图片 ==================== */
.fw-avatar__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
}

/* ==================== 占位符 ==================== */
.fw-avatar__placeholder {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover));
  color: white;
  font-weight: var(--font-weight-semibold);
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
}

/* ==================== 徽标 ==================== */
.fw-avatar__badge {
  position: absolute;
  top: -2px;
  right: -2px;
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
  border: 2px solid var(--color-surface);
}

.fw-avatar__badge--primary {
  background: var(--color-primary);
}

.fw-avatar__badge--success {
  background: var(--color-success);
}

.fw-avatar__badge--warning {
  background: var(--color-warning);
}

.fw-avatar__badge--danger {
  background: var(--color-danger);
}
</style>
