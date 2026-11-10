<script setup lang="ts">
import AppEntries from '@/components/AppEntries.vue';
import EntriesChart from '@/components/EntriesChart.vue';
import { useAnimalsStore } from '@/stores/animals';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const animalsStore = useAnimalsStore();
const { animalsFiltered } = storeToRefs(animalsStore);
const { refreshAnimals } = useAnimalsStore();

onMounted(() => {
  refreshAnimals();
});
</script>

<template>
  <template v-if="animalsFiltered.length > 0">
    <h2 class="h2 mt-0!">Évolution des 2 dernières semaines</h2>
    <template v-for="animal in animalsFiltered" :key="animal.id">
      <h3 class="h3" v-show="animalsFiltered.length > 1">{{ animal.name }}</h3>
      <EntriesChart :animal-id="animal.id" />
    </template>
  </template>

  <h2 class="h2">Dernières mesures</h2>
  <AppEntries />
</template>
