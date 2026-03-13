<template>
  <div class="create-family">
    <div class="create-family__header">
      <button @click="router.back()">←</button>
      <h1>创建家庭</h1>
      <span></span>
    </div>

    <div class="create-family__form">
      <!-- 家庭头像 -->
      <div class="create-family__avatar-section">
        <div class="create-family__avatar" @click="chooseAvatar">
          <img v-if="form.avatar" :src="form.avatar" />
          <div v-else class="create-family__avatar-placeholder">📷</div>
        </div>
        <p>点击上传家庭头像</p>
      </div>

      <!-- 家庭名称 -->
      <FwInput
        v-model="form.name"
        placeholder="请输入家庭名称 (2-30字符)"
        :error="errors.name"
      >
        <template #prefix>🏠</template>
      </FwInput>

      <FwButton type="primary" size="lg" block :loading="loading" @click="handleCreate">
        创建家庭
      </FwButton>
    </div>

    <!-- 错误提示 -->
    <FwModal v-model="showError" title="创建失败" size="sm">
      <div class="create-family__error-content">
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
import { ref, reactive } from 'vue';
import { FwButton, FwInput, FwModal } from '@/components';

const router = useRouter();
const loading = ref(false);
const showError = ref(false);
const errorMessage = ref('');

const form = reactive({
  name: '',
  avatar: '',
});

const errors = reactive({
  name: '',
});

const validate = () => {
  errors.name = '';
  if (!form.name) {
    errors.name = '请输入家庭名称';
    return false;
  }
  if (form.name.length < 2 || form.name.length > 30) {
    errors.name = '家庭名称2-30字符';
    return false;
  }
  return true;
};

const handleCreate = async () => {
  if (!validate()) return;
  
  loading.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    router.replace('/families');
  } catch (e: unknown) {
    errorMessage.value = e.message || '创建失败';
    showError.value = true;
  } finally {
    loading.value = false;
  }
};

const chooseAvatar = () => {
  // 选择头像逻辑
};
</script>

<style scoped>
.create-family {
  min-height: 100vh;
  background: var(--color-background);
  padding: var(--spacing-md);
}

.create-family__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.create-family__header button {
  width: 36px;
  height: 36px;
  background: var(--color-surface);
  border: none;
  border-radius: var(--radius-full);
  font-size: 18px;
  cursor: pointer;
}

.create-family__header h1 {
  font-size: var(--font-size-h4);
  font-weight: var(--font-weight-semibold);
}

.create-family__form {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.create-family__avatar-section {
  text-align: center;
  margin-bottom: var(--spacing-md);
}

.create-family__avatar {
  width: 100px;
  height: 100px;
  border-radius: var(--radius-full);
  overflow: hidden;
  margin: 0 auto var(--spacing-sm);
  border: 2px dashed var(--color-border);
  cursor: pointer;
}

.create-family__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.create-family__avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
}

.create-family__avatar-section p {
  font-size: var(--font-size-caption);
  color: var(--color-text-tertiary);
}

.create-family__error-content {
  text-align: center;
}

.create-family__error-content span {
  font-size: 48px;
  display: block;
  margin-bottom: var(--spacing-md);
}
</style>
