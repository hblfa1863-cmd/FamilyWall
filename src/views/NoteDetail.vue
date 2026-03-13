<template>
  <div class="note-detail">
    <!-- 顶部导航 -->
    <div class="note-detail__header safe-area-top">
      <button class="note-detail__back" @click="router.back()">←</button>
      <div class="note-detail__actions">
        <button v-if="isAuthor" @click="handleEdit">编辑</button>
        <button v-if="isAuthor || isAdmin" @click="handleDelete">删除</button>
        <button @click="showShare = true">分享</button>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="note-detail__content">
      <!-- 媒体区域 -->
      <div class="note-detail__media">
        <!-- 图片轮播 -->
        <div v-if="note.images && note.images.length > 0" class="note-detail__gallery">
          <div class="note-detail__gallery-main">
            <img 
              :src="note.images[currentImageIndex].url" 
              class="note-detail__gallery-image"
              @click="showImagePreview = true"
            />
            <div v-if="note.images.length > 1" class="note-detail__gallery-nav">
              <button 
                class="note-detail__gallery-btn"
                @click="prevImage"
              >‹</button>
              <span>{{ currentImageIndex + 1 }}/{{ note.images.length }}</span>
              <button 
                class="note-detail__gallery-btn"
                @click="nextImage"
              >›</button>
            </div>
          </div>
          <div v-if="note.images.length > 1" class="note-detail__gallery-thumbs">
            <div 
              v-for="(img, idx) in note.images" 
              :key="idx"
              :class="['note-detail__gallery-thumb', { 'note-detail__gallery-thumb--active': idx === currentImageIndex }]"
              @click="currentImageIndex = idx"
            >
              <img :src="img.url" />
            </div>
          </div>
        </div>
        
        <!-- 视频 -->
        <div v-if="note.videos && note.videos.length > 0" class="note-detail__video">
          <video 
            v-for="video in note.videos" 
            :key="video.id"
            :src="video.url"
            controls
            class="note-detail__video-item"
          ></video>
        </div>
      </div>

      <!-- 作者信息 -->
      <div class="note-detail__author">
        <FwAvatar :src="note.author.avatar" :name="note.author.nickname" size="lg" />
        <div class="note-detail__author-info">
          <span class="note-detail__author-name">{{ note.author.nickname }}</span>
          <span class="note-detail__author-time">{{ formatTime(note.createdAt) }}</span>
        </div>
        <div class="note-detail__visibility">
          <FwTag v-if="note.visibility === 'clan'" type="clan">家族可见</FwTag>
        </div>
      </div>

      <!-- 位置信息 -->
      <div v-if="note.location" class="note-detail__location" @click="goToMap">
        <span class="note-detail__location-icon">📍</span>
        <span>{{ note.location.name }}</span>
        <span class="note-detail__location-arrow">›</span>
      </div>

      <!-- 标题 -->
      <h1 class="note-detail__title">{{ note.title }}</h1>

      <!-- 正文 -->
      <div class="note-detail__body" v-html="note.content"></div>

      <!-- 互动区域 -->
      <div class="note-detail__interaction">
        <button 
          :class="['note-detail__action', { 'note-detail__action--active': note.isLiked }]"
          @click="handleLike"
        >
          <span>{{ note.isLiked ? '❤️' : '🤍' }}</span>
          <span>{{ note.likesCount }}</span>
        </button>
        
        <button class="note-detail__action" @click="scrollToComments">
          <span>💬</span>
          <span>{{ note.commentsCount }}</span>
        </button>
        
        <button class="note-detail__action" @click="showShare = true">
          <span>📤</span>
          <span>分享</span>
        </button>
      </div>

      <!-- 评论区域 -->
      <div ref="commentsRef" class="note-detail__comments">
        <h3 class="note-detail__comments-title">评论 ({{ comments.length }})</h3>
        
        <!-- 评论列表 -->
        <div v-if="comments.length > 0" class="note-detail__comments-list">
          <div 
            v-for="comment in comments" 
            :key="comment.id"
            class="note-detail__comment"
          >
            <FwAvatar :src="comment.author.avatar" :name="comment.author.nickname" size="sm" />
            <div class="note-detail__comment-content">
              <div class="note-detail__comment-header">
                <span class="note-detail__comment-author">{{ comment.author.nickname }}</span>
                <span class="note-detail__comment-time">{{ formatTime(comment.createdAt) }}</span>
              </div>
              <p class="note-detail__comment-text">
                <span v-if="comment.replyTo" class="note-detail__comment-reply">
                  @{{ comment.replyTo.nickname }}
                </span>
                {{ comment.content }}
              </p>
              <div class="note-detail__comment-actions">
                <button @click="handleReply(comment)">回复</button>
                <button 
                  v-if="comment.author.id === currentUserId"
                  @click="handleDeleteComment(comment.id)"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 空评论 -->
        <div v-else class="note-detail__comments-empty">
          还没有评论，快来抢沙发吧～
        </div>

        <!-- 评论输入框 -->
        <div class="note-detail__comment-input">
          <FwAvatar :src="currentUser.avatar" :name="currentUser.nickname" size="sm" />
          <input 
            v-model="commentText"
            type="text"
            :placeholder="replyTo ? `回复 @${replyTo.author.nickname}` : '说点什么...'"
            @keyup.enter="handleSubmitComment"
          />
          <button 
            :disabled="!commentText.trim()"
            @click="handleSubmitComment"
          >
            发送
          </button>
        </div>
      </div>
    </div>

    <!-- 图片预览 -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showImagePreview" class="note-detail__preview" @click="showImagePreview = false">
          <button class="note-detail__preview-close">×</button>
          <img :src="note.images[currentImageIndex].url" />
        </div>
      </Transition>
    </Teleport>

    <!-- 删除确认 -->
    <FwConfirm
      v-model="showDeleteConfirm"
      title="删除笔记"
      message="确定要删除这条笔记吗？删除后无法恢复。"
      type="danger"
      confirm-text="删除"
      @confirm="confirmDelete"
    />

    <!-- 分享面板 -->
    <Teleport to="body">
      <Transition name="slide-up">
        <div v-if="showShare" class="note-detail__share-mask" @click="showShare = false">
          <div class="note-detail__share-panel" @click.stop>
            <div class="note-detail__share-title">分享到</div>
            <div class="note-detail__share-options">
              <button class="note-detail__share-option">
                <span>💬</span>
                <span>微信</span>
              </button>
              <button class="note-detail__share-option">
                <span>📱</span>
                <span>朋友圈</span>
              </button>
              <button class="note-detail__share-option">
                <span>🔗</span>
                <span>复制链接</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth';
