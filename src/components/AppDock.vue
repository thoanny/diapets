<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
import { useAnimalsStore } from '@/stores/animals';
import { useEntriesStore } from '@/stores/entries';
import { ENTRY_TYPES, type EntryType, type NewEntry } from '@/types/entries';
import {
  IconHome,
  IconPaw,
  IconPlus,
  IconSettings,
  IconUser,
  IconUserKey,
  IconWritingSign,
  IconX,
} from '@tabler/icons-vue';
import { storeToRefs } from 'pinia';
import { computed, ref, useTemplateRef } from 'vue';

const { user } = useAuth();
const selectEntryModal = useTemplateRef('select-entry-modal');
const addEntryModal = useTemplateRef('add-entry-modal');

const animalsStore = useAnimalsStore();
const entriesStore = useEntriesStore();
const { addEntry } = entriesStore;
const { animalsFiltered } = storeToRefs(animalsStore);

const toDatetimeLocal = (date = new Date()) =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

const currentEntry = ref<NewEntry>({
  type: 'glucose',
  animal_id: '',
  measured_at: toDatetimeLocal(),
  value: null,
});

const currentType = computed(() => {
  return ENTRY_TYPES.find((t) => t.id === currentEntry.value.type);
});

const handleAddEntry = (typeId: EntryType) => {
  selectEntryModal.value?.close();
  currentEntry.value = {
    type: ENTRY_TYPES.find((t) => t.id === typeId)?.id ?? 'glucose',
    animal_id: animalsFiltered.value[0]?.animal_id ?? '',
    measured_at: toDatetimeLocal(),
    value: null,
  };
  addEntryModal.value?.showModal();
};

const submit = () => {
  addEntry(
    currentEntry.value.animal_id,
    currentEntry.value.measured_at,
    currentEntry.value.type,
    currentEntry.value.value,
    currentEntry.value.notes,
  );
  addEntryModal.value?.close();
};
</script>

<template>
  <Teleport to="body">
    <dialog ref="select-entry-modal" class="modal modal-bottom px-4">
      <div class="modal-box">
        <h3 class="text-lg font-bold">Sélectionner une mesure</h3>
        <div class="grid grid-cols-2 gap-2 pt-4">
          <button
            class="btn btn-primary"
            v-for="type in ENTRY_TYPES"
            :key="type.id"
            @click="handleAddEntry(type.id)"
          >
            <component v-if="type.icon" :is="type.icon" class="size-6" stroke="1.75" />
            {{ type.name }}
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
    <dialog ref="add-entry-modal" class="modal px-4">
      <div class="modal-box max-h-[95dvh] max-w-xs">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            <IconX class="size-4" />
          </button>
        </form>
        <h3 class="font-bold flex gap-1 items-center">
          <component v-if="currentType?.icon" :is="currentType.icon" class="size-6" stroke="2" />
          {{ currentType?.name }}
        </h3>
        <form @submit.prevent="submit">
          <fieldset class="fieldset mt-2">
            <label for="entry_animal" class="label">Animal</label>
            <select id="entry_animal" v-model="currentEntry.animal_id" class="select">
              <option :value="animal.id" v-for="animal in animalsFiltered" :key="animal.id">
                {{ animal.name }}
              </option>
            </select>
          </fieldset>
          <fieldset class="fieldset">
            <label class="label" for="entry_value">Valeur</label>
            <label class="input">
              <input
                type="text"
                class="grow"
                placeholder=""
                id="entry_value"
                required
                v-model="currentEntry.value"
                autofocus
              />
              {{ currentType?.unit }}
            </label>
          </fieldset>
          <fieldset class="fieldset">
            <label class="label" for="datetime">Date et heure</label>
            <input
              type="datetime-local"
              class="input"
              placeholder=""
              id="datetime"
              required
              v-model="currentEntry.measured_at"
            />
          </fieldset>
          <fieldset class="fieldset">
            <label class="label" for="entry_notes">Notes</label>
            <textarea class="textarea" id="entry_notes" v-model="currentEntry.notes"></textarea>
          </fieldset>
          <pre>{{ currentEntry }}</pre>
          <button type="submit" class="btn btn-primary btn-block mt-2">Ajouter</button>
        </form>
      </div>
    </dialog>
  </Teleport>

  <div class="dock" v-if="user">
    <RouterLink :to="{ name: 'Home' }">
      <IconHome class="size-6" stroke="1.5" />
      <span class="dock-label">Accueil</span>
    </RouterLink>

    <RouterLink to="/pet">
      <IconPaw class="size-6" stroke="1.5" />
      <span class="dock-label">{{
        animalsFiltered.length < 2 ? 'Mon animal' : 'Mes animaux'
      }}</span>
    </RouterLink>

    <div class="-mt-16">
      <button
        class="btn btn-primary btn-circle size-12"
        @click.prevent="selectEntryModal?.showModal()"
        v-if="animalsFiltered.length > 0"
      >
        <IconPlus class="size-6" />
      </button>
    </div>

    <RouterLink :to="{ name: 'Account' }">
      <IconUser class="size-6" stroke="1.5" />
      <span class="dock-label">Mon compte</span>
    </RouterLink>

    <RouterLink to="/settings">
      <IconSettings class="size-6" stroke="1.5" />
      <span class="dock-label">Paramètres</span>
    </RouterLink>
  </div>
  <div class="dock" v-else>
    <RouterLink :to="{ name: 'Home' }">
      <IconHome class="size-6" stroke="1.5" />
      <span class="dock-label">Accueil</span>
    </RouterLink>

    <RouterLink :to="{ name: 'Login' }">
      <IconUserKey class="size-6" stroke="1.5" />
      <span class="dock-label">Connexion</span>
    </RouterLink>

    <RouterLink :to="{ name: 'Signup' }">
      <IconWritingSign class="size-6" stroke="1.5" />
      <span class="dock-label">Inscription</span>
    </RouterLink>
  </div>
</template>
