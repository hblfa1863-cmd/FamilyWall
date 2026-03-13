<template>
  <div class="create-clan">
    <div class="create-clan__header">
      <button @click="router.back()">←</button>
      <h1>创建家族</h1>
    </div>

    <div class="create-clan__form">
      <div class="create-clan__avatar" @click="chooseAvatar">
        <img v-if="form.avatar" :src="form.avatar" />
        <div v-else>📷</div>
      </div>
      <p>点击上传家族头像</p>

      <FwInput v-model="form.name" placeholder="请输入家族名称 (2-30字符)" :error="errors.name">
        <template #prefix>🏛️</template>
      </FwInput>

      <textarea v-model="form.bio" placeholder="家族简介（选填）" class="create-clan__bio"></textarea>

      <FwButton type="primary" size="lg" block :loading="loading" @click="handleCreate">创建家族</FwButton>
    </div>

    <p class="create-clan__tip">每个用户只能创建1个家族，创建后不可删除</p>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { FwButton, FwInput } from '@/components';

const router = useRouter();
const loading = ref(false);
const form = reactive({ name: '', avatar: '', bio: '' });
const errors = reactive({ name: '' });

const validate = () => {
  errors.name = '';
  if (!form.name) { errors.name = '请输入家族名称'; return false; }
  if (form.name.length < 2 || form.name.length > 30) { errors.name = '家族名称2-30字符'; return false; }
  return true;
};

const handleCreate = async () => {
  if (!validate()) return;
  loading.value = true;
  await new Promise(r => setTimeout(r, 1000));
  router.replace('/clans');
};

const chooseAvatar = () => {};
</script>

<style scoped>
.create-clan { min-height: 100vh; background: var(--color-background); padding: var(--spacing-md); }
.create-clan__header { display: flex; align-items: center; gap: var(--spacing-md); margin-bottom: var(--spacing-xl); }
.create-clan__header button { width: 36px; height: 36px; border-radius: var(--radius-full); border: none; background: var(--color-surface); font-size: 18px; cursor: pointer; }
.create-clan__header h1 { font-size: var(--font-size-h4); font-weight: var(--font-weight-semibold); }
.create-clan__form { background: var(--color-surface); border-radius: var(--radius-xl); padding: var(--spacing-lg); display: flex; flex-direction: column; gap: var(--spacing-md); }
.create-clan__avatar { width: 100px; height: 100px; border-radius: var(--radius-full); overflow: hidden; margin: 0 auto var(--spacing-sm); border: 2px dashed var(--color-border); display: flex; align-items: center; justify-content: center; cursor: pointer; }
.create-clan__avatar img { width: 100%; height: 100%; object-fit: cover; }
.create-clan__avatar div { font-size: 32px; }
.create-clan__form p { text-align: center; font-size: var(--font-size-caption); color: var(--color-text-tertiary); margin-bottom: var(--spacing-sm); }
.create-clan__bio { width: 100%; height: 80px; border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--spacing-md); font-size: var(--font-size-body); resize: none; }
.create-clan__tip { text-align: center; font-size: var(--font-size-caption); color: var(--color-text-tertiary); margin-top: var(--spacing-md); }
</style>
