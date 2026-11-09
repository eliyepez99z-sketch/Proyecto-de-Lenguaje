<template>
  <q-page class="q-pa-md flex flex-center bg-grey-2">
    <q-card class="q-pa-lg shadow-2" style="width: 400px; max-width: 90vw; border-radius: 12px;">
      <q-card-section class="text-center">
        <div class="text-h5 text-weight-bold text-primary">Iniciar Sesión</div>
        <div class="text-subtitle2 text-grey-7">Conecta tu cuenta con NestJS</div>
      </q-card-section>

      <q-card-section class="q-gutter-md">
        <q-input
          v-model="email"
          label="Correo electrónico"
          outlined
          dense
          type="email"
          clearable
        />
        <q-input
          v-model="password"
          label="Contraseña"
          outlined
          dense
          type="password"
          clearable
        />
      </q-card-section>

      <q-card-actions class="q-px-md q-pt-none column q-gutter-sm">
        <q-btn
          color="primary"
          label="Iniciar Sesión"
          class="full-width"
          unelevated
          @click="handleLogin"
        />
        <q-btn
          color="secondary"
          flat
          label="Simular Token Rápido"
          class="full-width"
          @click="simularToken"
        />
      </q-card-actions>

      <q-card-section v-if="authStore.user" class="q-mt-md bg-green-1 rounded-borders">
        <div class="text-weight-bold text-green-9">¡Sesión Activa!</div>
        <p class="q-mb-none text-body2">Usuario: {{ authStore.user.email }}</p>
        <p class="q-mb-none text-body2">Rol: {{ authStore.user.rol }}</p>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useQuasar } from 'quasar'

const authStore = useAuthStore()
const $q = useQuasar()

const email = ref('')
const password = ref('')

// Simula el login guardando un token temporal de prueba y consultando /auth/me
const simularToken = async () => {
  try {
    const tokenPrueba = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTYiLCJlbWFpbCI6InVzdWFyaW9AZXhhbXBsZS5jb20iLCJyb2wiOiJhZG1pbiJ9.test'
    authStore.setToken(tokenPrueba)
    
    $q.loading.show()
    await authStore.fetchMe()
    $q.notify({ color: 'positive', message: '¡Token simulado y datos cargados con éxito!' })
  } catch (error) {
    $q.notify({ color: 'negative', message: 'Error al consultar /auth/me con el token de prueba.' })
  } finally {
    $q.loading.hide()
  }
}

const handleLogin = async () => {
  if (!email.value || !password.value) {
    $q.notify({ color: 'warning', message: 'Por favor completa los campos.' })
    return
  }

  try {
    $q.loading.show()
    // Aquí puedes conectar tu endpoint real de login de NestJS si lo tienes, ej: api.post('/auth/login', { email, password })
    // Por ahora simularemos la respuesta de éxito:
    const tokenSimulado = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTYiLCJlbWFpbCI6I' + btoa(email.value) + 'nJyb2wiOiJ1c2VyIn0.test'
    authStore.setToken(tokenSimulado)
    await authStore.fetchMe()
    
    $q.notify({ color: 'positive', message: '¡Bienvenido de nuevo!' })
  } catch (error) {
    $q.notify({ color: 'negative', message: 'Credenciales inválidas o error en el servidor.' })
  } finally {
    $q.loading.hide()
  }
}
</script>