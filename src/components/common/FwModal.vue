<template>
  <Teleport to="body">
    <Transition name="fw-modal">
      <div v-if="modelValue" class="fw-modal-mask" @click="handleMaskClick">
        <div
          :class="['fw-modal', `fw-modal--${size}`]"
          @click.stop
        >
          <div class="fw-modal__header">
            <h3 class="fw-modal__title">{{ title }}</h3>
            <button v-if="showClose" class="fw-modal__close" @click="handleClose">
              ✕
            </button>
          </div>
          
          <div class="fw-modal__body">
            <slot></slot>
          </div>
          
          <div v-if="$slots.footer" class="fw-modal__footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  showClose?: boolean;
  maskClosable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  size: 'md',
  showClose: true,
  maskClosable: true,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  close: [];
}>();

const handleClose = () => {
  emit('update:modelValue', false);
  emit('close');
};

const handleMaskClick = () => {
  if (props.maskClosable) {
    handleClose();
  }
};
</script>

<style scoped>
.fw-modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-mask);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
}

.fw-modal {
  background: var(--color-surface);
  border-radius: var(--radius-2xl);
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-modal);
}

/* ==================== 尺寸 ==================== */
.fw-modal--sm {
  max-width: 320px;
}

.fw-modal--md {
  max-width: 420px;
}

.fw-modal--lg {
  max-width: 600px;
}

/* ==================== 结构 ==================== */
.fw-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg) var(--spacing-lg) var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.fw-modal__title {
  font-size: var(--font-size-h4);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.fw-modal__close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: var(--radius-md);
  color: var(--color-text-tertiary);
  cursor: pointer;
  font-size: 16px;
  transition: all var(--transition-fast);
}

.fw-modal__close:hover {
  background: var(--color-background);
  color: var(--color-text-primary);
}

.fw-modal__body {
  padding: var(--spacing-lg);
  overflow-y: auto;
  flex: 1;
}

.fw-modal__footer {
  padding: var(--spacing-md) var(--spacing-lg) var(--spacing-lg);
  border-top: 1px solid var(--color-border);
  display: flex;
  gap: var(--spacing-sm);
  justify-content: flex-end;
}

/* ==================== 动画 ==================== */
.fw-modal-enter-active,
.fw-modal-leave-active {
  transition: opacity var(--transition-normal);
}

.fw-modal-enter-active .fw-modal,
.fw-modal-leave-active .fw-modal {
  transition: transform var(--transition-normal), opacity var(--transition-normal);
}

.fw-modal-enter-from,
.fw-modal-leave-to {
  opacity: 0;
}

.fw-modal-enter-from .fw-modal,
.fw-modal-leave-to .fw-modal {
  transform: scale(0.9);
  opacity: 0;
}
</style>
