<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <!-- Renderiza directamente la página actual (LoginPage o PerfilPage) sin barras ni menús predeterminados -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
// Layout base sin elementos estáticos
</script>