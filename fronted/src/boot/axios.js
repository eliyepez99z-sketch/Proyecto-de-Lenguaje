import { boot } from 'quasar/wrappers'
import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:3000' })

export default boot(({ app }) => {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token_jwt')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  }, (error) => {
    return Promise.reject(error)
  })

  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }