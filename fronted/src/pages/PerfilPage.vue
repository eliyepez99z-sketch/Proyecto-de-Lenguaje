<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card class="my-card" style="width: 400px; max-width: 90vw;">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Mi Perfil (Auth/Me)</div>
        <div class="text-subtitle2">Datos devueltos por NestJS</div>
      </q-card-section>

      <q-card-section class="q-pt-md">
        <div v-if="authStore.user">
          <p><strong>ID de Usuario:</strong> {{ authStore.user.usuarioExternoId }}</p>
          <p><strong>Correo:</strong> {{ authStore.user.email }}</p>
          <p><strong>Rol:</strong> <q-badge color="secondary">{{ authStore.user.rol }}</q-badge></p>
        </div>
        <div v-else class="text-center text-grey">
          <p>Haz clic abajo para consultar tus datos o simular un token de sesión.</p>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat color="secondary" label="Simular Token" @click="simularToken" />
        <q-btn color="primary" label="Cargar /auth/me" @click="cargarDatos" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useQuasar } from 'quasar'

const authStore = useAuthStore()
const $q = useQuasar()

// Permite probar la inyección del token guardando uno de prueba en localStorage
const simularToken = () => {
  const tokenPrueba = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTYiLCJlbWFpbCI6InVzdWFyaW9AZXhhbXBsZS5jb20iLCJyb2wiOiJhZG1pbiJ9.test'
  authStore.setToken(tokenPrueba)
  $q.notify({ color: 'positive', message: 'Token guardado en LocalStorage' })
}

const cargarDatos = async () => {
  try {
    $q.loading.show()
    await authStore.fetchMe()
    $q.notify({ color: 'positive', message: '¡Datos cargados del backend con éxito!' })
  } catch (error) {
    $q.notify({ color: 'negative', message: 'Error 401: No autorizado o backend apagado.' })
  } finally {
    $q.loading.hide()
  }
}
</script>