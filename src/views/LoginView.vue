<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  login: [email: string, password: string]
  switchToRegister: []
}>()

const form = ref({ email: '', password: '' })

function submit() {
  emit('login', form.value.email, form.value.password)
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#FFFEF8] via-[#FFF8F0] to-[#FFF5E6]">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8 animate-fade-in">
        <div class="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center text-4xl shadow-xl shadow-amber-500/20 transform hover:scale-105 transition-transform duration-300">
          🏠
        </div>
        <h1 class="text-3xl font-semibold text-gray-800 font-display">照片墙</h1>
        <p class="text-gray-400 mt-2">记录每一刻珍贵回忆</p>
      </div>
      
      <!-- Form -->
      <form @submit.prevent="submit" class="space-y-4 bg-white rounded-3xl p-8 shadow-xl shadow-gray-100/50">
        <div>
          <label for="email" class="sr-only">邮箱</label>
          <input 
            id="email"
            v-model="form.email" 
            type="email" 
            placeholder="邮箱地址"
            class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:bg-white transition-all"
            required 
          />
        </div>
        <div>
          <label for="password" class="sr-only">密码</label>
          <input 
            id="password"
            v-model="form.password" 
            type="password" 
            placeholder="密码"
            class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:bg-white transition-all"
            required 
          />
        </div>
        <button 
          type="submit" 
          class="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-2xl hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          登 录
        </button>
      </form>
      
      <!-- Register Link -->
      <p class="text-center mt-6 text-gray-500">
        还没有账号?
        <button @click="emit('switchToRegister')" class="text-amber-600 font-medium hover:text-amber-700 ml-1">
          立即注册 →
        </button>
      </p>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}
</style>
