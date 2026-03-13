<template>
  <div
    :class="[
      'fw-card',
      {
        'fw-card--interactive': interactive,
        'fw-card--selected': selected,
        'fw-card--bordered': bordered,
      }
    ]"
    @click="handleClick"
  >
    <div v-if="$slots.header" class="fw-card__header">
      <slot name="header"></slot>
    </div>
    
    <div :class="['fw-card__body', { 'fw-card__body--no-padding': noPadding }]">
      <slot></slot>
    </div>
    
    <div v-if="$slots.footer" class="fw-card__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  interactive?: boolean;
  selected?: boolean;
  bordered?: boolean;
  noPadding?: boolean;
}

withDefaults(defineProps<Props>(), {
  interactive: false,
  selected: false,
  bordered: false,
  noPadding: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const handleClick = (event: MouseEvent) => {
  emit('click', event);
};
</script>

<style scoped>
.fw-card {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: all var(--transition-normal);
}

.fw-card--bordered {
  border: 1px solid var(--color-border);
  box-shadow: none;
}

.fw-card--interactive {
  cursor: pointer;
}

.fw-card--interactive:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.fw-card--interactive:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.fw-card--selected {
  border: 2px solid var(--color-primary);
}

.fw-card__header {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.fw-card__body {
  padding: var(--spacing-md);
}

.fw-card__body--no-padding {
  padding: 0;
}

.fw-card__footer {
  padding: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}
</style>
