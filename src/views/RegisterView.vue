<script setup lang="ts">
import { ref, computed } from 'vue'
import { auth, validateInviteCode } from '../api'

const emit = defineEmits<{
  register: [username: string, email: string, password: string, inviteCode?: string]
  switchToLogin: []
}>()

const form = ref({ username: '', email: '', password: '', confirmPassword: '', inviteCode: '' })
const errors = ref<{ password?: string; confirmPassword?: string; inviteCode?: string }>()
const isChecking = ref(false)
const inviteCodeValid = ref<boolean | null>(null)

const isValid = computed(() => {
  return form.value.username.trim() && 
         form.value.email.trim() && 
         form.value.password.length >= 6 &&
         form.value.password === form.value.confirmPassword
})

// 验证邀请码
async function checkInviteCode() {
  if (!form.value.inviteCode.trim()) {
    inviteCodeValid.value = null
    errors.value = {}
    return true
  }
  
  isChecking.value = true
  errors.value = {}
  
  try {
    const result = await validateInviteCode(form.value.inviteCode.trim())
    if (result && result.valid === false) {
      errors.value = { inviteCode: '邀请码无效或已过期' }
      inviteCodeValid.value = false
      return false
    }
    inviteCodeValid.value = true
    return true
  } catch (e) {
    // API调用失败时允许跳过
    console.log('Invite code validation skipped:', e)
    inviteCodeValid.value = true
    return true
  } finally {
    isChecking.value = false
  }
}

function validate() {
  errors.value = {}
  
  if (form.value.password.length < 6) {
    errors.value = { password: '密码至少需要6位' }
    return false
  }
  
  if (form.value.password !== form.value.confirmPassword) {
    errors.value = { confirmPassword: '两次输入的密码不一致' }
    return false
  }
  
  return true
}

async function submit() {
  if (!validate()) return
  
  // 验证邀请码
  isChecking.value = true
  const isValidCode = await checkInviteCode()
  isChecking.value = false
  
  if (!isValidCode) return
  
  emit('register', form.value.username, form.value.email, form.value.password, form.value.inviteCode || undefined)
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
        <p class="text-gray-400 mt-2">开启你的家庭回忆之旅</p>
      </div>
      
      <!-- Form -->
      <form @submit.prevent="submit" class="space-y-4 bg-white rounded-3xl p-8 shadow-xl shadow-gray-100/50">
        <div>
          <label for="username" class="sr-only">用户名</label>
          <input 
            id="username"
            v-model="form.username" 
            type="text" 
            placeholder="用户名"
            class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:bg-white transition-all"
            required 
          />
        </div>
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
            placeholder="密码（至少6位）"
            minlength="6"
            class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:bg-white transition-all"
            :class="{ 'border-red-300': errors.password }"
            required 
          />
          <p v-if="errors.password" class="mt-1 text-xs text-red-500">{{ errors.password }}</p>
        </div>
        <div>
          <label for="confirmPassword" class="sr-only">确认密码</label>
          <input 
            id="confirmPassword"
            v-model="form.confirmPassword" 
            type="password" 
            placeholder="确认密码"
            class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:bg-white transition-all"
            :class="{ 'border-red-300': errors.confirmPassword }"
            required 
          />
          <p v-if="errors.confirmPassword" class="mt-1 text-xs text-red-500">{{ errors.confirmPassword }}</p>
        </div>
        <div>
          <label for="inviteCode" class="sr-only">邀请码（可选）</label>
          <input 
            id="inviteCode"
            v-model="form.inviteCode" 
            type="text" 
            placeholder="邀请码（可选）"
            class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:bg-white transition-all"
            :class="{ 'border-red-300': errors?.inviteCode, 'border-green-300': inviteCodeValid === true }"
          />
          <p v-if="errors?.inviteCode" class="mt-1 text-xs text-red-500">{{ errors.inviteCode }}</p>
          <p v-else-if="inviteCodeValid === true" class="mt-1 text-xs text-green-500">✓ 邀请码有效</p>
        </div>
        <button 
          type="submit" 
          class="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-2xl hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          :disabled="!isValid || isChecking"
        >
          <svg v-if="isChecking" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ isChecking ? '验证中...' : '注 册' }}</span>
        </button>
      </form>
      
      <!-- Login Link -->
      <p class="text-center mt-6 text-gray-500">
        已有账号?
        <button @click="emit('switchToLogin')" class="text-amber-600 font-medium hover:text-amber-700 ml-1">
          立即登录 →
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
