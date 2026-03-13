<template>
  <div class="clans-page">
    <div class="clans-page__header">
      <button @click="router.back()">←</button>
      <h1>家族广场</h1>
    </div>

    <div class="clans-page__search">
      <input v-model="searchKeyword" placeholder="搜索家族" />
    </div>

    <div class="clans-page__tabs">
      <span :class="{ active: activeTab === 'recommended' }" @click="activeTab = 'recommended'">推荐</span>
      <span :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">全部</span>
    </div>

    <div class="clans-page__list">
      <div v-for="clan in filteredClans" :key="clan.id" class="clans-page__item" @click="goToDetail(clan.id)">
        <FwAvatar :src="clan.avatar" :name="clan.name" size="lg" />
        <div class="clans-page__item-info">
          <span class="clans-page__item-name">{{ clan.name }}</span>
          <span class="clans-page__item-meta">{{ clan.familyCount }}个家庭 · {{ clan.noteCount }}篇笔记</span>
        </div>
        <button v-if="clan.canJoin" class="clans-page__join-btn" @click.stop="applyJoin(clan.id)">申请加入</button>
      </div>
    </div>

    <div v-if="filteredClans.length === 0" class="clans-page__empty">
      <span>🏛️</span>
      <p>暂无家族</p>
    </div>

    <!-- 申请弹窗 -->
    <Teleport to="body">
      <Transition name="slide-up">
        <div v-if="showApplyModal" class="clans-page__mask" @click="showApplyModal = false">
          <div class="clans-page__apply-panel" @click.stop>
            <h3>申请加入</h3>
            <p>申请加入「{{ selectedClan?.name }}」</p>
            <textarea v-model="applyMessage" placeholder="填写申请信息（选填）"></textarea>
            <div class="clans-page__apply-actions">
              <button @click="showApplyModal = false">取消</button>
              <button class="primary" @click="submitApply">提交申请</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { FwAvatar } from '@/components';

const router = useRouter();
const searchKeyword = ref('');
const activeTab = ref('recommended');
const showApplyModal = ref(false);
const selectedClan = ref<any>(null);
const applyMessage = ref('');

const clans = ref([
  { id: 1, name: '王氏家族', avatar: '', familyCount: 3, noteCount: 89, canJoin: true },
  { id: 2, name: '李氏家族', avatar: '', familyCount: 5, noteCount: 156, canJoin: true },
  { id: 3, name: '张氏家族', avatar: '', familyCount: 8, noteCount: 234, canJoin: false },
]);

const filteredClans = computed(() => {
  let list = clans.value;
  if (searchKeyword.value) {
    list = list.filter(c => c.name.includes(searchKeyword.value));
  }
  return list;
});

const goToDetail = (id: number) => router.push(`/clans/${id}`);
const applyJoin = (id: number) => {
  selectedClan.value = clans.value.find(c => c.id === id);
  showApplyModal.value = true;
};
const submitApply = () => {
  showApplyModal.value = false;
  applyMessage.value = '';
};
</script>

<style scoped>
.clans-page { min-height: 100vh; background: var(--color-background); padding: var(--spacing-md); padding-bottom: 80px; }
.clans-page__header { display: flex; align-items: center; gap: var(--spacing-md); margin-bottom: var(--spacing-md); }
.clans-page__header button { width: 36px; height: 36px; border-radius: var(--radius-full); border: none; background: var(--color-surface); font-size: 18px; cursor: pointer; }
.clans-page__header h1 { font-size: var(--font-size-h4); font-weight: var(--font-weight-semibold); }
.clans-page__search input { width: 100%; height: 44px; border: none; border-radius: var(--radius-xl); padding: 0 var(--spacing-md); background: var(--color-surface); margin-bottom: var(--spacing-md); }
.clans-page__tabs { display: flex; gap: var(--spacing-lg); margin-bottom: var(--spacing-md); }
.clans-page__tabs span { font-size: var(--font-size-body); color: var(--color-text-tertiary); cursor: pointer; padding: var(--spacing-sm) 0; position: relative; }
.clans-page__tabs span.active { color: var(--color-primary); font-weight: var(--font-weight-medium); }
.clans-page__tabs span.active::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--color-primary); border-radius: 1px; }
.clans-page__item { display: flex; align-items: center; gap: var(--spacing-md); padding: var(--spacing-md); background: var(--color-surface); border-radius: var(--radius-xl); margin-bottom: var(--spacing-sm); cursor: pointer; }
.clans-page__item-info { flex: 1; display: flex; flex-direction: column; }
.clans-page__item-name { font-weight: var(--font-weight-semibold); }
.clans-page__item-meta { font-size: var(--font-size-caption); color: var(--color-text-tertiary); }
.clans-page__join-btn { padding: var(--spacing-xs) var(--spacing-md); background: var(--color-primary); color: white; border: none; border-radius: var(--radius-lg); font-size: var(--font-size-caption); cursor: pointer; }
.clans-page__empty { text-align: center; padding: var(--spacing-3xl); color: var(--color-text-tertiary); }
.clans-page__empty span { font-size: 64px; display: block; margin-bottom: var(--spacing-md); }
.clans-page__mask { position: fixed; inset: 0; background: var(--color-mask); z-index: 2000; display: flex; align-items: flex-end; }
.clans-page__apply-panel { width: 100%; background: var(--color-surface); border-radius: var(--radius-2xl) var(--radius-2xl) 0 0; padding: var(--spacing-xl); }
.clans-page__apply-panel h3 { font-size: var(--font-size-h4); font-weight: var(--font-weight-semibold); margin-bottom: var(--spacing-xs); }
.clans-page__apply-panel p { color: var(--color-text-tertiary); font-size: var(--font-size-body-sm); margin-bottom: var(--spacing-md); }
.clans-page__apply-panel textarea { width: 100%; height: 100px; border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--spacing-md); font-size: var(--font-size-body); resize: none; margin-bottom: var(--spacing-md); }
.clans-page__apply-actions { display: flex; gap: var(--spacing-md); }
.clans-page__apply-actions button { flex: 1; height: 44px; border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-surface); font-size: var(--font-size-body); cursor: pointer; }
.clans-page__apply-actions button.primary { background: var(--color-primary); color: white; border: none; }
.slide-up-enter-active, .slide-up-leave-active { transition: all var(--transition-normal); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(100%); }
</style>