import { FwAvatar, FwTag, FwConfirm } from '@/components';

interface NoteImage {
  id: number;
  url: string;
}

interface NoteVideo {
  id: number;
  url: string;
  cover: string;
}

interface Author {
  id: number;
  nickname: string;
  avatar: string;
}

interface Location {
  id: number;
  name: string;
}

interface Comment {
  id: number;
  author: Author;
  content: string;
  createdAt: string;
  replyTo?: Author;
}

const props = defineProps<{
  noteId: number;
}>();

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// 从 API 获取
const loading = ref(true);

const fetchNote = async () => {
  try {
    const res = await api.getNote(props.noteId);
    if (res.success && res.data) {
      note.value = res.data;
    }
  } catch (e) { console.error(e); }
  finally { loading.value = false; }
};

onMounted(() => { fetchNote(); });

// 模拟数据
const note = ref({
  id: props.noteId,
  title: '春节家庭团聚',
  content: '<p>今天是个特殊的日子，我们全家团聚在一起，吃了一顿丰盛的年夜饭。🎉</p><p>大家一起聊天、看电视、包饺子，度过了一个温馨的夜晚。</p><p>新的一年，祝愿家人身体健康，万事如意！</p>',
  images: [
    { id: 1, url: 'https://picsum.photos/800/600?random=1' },
    { id: 2, url: 'https://picsum.photos/800/600?random=2' },
    { id: 3, url: 'https://picsum.photos/800/600?random=3' },
    { id: 4, url: 'https://picsum.photos/800/600?random=4' },
  ],
  videos: [],
  author: { id: 1, nickname: '张三', avatar: '' },
  location: { id: 1, name: '北京某餐厅' },
  visibility: 'family' as const,
  isLiked: false,
  likesCount: 12,
  commentsCount: 5,
  createdAt: '2024-02-10T18:00:00Z',
});

