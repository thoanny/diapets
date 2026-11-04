<script setup lang="ts">
import AppDock from '@/components/AppDock.vue';
</script>

<template>
  <header>
    <AppDock />
  </header>

  <main class="p-4 pb-24">
    <RouterView />
  </main>
</template>

<style scoped></style>
