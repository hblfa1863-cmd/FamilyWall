<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const apiUrl = ref('')
const error = ref('')
const loading = ref(false)

onMounted(() => {
  const saved = localStorage.getItem('api_url')
  if (saved) {
    apiUrl.value = saved
  }
})

async function saveApiUrl() {
  error.value = ''
  
  if (!apiUrl.value.trim()) {
    error.value = '请输入 API 地址'
    return
  }
  
  let url = apiUrl.value.trim()
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'http://' + url
  }
  url = url.replace(/\/$/, '')
  if (!url.endsWith('/api')) {
    url = url + '/api'
  }
  
  loading.value = true
  
  try {
    const testUrl = url.replace('/api', '') + '/api/health'
    console.log('测试URL:', testUrl)
    
    const res = await fetch(testUrl)
    
    if (!res.ok) {
      throw new Error('连接失败，状态码: ' + res.status)
    }
    
    const data = await res.json()
    if (data.status !== 'ok') {
      throw new Error('API 响应异常')
    }
    
    // 保存到 localStorage
    localStorage.setItem('api_url', url)
    localStorage.removeItem('token')
    console.log('API地址已保存:', url)
    
    // 使用 router 跳转
    router.push('/login')
    
  } catch (e: unknown) {
    console.error('连接失败:', e)
    error.value = '连接失败: 请检查 API 地址是否正确'
    loading.value = false
  }
}

function skipSetup() {
  router.push('/login')
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
            placeholder="例如: http://43.155.130.217:18790/api"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div v-if="error" class="mb-4 text-red-500 text-sm">
          {{ error }}
        </div>
        
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 mb-3"
        >
          {{ loading ? '连接中...' : '保存并登录' }}
        </button>
        
        <button
          type="button"
          @click="skipSetup"
          class="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300"
        >
          暂不配置，直接进入
        </button>
      </form>
    </div>
  </div>
</template>
