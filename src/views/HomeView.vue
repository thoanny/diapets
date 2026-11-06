<script setup lang="ts">
import AppEntries from '@/components/AppEntries.vue';
import { useAuth } from '@/composables/useAuth';

const { user } = useAuth();
</script>

<template>
  <template v-if="user">
    <h2 class="h1 mt-0!">Mesures</h2>
    <AppEntries />
  </template>
  <template v-else>
    <h1 class="h1">Hello world!</h1>
  </template>
</template>