const comments = ref<Comment[]>([
  {
    id: 1,
    author: { id: 2, nickname: '李四', avatar: '' },
    content: '好温馨的家庭聚会！',
    createdAt: '2024-02-10T19:00:00Z',
  },
  {
    id: 2,
    author: { id: 3, nickname: '王五', avatar: '' },
    content: '拍得真好看！',
    createdAt: '2024-02-10T20:00:00Z',
  },
]);

const currentUserId = 1;
const currentUser = ref({ id: 1, nickname: '张三', avatar: '' });
const isAuthor = computed(() => note.value.author.id === currentUserId);
const isAdmin = ref(false); // 家族管理员

const currentImageIndex = ref(0);
const showImagePreview = ref(false);
const showDeleteConfirm = ref(false);
const showShare = ref(false);
const commentText = ref('');
const replyTo = ref<Comment | null>(null);
const commentsRef = ref<HTMLElement | null>(null);

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', { 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const prevImage = () => {
  currentImageIndex.value = currentImageIndex.value > 0 
    ? currentImageIndex.value - 1 
    : note.value.images.length - 1;
};

const nextImage = () => {
  currentImageIndex.value = currentImageIndex.value < note.value.images.length - 1 
    ? currentImageIndex.value + 1 
    : 0;
};

const handleLike = () => {
  note.value.isLiked = !note.value.isLiked;
  note.value.likesCount += note.value.isLiked ? 1 : -1;
};

const scrollToComments = () => {
  commentsRef.value?.scrollIntoView({ behavior: 'smooth' });
};

const handleReply = (comment: Comment) => {
  replyTo.value = comment;
};

const handleSubmitComment = () => {
  if (!commentText.value.trim()) return;
  
  // 提交评论逻辑
  commentText.value = '';
  replyTo.value = null;
};

const handleDeleteComment = (commentId: number) => {
  // 删除评论逻辑
};

const handleEdit = () => {
  router.push(`/notes/${props.noteId}/edit`);
};

const handleDelete = () => {
  showDeleteConfirm.value = true;
};

const confirmDelete = () => {
  router.back();
};

const goToMap = () => {
  router.push(`/map?location=${note.value.location.id}`);
};
</script>

<style scoped>
.note-detail {
  min-height: 100vh;
  background: var(--color-background);
}

.note-detail__header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent);
  z-index: 100;
}

.note-detail__back {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background: rgba(255,255,255,0.9);
  border: none;
  font-size: 18px;
  cursor: pointer;
}

.note-detail__actions {
  display: flex;
  gap: var(--spacing-sm);
}

.note-detail__actions button {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: rgba(255,255,255,0.9);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-body-sm);
  cursor: pointer;
}

.note-detail__content {
  padding-bottom: 100px;
}

/* 媒体 */
.note-detail__media {
  margin-bottom: var(--spacing-md);
}

.note-detail__gallery {}

.note-detail__gallery-main {
  position: relative;
}

.note-detail__gallery-image {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: contain;
  background: #000;
}

.note-detail__gallery-nav {
  position: absolute;
  bottom: var(--spacing-md);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  background: rgba(0,0,0,0.5);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-lg);
  color: white;
}

.note-detail__gallery-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
}

.note-detail__gallery-thumbs {
  display: flex;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  overflow-x: auto;
}

.note-detail__gallery-thumb {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  opacity: 0.6;
  flex-shrink: 0;
}

.note-detail__gallery-thumb--active {
  opacity: 1;
  border: 2px solid var(--color-primary);
}

.note-detail__gallery-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 作者 */
.note-detail__author {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
}

.note-detail__author-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.note-detail__author-name {
  font-weight: var(--font-weight-semibold);
}

.note-detail__author-time {
  font-size: var(--font-size-caption);
  color: var(--color-text-tertiary);
}

