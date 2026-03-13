<template>
  <div class="static-page">
    <div class="static-page__header">
      <button @click="router.back()">←</button>
      <h1>隐私政策</h1>
    </div>
    <div class="static-page__content">
      <h2>隐私政策</h2>
      <p>更新时间：2026年3月12日</p>
      
      <h3>1. 信息收集</h3>
      <p>我们收集您在使用FamilyWall服务时提供的信息，包括但不限于：注册信息（邮箱、昵称、头像）、个人资料（性别、生日）、创建的内容（笔记、照片、评论）等。</p>
      
      <h3>2. 信息使用</h3>
      <p>您的信息将用于：提供核心服务、改善用户体验、保障账号安全、推送通知等。我们不会将您的个人信息用于未经授权的目的。</p>
      
      <h3>3. 信息存储</h3>
      <p>您的个人信息将存储在加密的服务器上，除非法律要求或您主动要求删除，否则我们将保留您的信息。</p>
      
      <h3>4. 信息共享</h3>
      <p>除非获得您的明确同意或在以下情况下，我们不会与第三方共享您的个人信息：法律要求、配合政府调查、保护我们或他人的权益。</p>
      
      <h3>5. 用户权利</h3>
      <p>您有权访问、更正、删除您的个人信息，也有权注销账号。行使这些权利请联系我们的客服。</p>
      
      <h3>6. 儿童隐私</h3>
      <p>我们不会故意收集未满14周岁儿童的个人信息。如果您发现我们收集了儿童信息，请联系我们删除。</p>
      
      <h3>7. 政策更新</h3>
      <p>我们可能会不时更新本隐私政策。重大变更将通过应用内通知或邮件告知。</p>
      
      <h3>8. 联系我们</h3>
      <p>如有任何疑问，请联系：support@familywall.com</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
</script>

<style scoped>
.static-page { min-height: 100vh; background: var(--color-background); }
.static-page__header { display: flex; align-items: center; gap: var(--spacing-md); padding: var(--spacing-md); background: var(--color-surface); position: sticky; top: 0; z-index: 100; }
.static-page__header button { width: 36px; height: 36px; border-radius: var(--radius-full); border: none; background: var(--color-background); font-size: 18px; cursor: pointer; }
.static-page__header h1 { font-size: var(--font-size-h5); font-weight: var(--font-weight-semibold); }
.static-page__content { padding: var(--spacing-lg); font-size: var(--font-size-body); line-height: 1.8; color: var(--color-text-secondary); }
.static-page__content h2 { font-size: var(--font-size-h3); font-weight: var(--font-weight-bold); color: var(--color-text-primary); margin-bottom: var(--spacing-sm); }
.static-page__content > p { font-size: var(--font-size-caption); color: var(--color-text-tertiary); margin-bottom: var(--spacing-lg); }
.static-page__content h3 { font-size: var(--font-size-body); font-weight: var(--font-weight-semibold); color: var(--color-text-primary); margin: var(--spacing-lg) 0 var(--spacing-sm); }
.static-page__content p { margin-bottom: var(--spacing-md); }
</style>
