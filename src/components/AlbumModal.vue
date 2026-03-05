<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { albums } from '../api'

const props = defineProps<{
  existingAlbums?: { name: string }[]
  familyId?: string
}>()

const emit = defineEmits<{
  create: [data: { name: string; description: string; privacy: string; cover?: string }]
  close: []
}>()

const form = ref({
  name: '',
  description: '',
  privacy: 'public'
})

const isSubmitting = ref(false)
const error = ref('')
const nameTouched = ref(false)

// 检查相册名是否重复
const isDuplicateName = computed(() => {
  if (!form.value.name.trim() || !props.existingAlbums?.length) return false
  return props.existingAlbums.some(
    album => album.name.toLowerCase() === form.value.name.trim().toLowerCase()
  )
})

// 表单是否有效
const isValid = computed(() => {
  return form.value.name.trim() && !isDuplicateName.value && !isSubmitting.value
})

// 防抖处理
let submitTimeout: ReturnType<typeof setTimeout> | null = null

function submit() {
  // 清除之前的定时器
  if (submitTimeout) {
    clearTimeout(submitTimeout)
  }
  
  // 标记已触摸过名称输入框
  nameTouched.value = true
  
  if (!form.value.name.trim()) {
    error.value = '请输入相册名称'
    return
  }
  
  if (isDuplicateName.value) {
    error.value = '相册名称已存在'
    return
  }
  
  // 防止重复提交 - 设置防抖
  if (isSubmitting.value) return
  
  isSubmitting.value = true
  error.value = ''
  
  // 添加防抖延迟
  submitTimeout = setTimeout(async () => {
    try {
      // 如果有 familyId，先检查是否能创建
      if (props.familyId) {
        const checkResult = await albums.getByFamily(props.familyId)
        if (checkResult.error) {
          error.value = checkResult.error || '无法创建相册'
          isSubmitting.value = false
          return
        }
      }
      
      emit('create', {
        name: form.value.name.trim(),
        description: form.value.description.trim(),
        privacy: form.value.privacy
      })
    } catch (e) {
      error.value = '创建失败，请重试'
    } finally {
      isSubmitting.value = false
    }
  }, 500)
}

// 清理定时器
watch(() => form.value.name, () => {
  if (submitTimeout) {
    clearTimeout(submitTimeout)
  }
})
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="emit('close')"></div>
    
    <!-- Modal -->
    <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-800">新建相册</h3>
        <button @click="emit('close')" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <!-- Form -->
      <form @submit.prevent="submit" class="p-6 space-y-4">
        <!-- Error Message -->
        <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-xl">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">相册名称</label>
          <input 
            v-model="form.name" 
            type="text" 
            placeholder="例如：2024春节聚会"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            :class="{ 'border-red-300 focus:ring-red-500/50': (nameTouched && isDuplicateName) || error }"
            @blur="nameTouched = true"
            :disabled="isSubmitting"
          />
          <p v-if="nameTouched && isDuplicateName" class="mt-1 text-xs text-red-500">相册名称已存在，请使用其他名称</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">描述（可选）</label>
          <textarea 
            v-model="form.description" 
            placeholder="相册描述"
            rows="2"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
          ></textarea>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">可见性</label>
          <div class="flex gap-3">
            <label class="flex-1 flex items-center justify-center gap-2 p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-amber-300 transition-colors" :class="form.privacy === 'public' ? 'border-amber-500 bg-amber-50' : ''">
              <input v-model="form.privacy" type="radio" value="public" class="sr-only" />
              <span>🌎 公开</span>
            </label>
            <label class="flex-1 flex items-center justify-center gap-2 p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-amber-300 transition-colors" :class="form.privacy === 'private' ? 'border-amber-500 bg-amber-50' : ''">
              <input v-model="form.privacy" type="radio" value="private" class="sr-only" />
              <span>🔒 私有</span>
            </label>
          </div>
        </div>
        
        <button 
          type="submit" 
          class="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          :disabled="!isValid"
        >
          <svg v-if="isSubmitting" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ isSubmitting ? '创建中...' : '创 建' }}</span>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scale-in 0.2s ease-out forwards;
}
</style>
