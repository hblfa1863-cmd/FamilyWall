<template>
  <div class="family-detail">
    <!-- 头部 -->
    <div class="family-detail__header">
      <button class="family-detail__back" @click="router.back()">←</button>
      <div class="family-detail__actions">
        <button v-if="isAdmin" @click="router.push(`/families/${family.id}/manage`)">管理</button>
      </div>
    </div>

    <!-- 家庭信息 -->
    <div class="family-detail__info">
      <FwAvatar :src="family.avatar" :name="family.name" size="xl" />
      <h1 class="family-detail__name">{{ family.name }}</h1>
      <div class="family-detail__stats">
        <span>{{ family.memberCount }} 个成员</span>
        <span>·</span>
        <span>{{ family.noteCount }} 篇笔记</span>
      </div>
    </div>

    <!-- Tab -->
    <div class="family-detail__tabs">
      <span 
        :class="['family-detail__tab', { 'family-detail__tab--active': activeTab === 'photos' }]"
        @click="activeTab = 'photos'"
      >
        照片墙
      </span>
      <span 
        :class="['family-detail__tab', { 'family-detail__tab--active': activeTab === 'members' }]"
        @click="activeTab = 'members'"
      >
        成员
      </span>
    </div>

    <!-- 内容 -->
    <div class="family-detail__content">
      <!-- 照片墙 -->
      <div v-if="activeTab === 'photos'" class="family-detail__photos">
        <div class="family-detail__grid">
          <div 
            v-for="note in notes" 
            :key="note.id"
            class="family-detail__photo-item"
            @click="router.push(`/notes/${note.id}`)"
          >
            <img :src="note.cover" />
          </div>
        </div>
      </div>

      <!-- 成员列表 -->
      <div v-else class="family-detail__members">
        <div 
          v-for="member in members" 
          :key="member.id"
          class="family-detail__member"
        >
          <FwAvatar :src="member.avatar" :name="member.nickname" size="md" />
          <div class="family-detail__member-info">
            <span class="family-detail__member-name">{{ member.nickname }}</span>
            <span class="family-detail__member-role">
              <FwTag v-if="member.role === 'admin'" type="primary" size="sm">管理员</FwTag>
            </span>
          </div>
          <span class="family-detail__member-time">加入于 {{ member.joinedAt }}</span>
        </div>
      </div>
    </div>

    <!-- 邀请按钮 -->
    <button v-if="isAdmin" class="family-detail__invite-btn" @click="showInviteModal = true">
      邀请成员
    </button>

    <!-- 邀请弹窗 -->
    <Teleport to="body">
      <Transition name="slide-up">
        <div v-if="showInviteModal" class="family-detail__invite-mask" @click="showInviteModal = false">
          <div class="family-detail__invite-panel" @click.stop>
            <h3>邀请成员</h3>
            <div class="family-detail__invite-code">
              <span>{{ inviteCode }}</span>
              <button @click="copyCode">复制</button>
            </div>
            <p class="family-detail__invite-tip">有效期至 {{ expireDate }}</p>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { FwAvatar, FwTag } from '@/components';
import api from '@/services/api';

const router = useRouter();
const route = useRoute();

const familyId = Number(route.params.id);
const activeTab = ref('photos');
const showInviteModal = ref(false);
const loading = ref(false);

// 家庭数据
const family = ref<any>(null);
const notes = ref<any[]>([]);
const members = ref<any[]>([]);
const inviteCode = ref('');
const expireDate = ref('');
const isAdmin = ref(false);

// 获取家庭详情
const fetchFamily = async () => {
  loading.value = true;
  try {
    const res = await api.getFamily(familyId);
    if (res.success && res.data) {
      family.value = res.data;
    }
  } catch (e) {
    console.error('获取家庭失败', e);
  } finally {
    loading.value = false;
  }
};

