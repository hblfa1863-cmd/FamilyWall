<template>
  <div class="fw-navbar safe-area-top">
    <div class="fw-navbar__left">
      <slot name="left">
        <button v-if="showBack" class="fw-navbar__back" @click="handleBack">
          ←
        </button>
      </slot>
    </div>
    
    <div class="fw-navbar__title">
      <slot>{{ title }}</slot>
    </div>
    
    <div class="fw-navbar__right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  showBack?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  showBack: false,
});

const emit = defineEmits<{
  back: [];
}>();

const handleBack = () => {
  emit('back');
};
</script>

<style scoped>
.fw-navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  height: var(--navbar-height);
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-md);
}

.fw-navbar__left,
.fw-navbar__right {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  min-width: 60px;
}

.fw-navbar__left {
  justify-content: flex-start;
}

.fw-navbar__right {
  justify-content: flex-end;
}

.fw-navbar__title {
  flex: 1;
  text-align: center;
  font-size: var(--font-size-h5);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fw-navbar__back {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: var(--radius-md);
  font-size: 20px;
  color: var(--color-text-primary);
  cursor: pointer;
}

.fw-navbar__back:hover {
  background: var(--color-background);
}
</style>
