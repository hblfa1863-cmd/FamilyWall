<template>
  <div class="forgot-page">
    <div class="forgot-page__header">
      <h1>忘记密码</h1>
      <p>通过邮箱重置密码</p>
    </div>

    <div class="forgot-page__form">
      <!-- 邮箱 -->
      <FwInput
        v-model="form.email"
        type="email"
        placeholder="请输入注册邮箱"
        :error="errors.email"
      >
        <template #prefix>📧</template>
      </FwInput>

      <!-- 验证码 -->
      <div class="forgot-page__code-input">
        <FwInput
          v-model="form.code"
          type="text"
          placeholder="请输入验证码"
          :error="errors.code"
        >
          <template #prefix>🔢</template>
        </FwInput>
        <button 
          class="forgot-page__code-btn"
          :disabled="codeCounting"
          @click="sendCode"
        >
          {{ codeCounting ? `${codeSeconds}s` : '获取验证码' }}
        </button>
      </div>

      <!-- 新密码 -->
      <FwInput
        v-model="form.password"
        type="password"
        placeholder="设置新密码 (8-20位，包含大小写字母和数字)"
        :error="errors.password"
        show-password-toggle
      >
        <template #prefix>🔒</template>
      </FwInput>

      <!-- 确认密码 -->
      <FwInput
        v-model="form.confirmPassword"
        type="password"
        placeholder="请再次输入新密码"
        :error="errors.confirmPassword"
        show-password-toggle
      >
        <template #prefix>🔒</template>
      </FwInput>

      <FwButton 
        type="primary" 
        size="lg" 
        block 
        :loading="loading"
        @click="handleReset"
      >
        重置密码
      </FwButton>
    </div>

    <div class="forgot-page__footer">
      <span>想起密码了？</span>
      <span class="forgot-page__link" @click="goToLogin">立即登录</span>
    </div>

    <!-- 成功弹窗 -->
    <FwModal v-model="showSuccess" title="重置成功" size="sm" :mask-closable="false">
      <div class="forgot-page__success-content">
        <span>✅</span>
        <p>密码重置成功，请使用新密码登录</p>
      </div>
      <template #footer>
        <FwButton type="primary" size="md" @click="goToLogin">去登录</FwButton>
      </template>
    </FwModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { FwButton, FwInput, FwModal } from '@/components';

const router = useRouter();

const loading = ref(false);
const codeCounting = ref(false);
const codeSeconds = ref(60);
const showSuccess = ref(false);

const form = reactive({
  email: '',
  code: '',
  password: '',
  confirmPassword: '',
});

const errors = reactive({
  email: '',
  code: '',
  password: '',
  confirmPassword: '',
});

const validate = () => {
  let valid = true;
  
  // 清空错误
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = '';
  });

  // 邮箱
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email) {
    errors.email = '请输入邮箱';
    valid = false;
  } else if (!emailRegex.test(form.email)) {
    errors.email = '请输入正确的邮箱格式';
    valid = false;
  }

  // 验证码
  if (!form.code) {
    errors.code = '请输入验证码';
    valid = false;
  } else if (form.code.length !== 6) {
    errors.code = '验证码为6位数字';
    valid = false;
  }

  // 密码
  const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/;
  if (!form.password) {
    errors.password = '请设置新密码';
    valid = false;
  } else if (!pwdRegex.test(form.password)) {
    errors.password = '密码需包含大小写字母和数字';
    valid = false;
  }

  // 确认密码
  if (!form.confirmPassword) {
    errors.confirmPassword = '请再次输入密码';
    valid = false;
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = '两次密码输入不一致';
    valid = false;
  }

  return valid;
};

const handleReset = async () => {
  if (!validate()) return;
  
  loading.value = true;
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    showSuccess.value = true;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const sendCode = async () => {
  if (codeCounting.value) return;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email) {
    errors.email = '请先输入邮箱';
    return;
  } else if (!emailRegex.test(form.email)) {
    errors.email = '请输入正确的邮箱格式';
    return;
  }

  codeCounting.value = true;
  codeSeconds.value = 60;
  
  const timer = setInterval(() => {
    codeSeconds.value--;
    if (codeSeconds.value <= 0) {
      clearInterval(timer);
      codeCounting.value = false;
    }
  }, 1000);
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.forgot-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-background) 0%, #E8F6F5 100%);
  padding: var(--spacing-2xl) var(--spacing-lg);
}

.forgot-page__header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.forgot-page__header h1 {
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin-bottom: var(--spacing-xs);
}

.forgot-page__header p {
  font-size: var(--font-size-body);
  color: var(--color-text-tertiary);
}

.forgot-page__form {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.forgot-page__code-input {
  display: flex;
  gap: var(--spacing-sm);
}

.forgot-page__code-input .fw-input {
  flex: 1;
}

.forgot-page__code-btn {
  width: 100px;
  height: 44px;
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  color: var(--color-primary);
  font-size: var(--font-size-body-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.forgot-page__code-btn:hover:not(:disabled) {
  background: var(--color-success-light);
}

.forgot-page__code-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.forgot-page__link {
  color: var(--color-primary);
  cursor: pointer;
  margin-left: var(--spacing-xs);
}

.forgot-page__link:hover {
  text-decoration: underline;
}

.forgot-page__footer {
  text-align: center;
  margin-top: var(--spacing-lg);
  color: var(--color-text-tertiary);
  font-size: var(--font-size-body-sm);
}

.forgot-page__success-content {
  text-align: center;
  padding: var(--spacing-md);
}

.forgot-page__success-content span {
  font-size: 48px;
  display: block;
  margin-bottom: var(--spacing-md);
}
</style>
