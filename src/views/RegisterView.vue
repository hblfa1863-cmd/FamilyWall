<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  register: [username: string, email: string, password: string, inviteCode?: string]
  switchToLogin: []
}>()

const form = ref({ username: '', email: '', password: '', inviteCode: '' })

function submit() {
  emit('register', form.value.username, form.value.email, form.value.password, form.value.inviteCode || undefined)
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="text-5xl mb-4">🏠</div>
        <h1 class="text-3xl font-bold">注册</h1>
      </div>
      <form @submit.prevent="submit" class="space-y-4">
        <input v-model="form.username" type="text" placeholder="用户名" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30" required />
        <input v-model="form.email" type="email" placeholder="邮箱" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30" required />
        <input v-model="form.password" type="password" placeholder="密码" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30" required />
        <input v-model="form.inviteCode" type="text" placeholder="邀请码(选填)" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30" />
        <button type="submit" class="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold rounded-xl">注册</button>
      </form>
      <p class="text-center mt-6 text-white/50">已有账号? <button @click="emit('switchToLogin')" class="text-amber-400 hover:underline">立即登录</button></p>
    </div>
  </div>
</template>
