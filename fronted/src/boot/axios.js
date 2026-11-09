import { boot } from 'quasar/wrappers'
import axios from 'axios'

// Configura la URL base de tu backend de NestJS (ajústala si es necesario, ej: http://localhost:3000)
const api = axios.create({ baseURL: 'http://localhost:3000' })

export default boot(({ app }) => {
  // Interceptor de peticiones: antes de enviar cualquier solicitud, añade el token si existe
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token_jwt')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  }, (error) => {
    return Promise.reject(error)
  })

  // Hace que $api esté disponible en toda la app usando options api o composition api (proxy)
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }