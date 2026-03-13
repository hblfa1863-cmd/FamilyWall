<template>
  <FwModal v-model="visible" :title="title" size="sm" :mask-closable="false">
    <div class="fw-confirm__content">
      <div class="fw-confirm__icon" :class="`fw-confirm__icon--${type}`">
        {{ icon }}
      </div>
      <p class="fw-confirm__message">{{ message }}</p>
    </div>
    
    <template #footer>
      <FwButton v-if="showCancel" type="ghost" size="md" @click="handleCancel">
        {{ cancelText }}
      </FwButton>
      <FwButton :type="confirmType" size="md" @click="handleConfirm">
        {{ confirmText }}
      </FwButton>
    </template>
  </FwModal>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
  title?: string;
  message: string;
  icon?: string;
  type?: 'warning' | 'danger' | 'success' | 'info';
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: '确认',
  icon: '⚠️',
  type: 'warning',
  confirmText: '确认',
  cancelText: '取消',
  showCancel: true,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  confirm: [];
  cancel: [];
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const confirmType = computed(() => {
  if (props.type === 'danger') return 'danger';
  return 'primary';
});

const handleConfirm = () => {
  emit('confirm');
  visible.value = false;
};

const handleCancel = () => {
  emit('cancel');
  visible.value = false;
};
</script>

<style scoped>
.fw-confirm__content {
  text-align: center;
  padding: var(--spacing-md) 0;
}

.fw-confirm__icon {
  font-size: 48px;
  margin-bottom: var(--spacing-md);
}

.fw-confirm__icon--warning {
  color: var(--color-warning);
}

.fw-confirm__icon--danger {
  color: var(--color-danger);
}

.fw-confirm__icon--success {
  color: var(--color-success);
}

.fw-confirm__icon--info {
  color: var(--color-info);
}

.fw-confirm__message {
  font-size: var(--font-size-body);
  color: var(--color-text-secondary);
  line-height: 1.6;
}
</style>
