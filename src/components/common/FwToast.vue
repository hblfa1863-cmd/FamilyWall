<template>
  <Teleport to="body">
    <Transition name="fw-toast">
      <div v-if="visible" :class="['fw-toast', `fw-toast--${type}`]">
        <span class="fw-toast__icon">{{ icon }}</span>
        <span class="fw-toast__message">{{ message }}</span>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
interface Props {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 3000,
});

const visible = ref(false);

const icon = computed(() => {
  switch (props.type) {
    case 'success': return '✓';
    case 'error': return '✕';
    case 'warning': return '⚠';
    default: return 'ℹ';
  }
});

let timer: ReturnType<typeof setTimeout> | null = null;

const show = () => {
  visible.value = true;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    visible.value = false;
  }, props.duration);
};

const hide = () => {
  visible.value = false;
  if (timer) clearTimeout(timer);
};

// 暴露方法给外部调用
defineExpose({
  show,
  hide,
});
</script>

<style scoped>
.fw-toast {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 20px;
  border-radius: var(--radius-md);
  background: rgba(0, 0, 0, 0.75);
  color: white;
  font-size: var(--font-size-body-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  z-index: 3000;
  box-shadow: var(--shadow-lg);
}

.fw-toast__icon {
  font-size: 16px;
  font-weight: var(--font-weight-bold);
}

.fw-toast--success {
  background: rgba(42, 157, 143, 0.95);
}

.fw-toast--error {
  background: rgba(231, 111, 81, 0.95);
}

.fw-toast--warning {
  background: rgba(244, 162, 97, 0.95);
}

.fw-toast--info {
  background: rgba(42, 157, 143, 0.95);
}

/* 动画 */
.fw-toast-enter-active,
.fw-toast-leave-active {
  transition: opacity var(--transition-normal), transform var(--transition-normal);
}

.fw-toast-enter-from,
.fw-toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}
</style>
