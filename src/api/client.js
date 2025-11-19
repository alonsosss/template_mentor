import axios from 'axios'
import { API_BASE_URL, API_TIMEOUT } from './endpoints'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
})

client.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const token = authStore.token
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

client.interceptors.response.use(
  (response) => {
    return response.data
  },
  async (error) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      const authStore = useAuthStore()
      const refreshed = await authStore.refreshToken()
      
      if (refreshed) {
        return client(originalRequest)
      } else {
        authStore.logout()
        router.push('/login')
      }
    }
    
    if (error.response?.status === 403) {
      router.push('/unauthorized')
    }
    
    return Promise.reject(error)
  }
)

export default client
