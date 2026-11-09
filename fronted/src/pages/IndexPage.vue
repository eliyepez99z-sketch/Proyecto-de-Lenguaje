<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="q-pa-lg shadow-4" style="width: 380px; max-width: 90vw; border-radius: 12px;">
      <q-card-section class="text-center">
        <q-avatar size="64px" color="primary" text-color="white" icon="lock" class="q-mb-sm" />
        <div class="text-h5 text-weight-bold text-grey-9">Iniciar Sesión</div>
        <div class="text-caption text-grey-7">Ingresa tus credenciales para acceder</div>
      </q-card-section>

      <q-card-section class="q-gutter-md">
        <q-input
          v-model="email"
          label="Correo Electrónico"
          outlined
          dense
          type="email"
          prepend-icon="email"
        />

        <q-input
          v-model="password"
          label="Contraseña"
          outlined
          dense
          type="password"
          prepend-icon="lock"
        />
      </q-card-section>

      <q-card-actions class="column q-gutter-sm q-px-md">
        <q-btn
          color="primary"
          label="Ingresar"
          class="full-width"
          unelevated
          size="md"
          @click="handleLogin"
        />
        
        <q-btn
          color="secondary"
          outline
          label="Simular Token (Prueba)"
          class="full-width"
          size="sm"
          @click="simularToken"
        />
      </q-card-actions>

      <q-card-section v-if="authStore.user" class="q-mt-sm bg-green-1 text-green-9 rounded-borders text-center">
        <div class="text-weight-bold">Sesión Activa</div>
        <div class="text-caption">{{ authStore.user.email }}</div>
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

const handleLogin = async () => {
  if (!email.value || !password.value) {
    $q.notify({ type: 'warning', message: 'Ingresa correo y contraseña' })
    return
  }

  try {
    $q.loading.show()
    // Aquí se conecta con el backend NestJS
    const tokenSimulado = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test'
    authStore.setToken(tokenSimulado)
    await authStore.fetchMe()
    $q.notify({ type: 'positive', message: '¡Sesión iniciada con éxito!' })
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error al iniciar sesión' })
  } finally {
    $q.loading.hide()
  }
}

const simularToken = async () => {
  try {
    $q.loading.show()
    const tokenPrueba = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test'
    authStore.setToken(tokenPrueba)
    await authStore.fetchMe()
    $q.notify({ type: 'positive', message: 'Token de prueba asignado' })
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error de conexión con /auth/me' })
  } finally {
    $q.loading.hide()
  }
}
</script>