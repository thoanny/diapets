<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { useAnimalsStore } from '@/stores/animals';
import { IconPawFilled, IconPlus, IconShare, IconTrash, IconX } from '@tabler/icons-vue';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';

const { user } = useAuth();
const animalsStore = useAnimalsStore();
const { addAnimal, deleteAnimal, leaveAnimal, refresh, getInvites } = animalsStore;
const { errors, invitesFiltered, animalsFiltered } = storeToRefs(animalsStore);

const type = ref('name');
const nameOrCode = ref('');

const submit = async () => {
  await addAnimal(type.value, nameOrCode.value)
    .then(() => {
      refresh();
    })
    .finally(() => {
      nameOrCode.value = '';
    });
};

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

onMounted(() => {
  refresh();
});
</script>

<template>
  <div class="alert alert-error my-4" v-if="errors.length > 0">
    <ul class="list-disc ml-4">
      <li v-for="(error, key) in errors" :key>{{ error }}</li>
    </ul>
  </div>

  <div class="card card-xs max-w-full! my-4">
    <form @submit.prevent="submit" class="card-body flex-row items-center">
      <div class="card-title sr-only">Ajouter un animal</div>
      <fieldset class="fieldset">
        <label for="type" class="label sr-only">Type</label>
        <select name="type" id="type" v-model="type" class="select w-24">
          <option value="name">Nom</option>
          <option value="code">Code</option>
        </select>
      </fieldset>
      <fieldset class="fieldset grow">
        <label for="name" class="label sr-only">{{
          type === 'name' ? "Nom de l'animal" : "Code d'invitation"
        }}</label>
        <input
          type="text"
          id="name"
          class="input"
          v-model="nameOrCode"
          :placeholder="type === 'name' ? 'Nom de l\'animal' : 'Code d\'invitation'"
          autocomplete="off"
        />
      </fieldset>
      <button class="btn btn-primary btn-square" type="submit">
        <IconPlus class="size-5" />
      </button>
    </form>
  </div>

  <h2 v-if="animalsFiltered.length === 1">Mon animal</h2>
  <h2 v-if="animalsFiltered.length > 1">Mes animaux</h2>

  <ul
    class="list bg-base-100 rounded-box border border-base-300 mt-4"
    v-if="animalsFiltered.length > 0"
  >
    <li class="list-row items-center py-3" v-for="animal in animalsFiltered" :key="animal.id">
      <div>
        <IconPawFilled class="text-primary size-8" />
      </div>
      <div>
        <div class="font-bold">{{ animal.name }}</div>
      </div>

      <button
        @click="share(animal.id)"
        class="btn btn-primary btn-soft btn-square btn-sm"
        v-if="animal.is_owner"
      >
        <IconShare class="size-5" />
      </button>
      <button
        class="btn btn-error btn-soft btn-square btn-sm"
        @click="deleteAnimal(animal.id)"
        v-if="animal.is_owner"
      >
        <IconTrash class="size-5" />
      </button>
      <button
        @click="leaveAnimal(animal.id)"
        class="btn btn-error btn-soft btn-square btn-sm"
        v-if="!animal.is_owner"
      >
        <IconX class="size-5" />
      </button>
    </li>
  </ul>

  <h2 v-if="invitesFiltered.length === 1">Mon code d'invitation</h2>
  <h2 v-if="invitesFiltered.length > 1">Mes codes d'invitations</h2>

  <ul
    class="list bg-base-100 rounded-box border border-base-300 mt-4"
    v-if="invitesFiltered.length > 0"
  >
    <li class="list-row items-center py-3" v-for="(invite, key) in invitesFiltered" :key>
      <div>
        <IconShare class="text-primary size-8" />
      </div>
      <div>
        <div class="font-bold">Invitation pour {{ invite.name }}</div>
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
        <button class="btn btn-soft font-mono" @click="copyToClipboard(invite.code)">
          {{ invite.code }}
        </button>
      </div>

      <!-- <button
        class="btn btn-error btn-soft btn-square btn-sm"
        @click="deleteAnimal(animal.id)"
        v-if="animal.role === 'owner'"
      >
        <IconTrash class="size-5" />
      </button> -->
    </li>
  </ul>
</template>
