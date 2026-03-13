<template>
  <div class="settings-page">
    <div class="settings-page__header">
      <button @click="router.back()">←</button>
      <h1>设置</h1>
    </div>

    <!-- 账号设置 -->
    <div class="settings-page__section">
      <div class="settings-page__title">账号设置</div>
      <div class="settings-page__item" @click="router.push('/profile/edit')">
        <span>👤</span>
        <span>个人资料</span>
        <span>›</span>
      </div>
      <div class="settings-page__item" @click="showPasswordModal = true">
        <span>🔐</span>
        <span>修改密码</span>
        <span>›</span>
      </div>
      <div class="settings-page__item" @click="router.push('/settings/bind')">
        <span>🔗</span>
        <span>账号绑定</span>
        <span>›</span>
      </div>
    </div>

    <!-- 通知设置 -->
    <div class="settings-page__section">
      <div class="settings-page__title">通知设置</div>
      <div class="settings-page__item">
        <span>🔔</span>
        <span>接收评论通知</span>
        <label class="settings-page__switch">
          <input type="checkbox" v-model="settings.commentNotify" />
          <span></span>
        </label>
      </div>
      <div class="settings-page__item">
        <span>❤️</span>
        <span>接收点赞通知</span>
        <label class="settings-page__switch">
          <input type="checkbox" v-model="settings.likeNotify" />
          <span></span>
        </label>
      </div>
      <div class="settings-page__item">
        <span>@</span>
        <span>接收@通知</span>
        <label class="settings-page__switch">
          <input type="checkbox" v-model="settings.mentionNotify" />
          <span></span>
        </label>
      </div>
    </div>

    <!-- 隐私设置 -->
    <div class="settings-page__section">
      <div class="settings-page__title">隐私设置</div>
      <div class="settings-page__item">
        <span>👁</span>
        <span>主页可见范围</span>
        <span>›</span>
      </div>
      <div class="settings-page__item">
        <span>📍</span>
        <span>展示位置信息</span>
        <label class="settings-page__switch">
          <input type="checkbox" v-model="settings.showLocation" />
          <span></span>
        </label>
      </div>
    </div>

    <!-- 其他 -->
    <div class="settings-page__section">
      <div class="settings-page__title">其他</div>
      <div class="settings-page__item" @click="router.push('/privacy')">
        <span>📜</span>
        <span>隐私政策</span>
        <span>›</span>
      </div>
      <div class="settings-page__item" @click="router.push('/terms')">
        <span>📋</span>
        <span>用户协议</span>
        <span>›</span>
      </div>
      <div class="settings-page__item" @click="router.push('/about')">
        <span>ℹ️</span>
        <span>关于我们</span>
        <span>›</span>
      </div>
    </div>

    <!-- 退出登录 -->
    <div class="settings-page__section">
      <div class="settings-page__item settings-page__item--danger" @click="handleLogout">
        <span>📴</span>
        <span>退出登录</span>
      </div>
      <div class="settings-page__item settings-page__item--danger" @click="showDeactivateModal = true">
        <span>🗑️</span>
        <span>注销账号</span>
      </div>
    </div>

    <!-- 版本信息 -->
    <div class="settings-page__version">Version 1.0.0</div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

const router = useRouter();
const showPasswordModal = ref(false);
const showDeactivateModal = ref(false);

const settings = reactive({
  commentNotify: true,
  likeNotify: true,
  mentionNotify: true,
  showLocation: true,
});

const handleLogout = () => {
  router.push('/login');
};
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  background: var(--color-background);
  padding: var(--spacing-md);
  padding-bottom: var(--tabbar-height);
}

.settings-page__header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.settings-page__header button {
  width: 36px;
  height: 36px;
  background: var(--color-surface);
  border: none;
  border-radius: var(--radius-full);
  font-size: 18px;
  cursor: pointer;
}

.settings-page__header h1 {
  font-size: var(--font-size-h4);
  font-weight: var(--font-weight-semibold);
}

.settings-page__section {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  margin-bottom: var(--spacing-md);
  overflow: hidden;
}

.settings-page__title {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-caption);
  color: var(--color-text-tertiary);
  background: var(--color-background);
}

.settings-page__item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  font-size: var(--font-size-body);
  cursor: pointer;
}

.settings-page__item:last-child {
  border-bottom: none;
}

.settings-page__item span:first-child {
  font-size: 20px;
}

.settings-page__item span:nth-child(2) {
  flex: 1;
}

.settings-page__item span:last-child {
  color: var(--color-text-tertiary);
  font-size: 18px;
}

.settings-page__item--danger {
  color: var(--color-danger);
}

/* 开关 */
.settings-page__switch {
  position: relative;
  width: 48px;
  height: 28px;
}

.settings-page__switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.settings-page__switch span {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-border);
  transition: var(--transition-normal);
  border-radius: 28px;
}

.settings-page__switch span::before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 3px;
  bottom: 3px;
  background: white;
  transition: var(--transition-normal);
  border-radius: 50%;
}

.settings-page__switch input:checked + span {
  background: var(--color-primary);
}

.settings-page__switch input:checked + span::before {
  transform: translateX(20px);
}

.settings-page__version {
  text-align: center;
  color: var(--color-text-tertiary);
  font-size: var(--font-size-caption);
  padding: var(--spacing-xl);
}
</style>
