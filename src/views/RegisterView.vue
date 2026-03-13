<template>
  <div class="register-page">
    <div class="register-page__header">
      <h1 class="register-page__title">注册</h1>
      <p class="register-page__subtitle">创建账号，记录美好回忆</p>
    </div>

    <div class="register-page__form">
      <!-- 邮箱 -->
      <FwInput
        v-model="form.email"
        type="email"
        placeholder="请输入邮箱"
        :error="errors.email"
      >
        <template #prefix>📧</template>
      </FwInput>

      <!-- 验证码 -->
      <div class="register-page__code-input">
        <FwInput
          v-model="form.code"
          type="text"
          placeholder="请输入验证码"
          :error="errors.code"
        >
          <template #prefix>🔢</template>
        </FwInput>
        <button 
          class="register-page__code-btn"
          :disabled="codeCounting"
          @click="sendCode"
        >
          {{ codeCounting ? `${codeSeconds}s` : '获取验证码' }}
        </button>
      </div>

      <!-- 密码 -->
      <FwInput
        v-model="form.password"
        type="password"
        placeholder="设置密码 (8-20位，包含大小写字母和数字)"
        :error="errors.password"
        show-password-toggle
      >
        <template #prefix>🔒</template>
      </FwInput>

      <!-- 确认密码 -->
      <FwInput
        v-model="form.confirmPassword"
        type="password"
        placeholder="请再次输入密码"
        :error="errors.confirmPassword"
        show-password-toggle
      >
        <template #prefix>🔒</template>
      </FwInput>

      <!-- 昵称 -->
      <FwInput
        v-model="form.nickname"
        type="text"
        placeholder="设置昵称 (2-20字符)"
        :error="errors.nickname"
      >
        <template #prefix>👤</template>
      </FwInput>

      <!-- 头像 -->
      <div class="register-page__avatar-section">
        <p class="register-page__label">设置头像 (必填)</p>
        <div class="register-page__avatar-upload" @click="chooseAvatar">
          <img v-if="form.avatar" :src="form.avatar" class="register-page__avatar-preview" />
          <div v-else class="register-page__avatar-placeholder">
            <span>📷</span>
            <span>点击上传</span>
          </div>
        </div>
      </div>

      <!-- 性别 -->
      <div class="register-page__gender-section">
        <p class="register-page__label">性别 (必填)</p>
        <div class="register-page__gender-options">
          <div 
            :class="['register-page__gender-option', { 'register-page__gender-option--active': form.gender === 'male' }]"
            @click="form.gender = 'male'"
          >
            👨 男
          </div>
          <div 
            :class="['register-page__gender-option', { 'register-page__gender-option--active': form.gender === 'female' }]"
            @click="form.gender = 'female'"
          >
            👩 女
          </div>
          <div 
            :class="['register-page__gender-option', { 'register-page__gender-option--active': form.gender === 'unknown' }]"
            @click="form.gender = 'unknown'"
          >
            😐 保密
          </div>
        </div>
        <p v-if="errors.gender" class="register-page__error-text">{{ errors.gender }}</p>
      </div>

      <!-- 生日 -->
      <div class="register-page__birthday-section">
        <p class="register-page__label">生日 (必填)</p>
        <FwInput
          v-model="form.birthday"
          type="date"
          placeholder="选择生日"
          :error="errors.birthday"
        />
      </div>

      <FwButton 
        type="primary" 
        size="lg" 
        block 
        :loading="loading"
        @click="handleRegister"
      >
        注册
      </FwButton>
    </div>

    <div class="register-page__footer">
      <span>已有账号？</span>
      <span class="register-page__link" @click="goToLogin">立即登录</span>
    </div>

    <!-- 错误弹窗 -->
    <FwModal v-model="showError" title="注册失败" size="sm">
      <div class="register-page__error-content">
        <span class="register-page__error-icon">⚠️</span>
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

const loading = ref(false);
const codeCounting = ref(false);
const codeSeconds = ref(60);
const showError = ref(false);
const errorMessage = ref('');

const form = reactive({
  email: '',
  code: '',
  password: '',
  confirmPassword: '',
  nickname: '',
  avatar: '',
  gender: '' as '' | 'male' | 'female' | 'unknown',
  birthday: '',
});

const errors = reactive({
  email: '',
  code: '',
  password: '',
  confirmPassword: '',
  nickname: '',
  gender: '',
  birthday: '',
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
    errors.password = '请设置密码';
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

  // 昵称
  if (!form.nickname) {
    errors.nickname = '请设置昵称';
    valid = false;
  } else if (form.nickname.length < 2 || form.nickname.length > 20) {
    errors.nickname = '昵称2-20字符';
    valid = false;
  }

  // 头像
  if (!form.avatar) {
    showError.value = true;
    errorMessage.value = '请上传头像';
    valid = false;
  }

  // 性别
  if (!form.gender) {
    errors.gender = '请选择性别';
    valid = false;
  }

  // 生日
  if (!form.birthday) {
    errors.birthday = '请选择生日';
    valid = false;
  }

  return valid;
};

const handleRegister = async () => {
  if (!validate()) return;
  
  loading.value = true;
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    router.push('/');
  } catch (error: any) {
    errorMessage.value = error.message || '注册失败，请重试';
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

const chooseAvatar = () => {
  // 选择头像逻辑
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-background) 0%, #E8F6F5 100%);
  padding: var(--spacing-xl) var(--spacing-lg);
}

.register-page__header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.register-page__title {
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin-bottom: var(--spacing-xs);
}

.register-page__subtitle {
  font-size: var(--font-size-body);
  color: var(--color-text-tertiary);
}

.register-page__form {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.register-page__code-input {
  display: flex;
  gap: var(--spacing-sm);
}

.register-page__code-input .fw-input {
  flex: 1;
}

.register-page__code-btn {
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

.register-page__code-btn:hover:not(:disabled) {
  background: var(--color-success-light);
}

.register-page__code-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.register-page__label {
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.register-page__avatar-section {
  margin: var(--spacing-sm) 0;
}

.register-page__avatar-upload {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-full);
  overflow: hidden;
  cursor: pointer;
  border: 2px dashed var(--color-border);
}

.register-page__avatar-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.register-page__avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
  font-size: var(--font-size-tiny);
}

.register-page__gender-section {
  margin: var(--spacing-sm) 0;
}

.register-page__gender-options {
  display: flex;
  gap: var(--spacing-sm);
}

.register-page__gender-option {
  flex: 1;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-body-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.register-page__gender-option--active {
  border-color: var(--color-primary);
  background: var(--color-success-light);
  color: var(--color-primary);
}

.register-page__birthday-section {
  margin: var(--spacing-sm) 0;
}

.register-page__error-text {
  font-size: var(--font-size-caption);
  color: var(--color-danger);
  margin-top: var(--spacing-xs);
}

.register-page__link {
  color: var(--color-primary);
  cursor: pointer;
  margin-left: var(--spacing-xs);
}

.register-page__link:hover {
  text-decoration: underline;
}

.register-page__footer {
  text-align: center;
  margin-top: var(--spacing-lg);
  color: var(--color-text-tertiary);
  font-size: var(--font-size-body-sm);
}

.register-page__error-content {
  text-align: center;
  padding: var(--spacing-md);
}

.register-page__error-icon {
  font-size: 48px;
  display: block;
  margin-bottom: var(--spacing-md);
}
</style>
