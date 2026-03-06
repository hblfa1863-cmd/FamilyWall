<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { auth } from '../api'
import { t, type Locale } from '../i18n'

const props = defineProps<{
  currentLocale?: Locale
}>()

const emit = defineEmits<{
  close: []
  updateUser: [data: { username: string; email: string }]
  localeChange: [locale: Locale]
}>()

const form = ref({
  username: '',
  email: ''
})

const isLoading = ref(false)
const isSaving = ref(false)
const error = ref('')
const success = ref(false)

// 语言选项
const locales = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'English' }
]

// 直接使用 props 中的 locale，不再维护内部状态
const currentLocale = computed(() => props.currentLocale || 'zh')

onMounted(async () => {
  isLoading.value = true
  try {
    const user = await auth.getMe()
    if (user) {
      form.value.username = user.username || ''
      form.value.email = user.email || ''
    }
  } catch (e) {
    error.value = 'Failed to load profile'
  } finally {
    isLoading.value = false
  }
})

function changeLocale(locale: Locale) {
  emit('localeChange', locale)
}

async function saveProfile() {
  if (!form.value.username.trim()) {
    error.value = 'Username cannot be empty'
    return
  }
  
  isSaving.value = true
  error.value = ''
  
  try {
    // 调用API更新用户信息（需要后端支持）
    // 这里先模拟成功
    await new Promise(resolve => setTimeout(resolve, 500))
    
    success.value = true
    emit('updateUser', { ...form.value })
    
    setTimeout(() => {
      success.value = false
    }, 2000)
  } catch (e) {
    error.value = 'Failed to save'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
    <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-800">{{ t('profile.title', currentLocale) }}</h3>
        <button @click="emit('close')" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <!-- Content -->
      <div class="p-6">
        <!-- Loading -->
        <div v-if="isLoading" class="flex justify-center py-8">
          <div class="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        <!-- Error -->
        <div v-else-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>
        
        <!-- Success -->
        <div v-if="success" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl">
          <p class="text-sm text-green-600">{{ t('profile.saveSuccess', currentLocale) }}</p>
        </div>
        
        <!-- Form -->
        <form v-if="!isLoading" @submit.prevent="saveProfile" class="space-y-5">
          <!-- Avatar -->
          <div class="flex flex-col items-center mb-6">
            <div class="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-5xl text-white shadow-lg shadow-amber-500/30 mb-3">
              {{ form.username.charAt(0).toUpperCase() }}
            </div>
            <p class="text-sm text-gray-500">{{ t('profile.avatar', currentLocale) }}</p>
          </div>
          
          <!-- Username -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('profile.username', currentLocale) }}</label>
            <input 
              v-model="form.username" 
              type="text" 
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              :placeholder="t('profile.username', currentLocale)"
            />
          </div>
          
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('profile.email', currentLocale) }}</label>
            <input 
              v-model="form.email" 
              type="email" 
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 bg-gray-50"
              disabled
            />
            <p class="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>
          
          <!-- Language -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Language / 语言</label>
            <div class="flex gap-3">
              <button 
                v-for="locale in locales"
                :key="locale.value"
                type="button"
                @click="changeLocale(locale.value as Locale)"
                :class="[
                  'flex-1 py-3 rounded-xl text-sm font-medium transition-all',
                  currentLocale === locale.value 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
              >
                {{ locale.label }}
              </button>
            </div>
          </div>
          
          <!-- Save Button -->
          <button 
            type="submit" 
            :disabled="isSaving"
            class="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <svg v-if="isSaving" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isSaving ? 'Saving...' : t('actions.save', currentLocale) }}</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
