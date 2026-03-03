<script setup lang="ts">
import type { User, Family } from '../api'

defineProps<{
  user: User | null
  families: Family[]
  currentFamilyId: string
}>()

const emit = defineEmits<{
  switchFamily: [familyId: string]
  createFamily: []
  showInviteCode: []
  logout: []
}>()
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-[#0D0D0F]/90 backdrop-blur-xl border-b border-white/5">
    <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="text-2xl">🏠</div>
        <div>
          <h1 class="text-xl font-bold">FamilyWall</h1>
          <p class="text-xs text-white/40">家族照片墙</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <select v-if="families.length > 0" :value="currentFamilyId" @change="emit('switchFamily', ($event.target as HTMLSelectElement).value)" class="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm">
          <option v-for="f in families" :key="f.id" :value="f.id">{{ f.name }}</option>
        </select>
        <button @click="emit('createFamily')" class="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10">+ 新建家族</button>
        <button @click="emit('showInviteCode')" class="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10">邀请码</button>
        <span class="text-sm text-white/50">{{ user?.username }}</span>
        <button @click="emit('logout')" class="text-amber-400 hover:underline text-sm">退出</button>
      </div>
    </div>
  </header>
</template>
