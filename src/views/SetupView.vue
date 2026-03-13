<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const apiUrl = ref('')
const error = ref('')
const loading = ref(false)

onMounted(() => {
  apiUrl.value = api.getApiUrl()
})

async function saveApiUrl() {
  error.value = ''
  
  if (!apiUrl.value.trim()) {
    error.value = '请输入 API 地址'
    return
  }
  
  // 验证 URL 格式
  let url = apiUrl.value.trim()
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'http://' + url
  }
  
  if (!url.endsWith('/api')) {
    url = url + '/api'
  }
  
  loading.value = true
  
  try {
    // 测试连接
    const res = await fetch(url.replace('/api', '/api/health'))
    if (!res.ok) {
      throw new Error('无法连接到 API')
    }
    
    api.setApiUrl(url)
    
    // 清除 token，重新登录
    localStorage.removeItem('token')
    
    router.push('/login')
  } catch (e: any) {
    error.value = '连接失败: ' + (e.message || '请检查 API 地址是否正确')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 class="text-2xl font-bold text-center mb-6">配置服务器地址</h1>
      
      <p class="text-gray-600 text-sm mb-4">
        请输入你的后端 API 服务器地址
      </p>
      
      <form @submit.prevent="saveApiUrl">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">
            API 地址
          </label>
          <input
            v-model="apiUrl"
            type="text"
            placeholder="例如: http://43.155.130.217:18789/api"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div v-if="error" class="mb-4 text-red-500 text-sm">
          {{ error }}
        </div>
        
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {{ loading ? '连接中...' : '保存并登录' }}
        </button>
      </form>
    </div>
  </div>
</template>