// 获取笔记列表
const fetchNotes = async () => {
  try {
    const res = await api.getNotes(familyId);
    if (res.success && res.data) {
      notes.value = res.data.data.map((note: unknown) => ({
        id: note.id,
        cover: note.cover || note.media?.[0]?.url,
      }));
    }
  } catch (e) {
    console.error('获取笔记失败', e);
  }
};

// 获取成员列表
const fetchMembers = async () => {
  try {
    const res = await api.getFamilyMembers(familyId);
    if (res.success && res.data) {
      members.value = res.data.map((m: unknown) => ({
        id: m.id,
        nickname: m.user?.nickname || '未知',
        avatar: m.user?.avatar,
        role: m.role,
        joinedAt: new Date(m.joined_at).toLocaleDateString('zh-CN'),
      }));
    }
  } catch (e) {
    console.error('获取成员失败', e);
  }
};

// 生成邀请码
const generateInvite = async () => {
  try {
    const res = await api.generateInviteCode(familyId);
    if (res.success && res.data) {
      inviteCode.value = res.data.code;
      expireDate.value = new Date(res.data.expires_at).toLocaleDateString('zh-CN');
      showInviteModal.value = true;
    }
  } catch (e) {
    console.error('生成邀请码失败', e);
  }
};

onMounted(() => {
  fetchFamily();
  fetchNotes();
  fetchMembers();
});

const copyCode = () => {
  navigator.clipboard.writeText(inviteCode.value);
};
</script>

<style scoped>
.family-detail {
  min-height: 100vh;
  background: var(--color-background);
  padding-bottom: 80px;
}

.family-detail__header {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-md);
  background: var(--color-surface);
}

.family-detail__back {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background: var(--color-background);
  border: none;
  font-size: 18px;
  cursor: pointer;
}

.family-detail__actions button {
  padding: var(--spacing-xs) var(--spacing-md);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
}

.family-detail__info {
  text-align: center;
  padding: var(--spacing-xl);
  background: var(--color-surface);
}

.family-detail__name {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
  margin: var(--spacing-md) 0 var(--spacing-xs);
}

.family-detail__stats {
  display: flex;
  justify-content: center;
  gap: var(--spacing-sm);
  color: var(--color-text-tertiary);
  font-size: var(--font-size-body-sm);
}

.family-detail__tabs {
  display: flex;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.family-detail__tab {
  flex: 1;
  text-align: center;
  padding: var(--spacing-md);
  font-size: var(--font-size-body);
  color: var(--color-text-tertiary);
  cursor: pointer;
  position: relative;
}

.family-detail__tab--active {
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}

.family-detail__tab--active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-primary);
}

.family-detail__content {
  padding: var(--spacing-md);
}

.family-detail__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
}

.family-detail__photo-item {
  aspect-ratio: 1;
  overflow: hidden;
  cursor: pointer;
}

.family-detail__photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.family-detail__member {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-sm);
}

.family-detail__member-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.family-detail__member-name {
  font-weight: var(--font-weight-medium);
}

.family-detail__member-time {
  font-size: var(--font-size-caption);
  color: var(--color-text-tertiary);
}

.family-detail__invite-btn {
  position: fixed;
  bottom: var(--spacing-lg);
  left: 50%;
  transform: translateX(-50%);
  padding: var(--spacing-md) var(--spacing-xl);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  font-size: var(--font-size-body);
  cursor: pointer;
  box-shadow: var(--shadow-lg);
}

.family-detail__invite-mask {
  position: fixed;
  inset: 0;
  background: var(--color-mask);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.family-detail__invite-panel {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  text-align: center;
  margin: var(--spacing-lg);
}

.family-detail__invite-code {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  margin: var(--spacing-lg) 0;
}

.family-detail__invite-code span {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
  letter-spacing: 4px;
}

.family-detail__invite-code button {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
}

.family-detail__invite-tip {
  color: var(--color-text-tertiary);
  font-size: var(--font-size-caption);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all var(--transition-normal);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
}

.slide-up-enter-from .family-detail__invite-panel,
.slide-up-leave-to .family-detail__invite-panel {
  transform: translateY(100%);
}
</style>
