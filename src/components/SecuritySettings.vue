<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  close: []
}>()

const showReportModal = ref(false)
const reportTargetId = ref('')
const reportType = ref<'photo' | 'user'>('photo')
const reportReason = ref('')
const reportSuccess = ref(false)

const reasons = [
  '垃圾内容',
  '违规内容',
  '侵犯隐私',
  '虚假信息',
  '其他'
]

function openReport(type: 'photo' | 'user', targetId: string) {
  reportType.value = type
  reportTargetId.value = targetId
  showReportModal.value = true
}

async function submitReport() {
  if (!reportReason.value) {
    alert('请选择举报原因')
    return
  }
  
  const { reports } = await import('../api')
  let result
  if (reportType.value === 'photo') {
    result = await reports.reportPhoto(reportTargetId.value, reportReason.value)
  } else {
    result = await reports.reportUser(reportTargetId.value, reportReason.value)
  }
  
  if (!result.error) {
    reportSuccess.value = true
    setTimeout(() => {
      showReportModal.value = false
      reportSuccess.value = false
    }, 1500)
  }
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
    <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-800">安全设置</h3>
        <button @click="emit('close')" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <!-- Content -->
      <div class="p-6 space-y-4">
        <!-- Security Tips -->
        <div class="bg-amber-50 rounded-2xl p-4">
          <h4 class="font-medium text-amber-800 mb-2">🔒 安全建议</h4>
          <ul class="text-sm text-amber-700 space-y-1">
            <li>• 使用强密码，定期更换</li>
            <li>• 不要向陌生人透露账户信息</li>
            <li>• 谨慎添加陌生人为好友</li>
            <li>• 及时举报违规内容</li>
          </ul>
        </div>
        
        <!-- Privacy Settings -->
        <div>
          <h4 class="font-medium text-gray-800 mb-3">🛡️ 隐私保护</h4>
          <div class="space-y-2">
            <label class="flex items-center gap-3 p-3 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100">
              <input type="checkbox" class="w-5 h-5 text-amber-500 rounded" checked />
              <span class="text-sm text-gray-600">允许好友查看我的照片</span>
            </label>
            <label class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
              <input type="checkbox" class="w-5 h-5 text-amber-500 rounded" checked />
              <span class="text-sm text-gray-600">接收点赞和评论通知</span>
            </label>
            <label class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
              <input type="checkbox" class="w-5 h-5 text-amber-500 rounded" />
              <span class="text-sm text-gray-600">允许通过邮箱搜索到我</span>
            </label>
          </div>
        </div>
        
        <!-- Login Security -->
        <div>
          <h4 class="font-medium text-gray-800 mb-3">🔑 登录安全</h4>
          <div class="bg-green-50 rounded-xl p-3 flex items-center gap-3">
            <span class="text-green-500">✓</span>
            <span class="text-sm text-green-700">账户登录失败保护已开启</span>
          </div>
          <p class="text-xs text-gray-400 mt-2">连续 5 次登录失败将锁定 15 分钟</p>
        </div>
      </div>
    </div>
  </div>
</template>
