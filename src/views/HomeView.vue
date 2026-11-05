<script setup lang="ts">
import AppAnimals from '@/components/AppAnimals.vue';
import AppLoading from '@/components/AppLoading.vue';
import { useAuth } from '@/composables/useAuth';
import { useEntriesStore } from '@/stores/entries';
import { IconTrash } from '@tabler/icons-vue';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const { user } = useAuth();
const entriesStore = useEntriesStore();
const { getEntries, deleteEntry } = entriesStore;
const { entriesFiltered, errors, isEntriesLoading } = storeToRefs(entriesStore);

onMounted(() => {
  getEntries();
});
</script>

<template>
  <template v-if="user">
    <h2 class="h1 mt-0!">Mesures</h2>
    <AppLoading v-if="isEntriesLoading" />
    <template v-else>
      <p v-if="errors.length > 0">Error loading entries: {{ errors.join(', ') }}</p>
      <ul
        v-if="entriesFiltered.length > 0"
        class="list bg-base-100 rounded-box border border-base-300 mt-4"
      >
        <li class="list-row items-center py-3" v-for="entry in entriesFiltered" :key="entry.id">
          <div>
            <component
              :is="entry._type.icon"
              v-if="entry._type?.icon"
              class="size-8 text-primary"
              stroke="1.5"
            />
          </div>
          <div class="leading-none">
            <div class="font-bold">
              {{ entry._animal?.name }} / {{ entry._is_user ? 'Vous' : "Quelqu'un" }} /
              {{
                new Intl.DateTimeFormat('fr-FR', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                }).format(new Date(entry.measured_at))
              }}
            </div>
            <div class="text-xs font-semibold opacity-60">
              {{ entry._type?.name }}&nbsp;: {{ entry.value }}&nbsp;{{ entry._type?.unit }}
            </div>
          </div>
          <button
            class="btn btn-error btn-soft btn-square btn-sm"
            @click.prevent="deleteEntry(entry.id)"
            v-if="entry._is_user"
          >
            <IconTrash class="size-5" />
          </button>
        </li>
      </ul>
      <div class="alert alert-info alert-soft" v-else>Aucune mesure enregistrée...</div>
    </template>

    <h2 class="h1">Animaux</h2>
    <AppAnimals v-if="user" />
  </template>
  <template v-else>
    <h1 class="h1">Hello world!</h1>
  </template>
</template>
