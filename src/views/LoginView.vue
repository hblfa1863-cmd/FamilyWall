<template>
  <div class="login-page">
    <div class="login-page__logo">
      <span class="login-page__logo-icon">🏠</span>
      <h1 class="login-page__title">FamilyWall</h1>
      <p class="login-page__subtitle">记录家庭美好回忆</p>
    </div>

    <div class="login-page__form">
      <div class="login-page__tabs">
        <span 
          :class="['login-page__tab', { 'login-page__tab--active': loginType === 'password' }]"
          @click="loginType = 'password'"
        >
          密码登录
        </span>
        <span 
          :class="['login-page__tab', { 'login-page__tab--active': loginType === 'code' }]"
          @click="loginType = 'code'"
        >
          验证码登录
        </span>
      </div>

      <!-- 密码登录 -->
      <div v-if="loginType === 'password'" class="login-page__inputs">
        <FwInput
          v-model="form.email"
          type="email"
          placeholder="请输入邮箱"
          :error="errors.email"
        >
          <template #prefix>📧</template>
        </FwInput>

        <FwInput
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
          :error="errors.password"
          show-password-toggle
        >
          <template #prefix>🔒</template>
        </FwInput>
      </div>

      <!-- 验证码登录 -->
      <div v-else class="login-page__inputs">
        <FwInput
          v-model="form.email"
          type="email"
          placeholder="请输入邮箱"
          :error="errors.email"
        >
          <template #prefix>📧</template>
        </FwInput>

        <div class="login-page__code-input">
          <FwInput
            v-model="form.code"
            type="text"
            placeholder="请输入验证码"
            :error="errors.code"
          >
            <template #prefix>🔢</template>
          </FwInput>
          <button 
            class="login-page__code-btn"
            :disabled="codeCounting"
            @click="sendCode"
          >
            {{ codeCounting ? `${codeSeconds}s` : '获取验证码' }}
          </button>
        </div>
      </div>

      <div class="login-page__forgot">
        <span class="login-page__link" @click="goToForgot">忘记密码？</span>
      </div>

      <FwButton 
        type="primary" 
        size="lg" 
        block 
        :loading="loading"
        @click="handleLogin"
      >
        登录
      </FwButton>

      <div class="login-page__divider">
        <span>或</span>
      </div>

      <FwButton 
        type="secondary" 
        size="lg" 
        block
        @click="handleWechatLogin"
      >
        <template #icon>💬</template>
        微信登录
      </FwButton>
    </div>

    <div class="login-page__footer">
      <span>还没有账号？</span>
      <span class="login-page__link" @click="goToRegister">立即注册</span>
    </div>

    <!-- 错误弹窗 -->
    <FwModal v-model="showError" title="登录失败" size="sm">
      <div class="login-page__error-content">
        <span class="login-page__error-icon">⚠️</span>
        <p>{{ errorMessage }}</p>
      </div>
      <template #footer>
        <FwButton type="primary" size="md" @click="showError = false">确定</FwButton>
      </template>
    </FwModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { FwButton, FwInput, FwModal } from '@/components';

const router = useRouter();

const loginType = ref<'password' | 'code'>('password');
const loading = ref(false);
const codeCounting = ref(false);
const codeSeconds = ref(60);
const showError = ref(false);
const errorMessage = ref('');

const form = reactive({
  email: '',
  password: '',
  code: '',
});

const errors = reactive({
  email: '',
  password: '',
  code: '',
});

const validate = () => {
  let valid = true;
  errors.email = '';
  errors.password = '';
  errors.code = '';

  // 邮箱验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email) {
    errors.email = '请输入邮箱';
    valid = false;
  } else if (!emailRegex.test(form.email)) {
    errors.email = '请输入正确的邮箱格式';
    valid = false;
  }

  if (loginType.value === 'password') {
    if (!form.password) {
      errors.password = '请输入密码';
      valid = false;
    } else if (form.password.length < 6) {
      errors.password = '密码至少6位';
      valid = false;
    }
  } else {
    if (!form.code) {
      errors.code = '请输入验证码';
      valid = false;
    } else if (form.code.length !== 6) {
      errors.code = '验证码为6位数字';
      valid = false;
    }
  }

  return valid;
};

const handleLogin = async () => {
  if (!validate()) return;
  
  loading.value = true;
  
  try {
    // 模拟登录
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 登录成功跳转
    router.push('/');
  } catch (error: any) {
    errorMessage.value = error.message || '登录失败，请重试';
    showError.value = true;
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

const handleWechatLogin = () => {
  // 微信登录逻辑
};

const goToForgot = () => {
  router.push('/forgot-password');
};

const goToRegister = () => {
  router.push('/register');
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-background) 0%, #E8F6F5 100%);
  display: flex;
  flex-direction: column;
  padding: var(--spacing-2xl) var(--spacing-lg);
}

.login-page__logo {
  text-align: center;
  margin-top: var(--spacing-3xl);
  margin-bottom: var(--spacing-2xl);
}

.login-page__logo-icon {
  font-size: 64px;
  display: block;
  margin-bottom: var(--spacing-md);
}

.login-page__title {
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin-bottom: var(--spacing-xs);
}

.login-page__subtitle {
  font-size: var(--font-size-body);
  color: var(--color-text-tertiary);
}

.login-page__form {
  flex: 1;
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-lg);
}

.login-page__tabs {
  display: flex;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--spacing-md);
}

.login-page__tab {
  flex: 1;
  text-align: center;
  font-size: var(--font-size-body);
  color: var(--color-text-tertiary);
  cursor: pointer;
  padding-bottom: var(--spacing-sm);
  position: relative;
}

.login-page__tab--active {
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}

.login-page__tab--active::after {
  content: '';
  position: absolute;
  bottom: -13px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-primary);
  border-radius: 1px;
}

.login-page__inputs {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.login-page__code-input {
  display: flex;
  gap: var(--spacing-sm);
}

.login-page__code-input .fw-input {
  flex: 1;
}

.login-page__code-btn {
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

.login-page__code-btn:hover:not(:disabled) {
  background: var(--color-success-light);
}

.login-page__code-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-page__forgot {
  display: flex;
  justify-content: flex-end;
  margin: var(--spacing-md) 0;
}

.login-page__link {
  color: var(--color-primary);
  cursor: pointer;
  font-size: var(--font-size-body-sm);
}

.login-page__link:hover {
  text-decoration: underline;
}

.login-page__divider {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin: var(--spacing-lg) 0;
  color: var(--color-text-tertiary);
  font-size: var(--font-size-body-sm);
}

.login-page__divider::before,
.login-page__divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-border);
}

.login-page__footer {
  text-align: center;
  margin-top: var(--spacing-lg);
  color: var(--color-text-tertiary);
  font-size: var(--font-size-body-sm);
}

.login-page__error-content {
  text-align: center;
  padding: var(--spacing-md);
}

.login-page__error-icon {
  font-size: 48px;
  display: block;
  margin-bottom: var(--spacing-md);
}

.login-page__error-content p {
  color: var(--color-text-secondary);
}
</style>
