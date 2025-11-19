import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const sidebarCollapsed = ref(false)
  const isMobile = ref(window.innerWidth < 768)
  const sidebarOpen = ref(!isMobile.value)
  const loading = ref(false)
  const modalOpen = ref(false)

  function toggleSidebar() {
    if (isMobile.value) {
      sidebarOpen.value = !sidebarOpen.value
    } else {
      sidebarCollapsed.value = !sidebarCollapsed.value
    }
  }

  function closeSidebar() {
    if (isMobile.value) {
      sidebarOpen.value = false
    }
  }

  function openSidebar() {
    sidebarOpen.value = true
  }

  function setLoading(value) {
    loading.value = value
  }

  function openModal() {
    modalOpen.value = true
  }

  function closeModal() {
    modalOpen.value = false
  }

  function updateMobile() {
    isMobile.value = window.innerWidth < 768
    if (!isMobile.value) {
      sidebarOpen.value = true
    }
  }

  return {
    sidebarCollapsed,
    isMobile,
    sidebarOpen,
    loading,
    modalOpen,
    toggleSidebar,
    closeSidebar,
    openSidebar,
    setLoading,
    openModal,
    closeModal,
    updateMobile
  }
})
