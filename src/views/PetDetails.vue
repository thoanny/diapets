<script setup lang="ts">
import { supabase } from '@/lib/supabaseClient';
import { useAnimalsStore } from '@/stores/animals';
import {
  IconCake,
  IconCopy,
  IconPaw,
  IconPencil,
  IconShare,
  IconTrash,
  IconX,
} from '@tabler/icons-vue';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const animalsStore = useAnimalsStore();
const { getInvites, deleteAnimal, leaveAnimal, refreshAnimals } = animalsStore;
const { animalsFiltered, invitesFiltered } = storeToRefs(animalsStore);
const modal = useTemplateRef('edit-animal');

const animal = computed(() => {
  return animalsFiltered.value.find((a) => a.id === route.params.id);
});

const invites = computed(() => {
  return invitesFiltered.value.filter((i) => i.animal_id === route.params.id);
});

const share = async (animalId: string) => {
  const { data } = await supabase
    .from('invites')
    .insert({ animal_id: animalId })
    .select('code')
    .single();
  console.log('data', data);
  getInvites();
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error(err);
  }
};

const submit = async () => {
  await supabase.from('animals').update(editAnimal.value).eq('id', animal.value?.id);
  refreshAnimals();
  modal.value?.close();
};

const handleOpenModal = () => {
  editAnimal.value = {
    name: animal.value?.name ?? null,
    birth_date: animal.value?.birth_date ?? null,
    species: animal.value?.species ?? null,
  };
  modal.value?.showModal();
};

const species = {
  Indéfinie: null,
  Chat: 'cat',
  Chien: 'dog',
};

const getSpecie = (specie: string | null) => {
  const idx = Object.values(species).findIndex((s) => s === specie);
  return Object.keys(species)[idx];
};

const editAnimal = ref<{
  name: string | null;
  birth_date: string | null;
  species: 'cat' | 'dog' | null;
}>({
  name: null,
  birth_date: null,
  species: null,
});

onMounted(() => {
  refreshAnimals();
});

watch(animal, async (newAnimal, oldAnimal) => {
  if (newAnimal === oldAnimal) {
    return;
  }
  // editAnimal.value = {
  //   name: newAnimal?.name ?? null,
  //   birth_date: newAnimal?.birth_date ?? null,
  //   species: newAnimal?.species ?? null,
  // };
});
</script>

<template>
  <template v-if="animal">
    <Teleport to="body" v-if="editAnimal">
      <dialog ref="edit-animal" class="modal px-4">
        <div class="modal-box max-h-[95dvh] max-w-xs mx-auto">
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              <IconX class="size-4" />
            </button>
          </form>
          <h3 class="font-bold flex gap-1 items-center">Modifier l'animal</h3>
          <form @submit.prevent="submit">
            <fieldset class="fieldset">
              <label class="label" for="name">Nom de l'animal</label>
              <input type="text" class="input" id="name" v-model="editAnimal.name" />
            </fieldset>
            <fieldset class="fieldset">
              <label class="label" for="date">Date de naissance</label>
              <input
                type="date"
                class="input"
                placeholder=""
                id="date"
                v-model="editAnimal.birth_date"
              />
            </fieldset>
            <fieldset class="fieldset">
              <label class="label">Espèce</label>
              <div>
                <div role="tablist" class="tabs tabs-box bg-base-300 flex-nowrap">
                  <input
                    type="radio"
                    name="my_tabs_1"
                    class="tab"
                    :aria-label="`${specie}`"
                    v-for="(value, specie) in species"
                    :key="specie"
                    :checked="value === editAnimal.species"
                    v-model="editAnimal.species"
                    :value="value"
                  />
                </div>
              </div>
            </fieldset>
            <button type="submit" class="btn btn-primary btn-block mt-2">Enregistrer</button>
          </form>
        </div>
      </dialog>
    </Teleport>

    <h1 class="h1 mt-0!">{{ animal.name }}</h1>
    <ul class="list bg-base-100 rounded-box border border-base-300">
      <li class="list-row items-center py-3">
        <div class="bg-primary/10 size-8 flex items-center justify-center rounded-box">
          <IconCake class="size-5 text-primary" stroke="1.75" />
        </div>
        <div>
          <div class="font-semibold">Naissance</div>
        </div>
        <div>
          {{
            animal.birth_date
              ? new Intl.DateTimeFormat('fr-FR', {
                  dateStyle: 'medium',
                }).format(new Date(animal.birth_date))
              : 'Inconnue'
          }}
        </div>
      </li>
      <li class="list-row items-center py-3">
        <div class="bg-primary/10 size-8 flex items-center justify-center rounded-box">
          <IconPaw class="size-5 text-primary" stroke="1.75" />
        </div>
        <div>
          <div class="font-semibold">Espèce</div>
        </div>
        <div>
          {{ getSpecie(animal?.species) ?? 'Inconnue' }}
        </div>
      </li>
    </ul>

    <div class="flex flex-col gap-2 mt-4" v-if="animal.is_owner">
      <button class="btn btn-primary" @click="handleOpenModal">
        <IconPencil class="size-5" stroke="1.75" /> Modifier l'animal
      </button>
      <button @click="share(animal.id)" class="btn btn-primary" v-if="animal.is_owner">
        <IconShare class="size-5" /> Partager l'animal
      </button>
    </div>

    <template v-if="invites">
      <h2 class="h2" v-if="invites.length === 1">Mon code d'invitation</h2>
      <h2 class="h2" v-if="invites.length > 1">Mes codes d'invitations</h2>

      <ul
        class="list bg-base-100 rounded-box border border-base-300 mt-4"
        v-if="invites.length > 0"
      >
        <li class="list-row items-center py-3" v-for="(invite, key) in invitesFiltered" :key>
          <div class="list-col-grow">
            <div class="font-bold">{{ invite.code }}</div>
            <div class="text-xs">
              Expiration&nbsp;:
              {{
                new Intl.DateTimeFormat('fr-FR', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                }).format(new Date(invite.expires_at))
              }}
            </div>
          </div>
          <div>
            <button
              class="btn btn-soft btn-square btn-primary btn-sm"
              @click="copyToClipboard(invite.code)"
            >
              <IconCopy class="size-5" stroke="1.75" />
            </button>
          </div>
        </li>
      </ul>
    </template>

    <div class="mt-4 flex flex-col">
      <button
        class="btn btn-error btn-outline"
        @click="deleteAnimal(animal.id)"
        v-if="animal.is_owner"
      >
        <IconTrash class="size-5" /> Supprimer l'animal
      </button>
      <button
        @click="leaveAnimal(animal.id)"
        class="btn btn-error btn-outline"
        v-if="!animal.is_owner"
      >
        <IconX class="size-5" /> Quitter l'animal
      </button>
    </div>
  </template>
</template>
