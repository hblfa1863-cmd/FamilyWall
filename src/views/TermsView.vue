<template>
  <div class="static-page">
    <div class="static-page__header">
      <button @click="router.back()">←</button>
      <h1>用户协议</h1>
    </div>
    <div class="static-page__content">
      <h2>用户协议</h2>
      <p>更新时间：2026年3月12日</p>
      
      <h3>1. 服务条款</h3>
      <p>欢迎使用FamilyWall！通过使用我们的服务，您同意遵守本协议的各项条款。</p>
      
      <h3>2. 账户规则</h3>
      <p>• 您需使用真实邮箱注册账号<br>• 账号仅限本人使用，不得转让<br>• 您需对账户安全负责</p>
      
      <h3>3. 内容规范</h3>
      <p>禁止发布以下内容：<br>• 违法违规内容<br>• 侵犯他人权益的内容<br>• 垃圾信息或广告<br>• 暴力、血腥、恐怖内容</p>
      
      <h3>4. 禁止行为</h3>
      <p>• 恶意注册多个账号<br>• 滥用系统功能<br>• 试图破解或攻击系统<br>• 收集其他用户信息</p>
      
      <h3>5. 违规处理</h3>
      <p>对于违反本协议的用户，我们有权采取：警告、删除内容、暂停账号、永久封禁等措施。</p>
      
      <h3>6. 免责声明</h3>
      <p>用户对自身行为负责。我们不对用户发布的内容负责，也不保证服务的持续可用。</p>
      
      <h3>7. 争议解决</h3>
      <p>本协议解释权归FamilyWall所有。如有争议，双方协商解决，协商不成时提交法院裁决。</p>
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
