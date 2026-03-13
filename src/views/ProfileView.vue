<template>
  <div class="profile-page">
    <!-- 头部信息 -->
    <div class="profile-page__header">
      <div class="profile-page__cover"></div>
      <div class="profile-page__info">
        <FwAvatar :src="user.avatar" :name="user.nickname" size="xl" />
        <h1 class="profile-page__name">{{ user.nickname }}</h1>
        <p class="profile-page__bio">{{ user.bio || '暂无个人简介' }}</p>
        <div class="profile-page__stats">
          <div>
            <span class="profile-page__stat-num">{{ user.familyCount }}</span>
            <span class="profile-page__stat-label">家庭</span>
          </div>
          <div>
            <span class="profile-page__stat-num">{{ user.clanCount }}</span>
            <span class="profile-page__stat-label">家族</span>
          </div>
          <div>
            <span class="profile-page__stat-num">{{ user.noteCount }}</span>
            <span class="profile-page__stat-label">笔记</span>
          </div>
        </div>
        <button class="profile-page__edit-btn" @click="router.push('/settings')">编辑资料</button>
      </div>
    </div>

    <!-- 功能列表 -->
    <div class="profile-page__menu">
      <div class="profile-page__menu-group">
        <div class="profile-page__menu-item" @click="router.push('/my-families')">
          <span>🏠</span>
          <span>我的家庭</span>
          <span class="profile-page__menu-arrow">›</span>
        </div>
        <div class="profile-page__menu-item" @click="router.push('/my-clans')">
          <span>🏛️</span>
          <span>我的家族</span>
          <span class="profile-page__menu-arrow">›</span>
        </div>
      </div>

      <div class="profile-page__menu-group">
        <div class="profile-page__menu-item">
          <span>❤️</span>
          <span>我的点赞</span>
          <span class="profile-page__menu-arrow">›</span>
        </div>
        <div class="profile-page__menu-item">
          <span>💬</span>
          <span>我的评论</span>
          <span class="profile-page__menu-arrow">›</span>
        </div>
        <div class="profile-page__menu-item">
          <span>⭐</span>
          <span>我的收藏</span>
          <span class="profile-page__menu-arrow">›</span>
        </div>
      </div>

      <div class="profile-page__menu-group">
        <div class="profile-page__menu-item" @click="router.push('/settings')">
          <span>⚙️</span>
          <span>设置</span>
          <span class="profile-page__menu-arrow">›</span>
        </div>
        <div class="profile-page__menu-item">
          <span>ℹ️</span>
          <span>关于我们</span>
          <span class="profile-page__menu-arrow">›</span>
        </div>
      </div>

      <div class="profile-page__menu-group">
        <div class="profile-page__menu-item profile-page__menu-item--danger" @click="handleLogout">
          <span>📴</span>
          <span>退出登录</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FwAvatar } from '@/components';

const router = useRouter();

const user = ref({
  nickname: '张三',
  avatar: '',
  bio: '记录美好生活',
  familyCount: 2,
  clanCount: 1,
  noteCount: 23,
});

const handleLogout = () => {
  router.push('/login');
};
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: var(--color-background);
  padding-bottom: var(--tabbar-height);
}

.profile-page__header {
  background: var(--color-surface);
  margin-bottom: var(--spacing-md);
}

.profile-page__cover {
  height: 120px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
}

.profile-page__info {
  text-align: center;
  padding: 0 var(--spacing-md) var(--spacing-lg);
  margin-top: -40px;
}

.profile-page__name {
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-bold);
  margin: var(--spacing-md) 0 var(--spacing-xs);
}

.profile-page__bio {
  font-size: var(--font-size-body-sm);
  color: var(--color-text-tertiary);
  margin-bottom: var(--spacing-md);
}

.profile-page__stats {
  display: flex;
  justify-content: center;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-md);
}

.profile-page__stats div {
  text-align: center;
}

.profile-page__stat-num {
  display: block;
  font-size: var(--font-size-h4);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.profile-page__stat-label {
  font-size: var(--font-size-caption);
  color: var(--color-text-tertiary);
}

.profile-page__edit-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  font-size: var(--font-size-body-sm);
  cursor: pointer;
}

/* 菜单 */
.profile-page__menu {
  padding: var(--spacing-md);
}

.profile-page__menu-group {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  margin-bottom: var(--spacing-md);
  overflow: hidden;
}

.profile-page__menu-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  font-size: var(--font-size-body);
  cursor: pointer;
}

.profile-page__menu-item:last-child {
  border-bottom: none;
}

.profile-page__menu-item span:first-child {
  font-size: 20px;
}

.profile-page__menu-item span:nth-child(2) {
  flex: 1;
}

.profile-page__menu-arrow {
  color: var(--color-text-tertiary);
  font-size: 20px;
}

.profile-page__menu-item--danger {
  color: var(--color-danger);
}
</style>
