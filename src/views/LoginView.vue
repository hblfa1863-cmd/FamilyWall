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
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="text-5xl mb-4">🏠</div>
        <h1 class="text-3xl font-bold">FamilyWall</h1>
        <p class="text-white/50 mt-2">家族照片墙</p>
      </div>
      <form @submit.prevent="submit" class="space-y-4">
        <input v-model="form.email" type="email" placeholder="邮箱" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30" required />
        <input v-model="form.password" type="password" placeholder="密码" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30" required />
        <button type="submit" class="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold rounded-xl">登录</button>
      </form>
      <p class="text-center mt-6 text-white/50">没有账号? <button @click="emit('switchToRegister')" class="text-amber-400 hover:underline">立即注册</button></p>
    </div>
  </div>
</template>
