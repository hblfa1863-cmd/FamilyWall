<template>
  <span :class="['fw-tag', `fw-tag--${type}`, `fw-tag--${size}`]">
    <slot></slot>
  </span>
</template>

<script setup lang="ts">
interface Props {
  type?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'clan';
  size?: 'sm' | 'md';
}

withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'md',
});
</script>

<style scoped>
.fw-tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  font-size: var(--font-size-tiny);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-sm);
  white-space: nowrap;
}

/* ==================== 尺寸 ==================== */
.fw-tag--sm {
  padding: 2px 8px;
  font-size: var(--font-size-mini);
}

.fw-tag--md {
  padding: 4px 10px;
}

/* ==================== 类型 ==================== */
.fw-tag--default {
  background: var(--color-success-light);
  color: var(--color-primary);
}

.fw-tag--primary {
  background: var(--color-success-light);
  color: var(--color-primary);
}

.fw-tag--success {
  background: #E8F5E9;
  color: var(--color-success);
}

.fw-tag--warning {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.fw-tag--danger {
  background: var(--color-danger-light);
  color: var(--color-danger);
}

.fw-tag--info {
  background: var(--color-info-light);
  color: var(--color-info);
}

.fw-tag--clan {
  background: var(--color-clan-light);
  color: var(--color-clan);
}
</style>
