<template>
  <button
    :class="[
      'fw-button',
      `fw-button--${type}`,
      `fw-button--${size}`,
      {
        'fw-button--block': block,
        'fw-button--disabled': disabled || loading,
        'fw-button--loading': loading,
      }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="fw-button__loading"></span>
    <span v-if="$slots.icon && !loading" class="fw-button__icon">
      <slot name="icon"></slot>
    </span>
    <span class="fw-button__text">
      <slot></slot>
    </span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  type?: 'primary' | 'secondary' | 'ghost' | 'link' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  block?: boolean;
  iconPosition?: 'left' | 'right';
}

const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  block: false,
  iconPosition: 'left',
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};
</script>

<style scoped>
.fw-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  border: none;
  border-radius: var(--radius-lg);
  font-family: var(--font-family);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
  white-space: nowrap;
  user-select: none;
  outline: none;
}

.fw-button:focus-visible {
  box-shadow: 0 0 0 3px rgba(38, 70, 83, 0.2);
}

/* ==================== 按钮类型 ==================== */
.fw-button--primary {
  background: var(--color-primary);
  color: white;
}

.fw-button--primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(42, 157, 143, 0.35);
}

.fw-button--primary:active:not(:disabled) {
  background: var(--color-primary-dark);
  transform: translateY(0);
}

.fw-button--secondary {
  background: var(--color-surface);
  color: var(--color-primary);
  border: 1.5px solid var(--color-primary);
}

.fw-button--secondary:hover:not(:disabled) {
  background: var(--color-background);
}

.fw-button--secondary:active:not(:disabled) {
  background: var(--color-success-light);
}

.fw-button--ghost {
  background: transparent;
  color: var(--color-text-secondary);
}

.fw-button--ghost:hover:not(:disabled) {
  background: var(--color-background);
  color: var(--color-text-primary);
}

.fw-button--link {
  background: transparent;
  color: var(--color-primary);
  padding: var(--spacing-xs) var(--spacing-sm);
}

.fw-button--link:hover:not(:disabled) {
  text-decoration: underline;
}

.fw-button--danger {
  background: var(--color-danger);
  color: white;
}

.fw-button--danger:hover:not(:disabled) {
  background: #D4563F;
  box-shadow: 0 4px 12px rgba(231, 111, 81, 0.35);
}

/* ==================== 按钮尺寸 ==================== */
.fw-button--xs {
  height: 28px;
  padding: 0 12px;
  font-size: var(--font-size-tiny);
  border-radius: 6px;
}

.fw-button--sm {
  height: 36px;
  padding: 0 16px;
  font-size: var(--font-size-body-sm);
  border-radius: var(--radius-md);
}

.fw-button--md {
  height: 44px;
  padding: 0 24px;
  font-size: var(--font-size-body);
  border-radius: var(--radius-lg);
}

.fw-button--lg {
  height: 52px;
  padding: 0 32px;
  font-size: var(--font-size-body);
  border-radius: var(--radius-lg);
}

.fw-button--xl {
  height: 60px;
  padding: 0 40px;
  font-size: var(--font-size-h5);
  border-radius: 14px;
}

/* ==================== 按钮状态 ==================== */
.fw-button--block {
  width: 100%;
}

.fw-button--disabled,
.fw-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.fw-button--loading {
  pointer-events: none;
}

/* ==================== 加载动画 ==================== */
.fw-button__loading {
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ==================== 图标 ==================== */
.fw-button__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.fw-button--xs .fw-button__icon,
.fw-button--sm .fw-button__icon {
  font-size: 14px;
}

.fw-button--md .fw-button__icon {
  font-size: 16px;
}

.fw-button--lg .fw-button__icon,
.fw-button--xl .fw-button__icon {
  font-size: 18px;
}
</style>
