<template>
  <div class="join-family">
    <div class="join-family__header">
      <button @click="router.back()">←</button>
      <h1>加入家庭</h1>
      <span></span>
    </div>

    <div class="join-family__form">
      <h2>输入邀请码</h2>
      <p>请输入家庭成员提供的6位邀请码</p>
      
      <div class="join-family__code-inputs">
        <input 
          v-for="i in 6" 
          :key="i"
          :ref="el => inputs[i-1] = el"
          v-model="code[i-1]"
          type="text"
          maxlength="1"
          @input="handleInput(i-1)"
          @keydown.backspace="handleBackspace(i-1)"
        />
      </div>

      <FwButton type="primary" size="lg" block :loading="loading" @click="handleJoin">
        加入家庭
      </FwButton>
    </div>

    <!-- 错误弹窗 -->
    <FwModal v-model="showError" title="加入失败" size="sm">
      <div class="join-family__error-content">
        <span>⚠️</span>
        <p>{{ errorMessage }}</p>
      </div>
      <template #footer>
        <FwButton type="primary" @click="showError = false">确定</FwButton>
      </template>
    </FwModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { FwButton, FwModal } from '@/components';

const router = useRouter();
const loading = ref(false);
const showError = ref(false);
const errorMessage = ref('');

const code = reactive(['', '', '', '', '', '']);
const inputs = ref<HTMLInputElement[]>([]);

const handleInput = (index: number) => {
  if (code[index] && index < 5) {
    inputs.value[index + 1]?.focus();
  }
};

const handleBackspace = (index: number) => {
  if (!code[index] && index > 0) {
    inputs.value[index - 1]?.focus();
  }
};

const handleJoin = async () => {
  const inviteCode = code.join('');
  if (inviteCode.length !== 6) {
    errorMessage.value = '请输入完整的6位邀请码';
    showError.value = true;
    return;
  }
  
  loading.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    router.replace('/families');
  } catch (e: any) {
    errorMessage.value = e.message || '邀请码无效或已过期';
    showError.value = true;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.join-family {
  min-height: 100vh;
  background: var(--color-background);
  padding: var(--spacing-md);
}

.join-family__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.join-family__header button {
  width: 36px;
  height: 36px;
  background: var(--color-surface);
  border: none;
  border-radius: var(--radius-full);
  font-size: 18px;
  cursor: pointer;
}

.join-family__header h1 {
  font-size: var(--font-size-h4);
  font-weight: var(--font-weight-semibold);
}

.join-family__form {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  text-align: center;
}

.join-family__form h2 {
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-xs);
}

.join-family__form p {
  color: var(--color-text-tertiary);
  font-size: var(--font-size-body-sm);
  margin-bottom: var(--spacing-xl);
}

.join-family__code-inputs {
  display: flex;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
}

.join-family__code-inputs input {
  width: 48px;
  height: 56px;
  text-align: center;
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-bold);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  outline: none;
}

.join-family__code-inputs input:focus {
  border-color: var(--color-primary);
}

.join-family__error-content {
  text-align: center;
}

.join-family__error-content span {
  font-size: 48px;
  display: block;
  margin-bottom: var(--spacing-md);
}
</style>
