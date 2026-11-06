<script setup lang="ts">
import AppLoading from '@/components/AppLoading.vue';
import { useEntriesStore } from '@/stores/entries';
import { ENTRY_TYPES, type EntryTypeDetails } from '@/types/entries';
import { IconFilter, IconTrash } from '@tabler/icons-vue';
import { storeToRefs } from 'pinia';
import { onMounted, useTemplateRef } from 'vue';

const entriesStore = useEntriesStore();
const { getEntries, deleteEntry } = entriesStore;
const { entriesFiltered, errors, isEntriesLoading, currentEntryType } = storeToRefs(entriesStore);
const popover = useTemplateRef('popover-1');

const updateCurrentEntryType = (entryType: EntryTypeDetails | undefined) => {
  currentEntryType.value = entryType;
  popover.value?.hidePopover();
};

onMounted(() => {
  getEntries();
});
</script>

<template>
  <div>
    <button class="btn btn-primary" popovertarget="popover-1" style="anchor-name: --anchor-1">
      <template v-if="currentEntryType">
        <component
          :is="currentEntryType.icon"
          v-if="currentEntryType?.icon"
          class="size-5"
          stroke="2"
        />
        {{ currentEntryType?.name }}
      </template>
      <template v-else>
        <IconFilter class="size-5" stroke="2" />
        Toutes
      </template>
    </button>
    <ul
      class="dropdown menu rounded-lg bg-base-100 border border-base-300 mt-1"
      popover
      id="popover-1"
      ref="popover-1"
      style="position-anchor: --anchor-1"
    >
      <li>
        <button
          @click.prevent="updateCurrentEntryType(undefined)"
          :class="{
            'btn-soft btn-primary': !currentEntryType,
          }"
        >
          <IconFilter class="size-5" stroke="1.75" />
          Toutes
        </button>
      </li>
      <li v-for="entryType in ENTRY_TYPES" :key="entryType.id">
        <button
          @click.prevent="updateCurrentEntryType(entryType)"
          :class="{
            'btn-soft btn-primary': currentEntryType?.id === entryType.id,
          }"
        >
          <component :is="entryType.icon" v-if="entryType.icon" class="size-5" stroke="1.75" />
          {{ entryType.name }}
        </button>
      </li>
    </ul>
  </div>

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
            {{ entry.animals.name }} / {{ entry._is_user ? 'Vous' : "Quelqu'un" }} /
            {{
              new Intl.DateTimeFormat('fr-FR', {
                dateStyle: 'medium',
                timeStyle: 'short',
              }).format(new Date(entry.measured_at))
            }}
          </div>
          <div class="text-xs font-semibold opacity-60">
            {{ entry._type?.name }}&nbsp;: {{ entry.value }}&nbsp;{{ entry._type?.unit }}
            <template v-if="entry.type === 'glucose'">
              ({{ Math.round(entry.value * 0.18 * 100) / 100 }}&nbsp;g/L)</template
            >
            <template v-if="entry.notes"> / {{ entry.notes }}</template>
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
    <!-- TODO : pagination -->
    <div class="alert alert-info alert-soft mt-4" v-else>Aucune mesure enregistrée...</div>
  </template>
</template>
