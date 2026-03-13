<template>
  <div class="create-note">
    <div class="create-note__header">
      <button @click="router.back()">取消</button>
      <h1>创建笔记</h1>
      <button :disabled="!canPublish" @click="handlePublish">发布</button>
    </div>

    <div class="create-note__content">
      <!-- 可见范围 -->
      <div class="create-note__visibility">
        <span>可见范围</span>
        <div class="create-note__visibility-options">
          <span :class="{ active: form.visibility === 'family' }" @click="form.visibility = 'family'">家庭可见</span>
          <span :class="{ active: form.visibility === 'clan' }" @click="form.visibility = 'clan'">家族可见</span>
        </div>
      </div>

      <!-- 标题 -->
      <input v-model="form.title" class="create-note__title" placeholder="添加标题..." />

      <!-- 正文 -->
      <textarea v-model="form.content" class="create-note__body" placeholder="记录今天的美好时光..."></textarea>

      <!-- 图片 -->
      <div class="create-note__media">
        <div class="create-note__images">
          <div v-for="(img, idx) in form.images" :key="idx" class="create-note__image-item">
            <img :src="img" />
            <button @click="removeImage(idx)">×</button>
          </div>
          <div v-if="form.images.length < 50" class="create-note__image-add" @click="addImages">
            <span>+</span>
          </div>
        </div>
        <p class="create-note__media-tip">图片 {{ form.images.length }}/50 · 视频 {{ form.videos.length }}/5</p>
      </div>

      <!-- 视频 -->
      <div v-if="form.videos.length > 0" class="create-note__videos">
        <div v-for="(video, idx) in form.videos" :key="idx" class="create-note__video-item">
          <video :src="video"></video>
          <button @click="removeVideo(idx)">×</button>
        </div>
      </div>

      <!-- 位置 -->
      <div class="create-note__location" @click="showLocationPicker = true">
        <span>📍</span>
        <span>{{ form.location ? form.location.name : '添加位置' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';

const router = useRouter();
const showLocationPicker = ref(false);
const form = reactive({
  title: '',
  content: '',
  visibility: 'family' as 'family' | 'clan',
  images: [] as string[],
  videos: [] as string[],
  location: null as null | { id: number; name: string },
});

const canPublish = computed(() => form.title.trim() && form.content.trim());

const addImages = () => { /* 上传图片 */ };
const removeImage = (idx: number) => form.images.splice(idx, 1);
const removeVideo = (idx: number) => form.videos.splice(idx, 1);
const handlePublish = async () => {
  await new Promise(r => setTimeout(r, 1000));
  router.back();
};
</script>

<style scoped>
.create-note { min-height: 100vh; background: var(--color-background); }
.create-note__header { display: flex; justify-content: space-between; align-items: center; padding: var(--spacing-md); background: var(--color-surface); position: sticky; top: 0; z-index: 100; }
.create-note__header button { background: none; border: none; font-size: var(--font-size-body); cursor: pointer; color: var(--color-text-tertiary); }
.create-note__header button:last-child { color: var(--color-primary); font-weight: var(--font-weight-medium); }
.create-note__header button:disabled { color: var(--color-text-disabled); }
.create-note__header h1 { font-size: var(--font-size-h5); font-weight: var(--font-weight-semibold); }
.create-note__content { padding: var(--spacing-md); }
.create-note__visibility { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--spacing-md); }
.create-note__visibility span { font-size: var(--font-size-body-sm); color: var(--color-text-tertiary); }
.create-note__visibility-options { display: flex; gap: var(--spacing-sm); }
.create-note__visibility-options span { padding: var(--spacing-xs) var(--spacing-md); border-radius: var(--radius-lg); font-size: var(--font-size-body-sm); border: 1px solid var(--color-border); }
.create-note__visibility-options span.active { background: var(--color-primary); color: white; border-color: var(--color-primary); }
.create-note__title { width: 100%; border: none; background: none; font-size: var(--font-size-h4); font-weight: var(--font-weight-bold); margin-bottom: var(--spacing-md); outline: none; }
.create-note__body { width: 100%; min-height: 200px; border: none; background: none; font-size: var(--font-size-body); line-height: 1.8; resize: none; outline: none; margin-bottom: var(--spacing-md); }
.create-note__media { margin-bottom: var(--spacing-md); }
.create-note__images { display: flex; flex-wrap: wrap; gap: var(--spacing-xs); }
.create-note__image-item { position: relative; width: 80px; height: 80px; }
.create-note__image-item img { width: 100%; height: 100%; object-fit: cover; border-radius: var(--radius-md); }
.create-note__image-item button { position: absolute; top: 4px; right: 4px; width: 20px; height: 20px; background: rgba(0,0,0,0.5); color: white; border: none; border-radius: 50%; cursor: pointer; }
.create-note__image-add { width: 80px; height: 80px; border: 2px dashed var(--color-border); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; cursor: pointer; }
.create-note__image-add span { font-size: 24px; color: var(--color-text-tertiary); }
.create-note__media-tip { font-size: var(--font-size-caption); color: var(--color-text-tertiary); margin-top: var(--spacing-xs); }
.create-note__location { display: flex; align-items: center; gap: var(--spacing-sm); padding: var(--spacing-md); background: var(--color-surface); border-radius: var(--radius-lg); font-size: var(--font-size-body-sm); cursor: pointer; }
</style>
