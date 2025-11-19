<script setup>
import { useUiStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'

const uiStore = useUiStore()
const authStore = useAuthStore()
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <button class="header-toggle" @click="uiStore.toggleSidebar">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2"/>
        </svg>
      </button>
      <h1 class="header-title">{{ $route.meta.title || 'Mentor Monitor' }}</h1>
    </div>

    <div class="header-right">
      <div class="header-user">
        <div class="user-avatar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div class="user-info">
          <span class="user-name">{{ authStore.user?.nombre || 'Usuario' }}</span>
          <span class="user-role">{{ authStore.user?.rol || 'ROL' }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  @apply flex items-center justify-between px-6 bg-white border-b border-gray-200;
  height: var(--header-height);
}

.header-left {
  @apply flex items-center gap-4;
}

.header-toggle {
  @apply p-2 rounded-lg hover:bg-gray-100 transition-colors;
  @apply text-gray-600;
}

.header-title {
  @apply text-xl font-semibold text-gray-900;
}

.header-right {
  @apply flex items-center gap-4;
}

.header-user {
  @apply flex items-center gap-3 px-3 py-2 rounded-lg;
  @apply hover:bg-gray-100 cursor-pointer transition-colors;
}

.user-avatar {
  @apply w-10 h-10 rounded-full bg-primary-100 text-primary-600;
  @apply flex items-center justify-center;
}

.user-info {
  @apply flex flex-col;
}

.user-name {
  @apply text-sm font-medium text-gray-900;
}

.user-role {
  @apply text-xs text-gray-500;
}

@media (max-width: 768px) {
  .header-title {
    @apply text-lg;
  }
  
  .user-info {
    @apply hidden;
  }
}
</style>
