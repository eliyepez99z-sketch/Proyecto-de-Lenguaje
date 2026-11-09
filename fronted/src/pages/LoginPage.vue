<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="q-pa-lg shadow-4" style="width: 380px; max-width: 90vw; border-radius: 12px;">
      <q-card-section class="text-center">
        <q-avatar size="64px" color="primary" text-color="white" icon="lock" class="q-mb-sm" />
        <div class="text-h5 text-weight-bold text-grey-9">Iniciar Sesión</div>
        <div class="text-caption text-grey-7">Proyecto de Lenguaje</div>
      </q-card-section>

      <q-card-section class="q-gutter-md">
        <q-input
          v-model="email"
          label="Correo Electrónico"
          outlined
          dense
          type="email"
        />

        <q-input
          v-model="password"
          label="Contraseña"
          outlined
          dense
          type="password"
        />
      </q-card-section>

      <q-card-actions class="column q-gutter-sm q-px-md">
        <q-btn
          color="primary"
          label="Ingresar"
          class="full-width"
          unelevated
          @click="handleLogin"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const $q = useQuasar()
const router = useRouter()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  if (!email.value || !password.value) {
    $q.notify({ type: 'warning', message: 'Por favor completa todos los campos' })
    return
  }

  try {
    $q.loading.show()
    await authStore.login(email.value, password.value)
    $q.notify({ type: 'positive', message: '¡Bienvenido!' })
    router.push('/perfil') // Redirige a la página de perfil tras iniciar sesión
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Credenciales inválidas o error de servidor' })
  } finally {
    $q.loading.hide()
  }
}
</script>