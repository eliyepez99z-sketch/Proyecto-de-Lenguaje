import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from 'boot/axios'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token_jwt') || '')
  const user = ref(null)

  const isAuthenticated = computed(() => !!token.value)

  function setToken(newToken) {
    token.value = newToken
    localStorage.setItem('token_jwt', newToken)
  }

  async function fetchMe() {
    try {
      const response = await api.get('/auth/me')
      user.value = response.data
      return response.data
    } catch (error) {
      console.error('Error al obtener el usuario actual:', error)
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
    fetchMe,
    logout
  }
})