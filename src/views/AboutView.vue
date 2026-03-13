<template>
  <div class="about-page">
    <div class="about-page__header">
      <button @click="router.back()">←</button>
      <h1>关于我们</h1>
    </div>
    
    <div class="about-page__logo">
      <span>🏠</span>
      <h2>FamilyWall</h2>
      <p>Version 1.0.0</p>
    </div>

    <div class="about-page__intro">
      <p>FamilyWall 是一个家庭/家族回忆记录与管理平台，帮助您记录家庭聚餐、标记珍贵位置，以照片墙和时光轴的形式珍藏每一份美好回忆。</p>
    </div>

    <div class="about-page__links">
      <div @click="router.push('/privacy')">
        <span>📜</span>
        <span>隐私政策</span>
        <span>›</span>
      </div>
      <div @click="router.push('/terms')">
        <span>📋</span>
        <span>用户协议</span>
        <span>›</span>
      </div>
    </div>

    <div class="about-page__contact">
      <h3>联系我们</h3>
      <p>邮箱：support@familywall.com</p>
    </div>

    <div class="about-page__copyright">
      <p>© 2026 FamilyWall. All rights reserved.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
</script>

<style scoped>
.about-page { min-height: 100vh; background: var(--color-background); padding-bottom: var(--spacing-xl); }
.about-page__header { display: flex; align-items: center; gap: var(--spacing-md); padding: var(--spacing-md); background: var(--color-surface); margin-bottom: var(--spacing-lg); }
.about-page__header button { width: 36px; height: 36px; border-radius: var(--radius-full); border: none; background: var(--color-background); font-size: 18px; cursor: pointer; }
.about-page__header h1 { font-size: var(--font-size-h5); font-weight: var(--font-weight-semibold); }
.about-page__logo { text-align: center; padding: var(--spacing-xl); }
.about-page__logo span { font-size: 80px; display: block; }
.about-page__logo h2 { font-size: var(--font-size-h2); font-weight: var(--font-weight-bold); color: var(--color-primary); margin: var(--spacing-md) 0 var(--spacing-xs); }
.about-page__logo p { color: var(--color-text-tertiary); font-size: var(--font-size-body-sm); }
.about-page__intro { padding: 0 var(--spacing-lg); margin-bottom: var(--spacing-lg); }
.about-page__intro p { font-size: var(--font-size-body); line-height: 1.8; color: var(--color-text-secondary); text-align: center; }
.about-page__links { background: var(--color-surface); margin: 0 var(--spacing-md); border-radius: var(--radius-xl); overflow: hidden; }
.about-page__links > div { display: flex; align-items: center; gap: var(--spacing-md); padding: var(--spacing-md); border-bottom: 1px solid var(--color-border); cursor: pointer; }
.about-page__links > div:last-child { border-bottom: none; }
.about-page__links span:first-child { font-size: 20px; }
.about-page__links span:nth-child(2) { flex: 1; }
.about-page__links span:last-child { color: var(--color-text-tertiary); }
.about-page__contact { padding: var(--spacing-lg); text-align: center; }
.about-page__contact h3 { font-size: var(--font-size-body-sm); color: var(--color-text-tertiary); margin-bottom: var(--spacing-sm); }
.about-page__contact p { font-size: var(--font-size-body-sm); color: var(--color-text-secondary); }
.about-page__copyright { text-align: center; padding: var(--spacing-xl); color: var(--color-text-tertiary); font-size: var(--font-size-caption); }
</style>
