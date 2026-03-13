<template>
  <div class="search-page">
    <div class="search-page__header">
      <div class="search-page__input">
        <span>🔍</span>
        <input v-model="keyword" placeholder="搜索用户/家庭/家族/笔记" @input="handleSearch" />
        <span v-if="keyword" @click="keyword = ''">×</span>
      </div>
      <button @click="router.back()">取消</button>
    </div>

    <div v-if="!keyword" class="search-page__hot">
      <h3>热门搜索</h3>
      <div class="search-page__hot-tags">
        <span>王氏家族</span>
        <span>春节</span>
        <span>聚餐</span>
      </div>
    </div>

    <div v-else class="search-page__results">
      <div v-if="results.users.length" class="search-page__section">
        <h3>用户</h3>
        <div v-for="user in results.users" :key="user.id" class="search-page__item" @click="router.push(`/user/${user.id}`)">
          <FwAvatar :src="user.avatar" :name="user.nickname" size="md" />
          <span>{{ user.nickname }}</span>
        </div>
      </div>

      <div v-if="results.families.length" class="search-page__section">
        <h3>家庭</h3>
        <div v-for="family in results.families" :key="family.id" class="search-page__item" @click="router.push(`/families/${family.id}`)">
          <FwAvatar :src="family.avatar" :name="family.name" size="md" />
          <div>
            <span class="name">{{ family.name }}</span>
            <span class="meta">{{ family.memberCount }}个成员</span>
          </div>
        </div>
      </div>

      <div v-if="results.clans.length" class="search-page__section">
        <h3>家族</h3>
        <div v-for="clan in results.clans" :key="clan.id" class="search-page__item" @click="router.push(`/clans/${clan.id}`)">
          <FwAvatar :src="clan.avatar" :name="clan.name" size="md" />
          <div>
            <span class="name">{{ clan.name }}</span>
            <span class="meta">{{ clan.familyCount }}个家庭</span>
          </div>
        </div>
      </div>

      <div v-if="results.notes.length" class="search-page__section">
        <h3>笔记</h3>
        <div v-for="note in results.notes" :key="note.id" class="search-page__item" @click="router.push(`/notes/${note.id}`)">
          <img :src="note.cover" class="search-page__note-cover" />
          <div>
            <span class="name">{{ note.title }}</span>
            <span class="meta">{{ note.author }}</span>
          </div>
        </div>
      </div>

      <div v-if="isEmpty" class="search-page__empty">
        <span>🔍</span>
        <p>未找到相关结果</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import api from '@/services/api';
import { FwAvatar } from '@/components';

const router = useRouter();
const keyword = ref('');
const results = reactive({
  users: [] as any[],
  families: [] as any[],
  clans: [] as any[],
  notes: [] as any[],
});

const isEmpty = computed(() => 
  !results.users.length && !results.families.length && !results.clans.length && !results.notes.length && keyword.value
);

const handleSearch = () => {
  if (!keyword.value) {
    results.users = [];
    results.families = [];
    results.clans = [];
    results.notes = [];
    return;
  }
  // 模拟搜索
  results.users = [{ id: 1, nickname: '张三', avatar: '' }];
  results.families = [{ id: 1, name: '张三的家庭', avatar: '', memberCount: 5 }];
  results.clans = [{ id: 1, name: '王氏家族', avatar: '', familyCount: 3 }];
  results.notes = [{ id: 1, title: '春节聚会', cover: '', author: '张三' }];
};
</script>

<style scoped>
.search-page { min-height: 100vh; background: var(--color-background); }
.search-page__header { display: flex; align-items: center; gap: var(--spacing-md); padding: var(--spacing-md); background: var(--color-surface); }
.search-page__input { flex: 1; display: flex; align-items: center; gap: var(--spacing-sm); background: var(--color-background); border-radius: var(--radius-xl); padding: var(--spacing-sm) var(--spacing-md); }
.search-page__input input { flex: 1; border: none; background: none; font-size: var(--font-size-body); outline: none; }
.search-page__header button { background: none; border: none; color: var(--color-text-tertiary); font-size: var(--font-size-body); cursor: pointer; }
.search-page__hot { padding: var(--spacing-md); }
.search-page__hot h3 { font-size: var(--font-size-body-sm); color: var(--color-text-tertiary); margin-bottom: var(--spacing-sm); }
.search-page__hot-tags { display: flex; flex-wrap: wrap; gap: var(--spacing-sm); }
.search-page__hot-tags span { padding: var(--spacing-xs) var(--spacing-md); background: var(--color-surface); border-radius: var(--radius-lg); font-size: var(--font-size-body-sm); }
.search-page__results { padding: var(--spacing-md); }
.search-page__section { margin-bottom: var(--spacing-lg); }
.search-page__section h3 { font-size: var(--font-size-body-sm); color: var(--color-text-tertiary); margin-bottom: var(--spacing-sm); }
.search-page__item { display: flex; align-items: center; gap: var(--spacing-md); padding: var(--spacing-sm); background: var(--color-surface); border-radius: var(--radius-lg); margin-bottom: var(--spacing-xs); cursor: pointer; }
.search-page__item .name { font-weight: var(--font-weight-medium); display: block; }
.search-page__item .meta { font-size: var(--font-size-caption); color: var(--color-text-tertiary); }
.search-page__note-cover { width: 48px; height: 48px; border-radius: var(--radius-md); object-fit: cover; }
.search-page__empty { text-align: center; padding: var(--spacing-3xl); color: var(--color-text-tertiary); }
.search-page__empty span { font-size: 48px; display: block; margin-bottom: var(--spacing-md); }
</style>
