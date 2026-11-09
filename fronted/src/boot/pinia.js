import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../boot/axios'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token_jwt') || '')
  const user = ref(null)

  const isAuthenticated = computed(() => !!token.value)

  function setToken(newToken) {
    token.value = newToken
    localStorage.setItem('token_jwt', newToken)
  }

  async function login(email, password) {
    try {
      // Petición real al backend NestJS
      const response = await api.post('/auth/login', { email, password })
      setToken(response.data.access_token)
      user.value = response.data.user
      return true
    } catch (error) {
      console.error('Error en el login:', error)
      throw error
    }
  }

  async function fetchMe() {
    try {
      const response = await api.get('/auth/me')
      user.value = response.data
      return response.data
    } catch (error) {
      logout()
      throw error
    }
  }

  function logout() {
    token.value = ''
    user.value = null
    localStorage.removeItem('token_jwt')
  }

  return {
    token,
    user,
    isAuthenticated,
    setToken,
    login,
    fetchMe,
    logout
  }
})