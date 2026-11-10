<script setup lang="ts">
import AppDock from '@/components/AppDock.vue';
import { watch } from 'vue';
import { useAuth } from './composables/useAuth';
import { useAnimalsStore } from './stores/animals';

const { user } = useAuth();
const animalsStore = useAnimalsStore();
const { refreshAnimals } = animalsStore;

watch(user, async (userIsLoggedIn) => {
  if (userIsLoggedIn !== null) {
    refreshAnimals();
  }
});
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
