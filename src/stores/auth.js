import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/api/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const token = ref(localStorage.getItem('token') || null)
  const refreshToken = ref(localStorage.getItem('refreshToken') || null)

  const isAuthenticated = computed(() => !!token.value)
  const userRole = computed(() => user.value?.rol || null)

  async function login(credentials) {
    try {
      const response = await authService.login(credentials)
      
      if (response.token) {
        token.value = response.token
        refreshToken.value = response.refreshToken
        user.value = response.user
        
        localStorage.setItem('token', response.token)
        localStorage.setItem('refreshToken', response.refreshToken)
        
        return { success: true }
      }
      
      return { success: false, error: response.error }
    } catch (error) {
      // Modo demo: simular login exitoso
      token.value = 'demo-token'
      refreshToken.value = 'demo-refresh-token'
      user.value = {
        id: 1,
        name: credentials.username || 'Usuario Demo',
        email: credentials.username || 'usuario@demo.com',
        role: 'Administrador',
        plant: 'ISM Arequipa',
        company: 'Industrias San Miguel'
      }
      
      localStorage.setItem('token', token.value)
      localStorage.setItem('refreshToken', refreshToken.value)
      localStorage.setItem('user', JSON.stringify(user.value))
      
      return { success: true }
    }
  }

  async function logout() {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Error al hacer logout:', error)
    } finally {
      user.value = null
      token.value = null
      refreshToken.value = null
      
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    }
  }

  async function refreshTokenAction() {
    try {
      const response = await authService.refreshToken(refreshToken.value)
      
      if (response.token) {
        token.value = response.token
        refreshToken.value = response.refreshToken
        
        localStorage.setItem('token', response.token)
        localStorage.setItem('refreshToken', response.refreshToken)
        
        return true
      }
      
      return false
    } catch (error) {
      return false
    }
  }

  async function fetchCurrentUser() {
    try {
      const response = await authService.getCurrentUser()
      user.value = response
      return true
    } catch (error) {
      return false
    }
  }

  function hasRole(roles) {
    if (!Array.isArray(roles)) roles = [roles]
    return roles.includes(userRole.value)
  }

  return {
    user,
    token,
    refreshToken,
    isAuthenticated,
    userRole,
    login,
    logout,
    refreshToken: refreshTokenAction,
    fetchCurrentUser,
    hasRole
  }
})