/* 位置 */
.note-detail__location {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin: 0 var(--spacing-md) var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-background);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-body-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
}

.note-detail__location-icon {
  font-size: 14px;
}

.note-detail__location-arrow {
  margin-left: auto;
}

/* 标题 */
.note-detail__title {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
  padding: 0 var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

/* 正文 */
.note-detail__body {
  padding: 0 var(--spacing-md) var(--spacing-md);
  font-size: var(--font-size-body);
  line-height: 1.8;
  color: var(--color-text-secondary);
}

.note-detail__body :deep(p) {
  margin-bottom: var(--spacing-md);
}

/* 互动 */
.note-detail__interaction {
  display: flex;
  justify-content: space-around;
  padding: var(--spacing-md);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.note-detail__action {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: none;
  border: none;
  font-size: var(--font-size-body);
  color: var(--color-text-tertiary);
  cursor: pointer;
}

.note-detail__action--active {
  color: var(--color-danger);
}

/* 评论 */
.note-detail__comments {
  padding: var(--spacing-md);
}

.note-detail__comments-title {
  font-size: var(--font-size-h5);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-md);
}

.note-detail__comments-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.note-detail__comment {
  display: flex;
  gap: var(--spacing-sm);
}

.note-detail__comment-content {
  flex: 1;
}

.note-detail__comment-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: 2px;
}

.note-detail__comment-author {
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-medium);
}

.note-detail__comment-time {
  font-size: var(--font-size-tiny);
  color: var(--color-text-tertiary);
}

.note-detail__comment-text {
  font-size: var(--font-size-body-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
}

.note-detail__comment-reply {
  color: var(--color-primary);
  margin-right: var(--spacing-xs);
}

.note-detail__comment-actions {
  display: flex;
  gap: var(--spacing-md);
}

.note-detail__comment-actions button {
  background: none;
  border: none;
  font-size: var(--font-size-tiny);
  color: var(--color-text-tertiary);
  cursor: pointer;
}

.note-detail__comments-empty {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-tertiary);
}

.note-detail__comment-input {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  position: fixed;
  bottom: var(--tabbar-height);
  left: var(--spacing-md);
  right: var(--spacing-md);
  box-shadow: var(--shadow-lg);
}

.note-detail__comment-input input {
  flex: 1;
  height: 40px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 0 var(--spacing-md);
  font-size: var(--font-size-body-sm);
  outline: none;
}

.note-detail__comment-input input:focus {
  border-color: var(--color-primary);
}

.note-detail__comment-input button {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-body-sm);
  cursor: pointer;
}

.note-detail__comment-input button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 图片预览 */
.note-detail__preview {
  position: fixed;
  inset: 0;
  background: #000;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.note-detail__preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.note-detail__preview-close {
  position: absolute;
  top: calc(env(safe-area-inset-top) + var(--spacing-md));
  right: var(--spacing-md);
  width: 36px;
  height: 36px;
  background: rgba(255,255,255,0.2);
  border: none;
  border-radius: var(--radius-full);
  color: white;
  font-size: 20px;
  cursor: pointer;
}

/* 分享面板 */
.note-detail__share-mask {
  position: fixed;
  inset: 0;
  background: var(--color-mask);
  z-index: 2000;
  display: flex;
  align-items: flex-end;
}

.note-detail__share-panel {
  width: 100%;
  background: var(--color-surface);
  border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
  padding: var(--spacing-lg);
  padding-bottom: calc(var(--spacing-lg) + env(safe-area-inset-bottom));
}

.note-detail__share-title {
  text-align: center;
  font-size: var(--font-size-h5);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-lg);
}

.note-detail__share-options {
  display: flex;
  justify-content: space-around;
}

.note-detail__share-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  background: none;
  border: none;
  cursor: pointer;
}

.note-detail__share-option span:first-child {
  width: 56px;
  height: 56px;
  background: var(--color-background);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.note-detail__share-option span:last-child {
  font-size: var(--font-size-caption);
  color: var(--color-text-secondary);
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-normal);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform var(--transition-normal), opacity var(--transition-normal);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
