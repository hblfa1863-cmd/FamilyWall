<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    
    <!-- TabBar (仅在需要显示的页面) -->
    <FwTabbar v-if="showTabbar" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores';
import { FwTabbar } from '@/components';

const route = useRoute();
const authStore = useAuthStore();

// 需要显示TabBar的页面
const showTabbar = computed(() => {
  const name = route.name as string;
  return ['home', 'photo-wall', 'timeline', 'map', 'profile'].includes(name);
});

onMounted(async () => {
  // 初始化认证状态
  await authStore.init();
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--color-background);
  color: var(--color-text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
