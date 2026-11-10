<script setup lang="ts">
import { useAnimalsStore } from '@/stores/animals';
import { IconChevronRight, IconPawFilled, IconPlus } from '@tabler/icons-vue';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import AppLoading from './AppLoading.vue';

const animalsStore = useAnimalsStore();
const { addAnimal, refreshAnimals } = animalsStore;
const { errors, animalsFiltered, isAnimalsLoading } = storeToRefs(animalsStore);

const type = ref('name');
const nameOrCode = ref('');

const submit = async () => {
  await addAnimal(type.value, nameOrCode.value)
    .then(() => {
      refreshAnimals();
    })
    .finally(() => {
      nameOrCode.value = '';
    });
};

onMounted(() => {
  refreshAnimals();
});
</script>

<template>
  <div class="alert alert-error mb-4" v-if="errors.length > 0">
    <ul class="list-disc ml-4">
      <li v-for="(error, key) in errors" :key>{{ error }}</li>
    </ul>
  </div>

  <div class="card card-xs max-w-full! mb-4">
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

  <AppLoading v-if="isAnimalsLoading" />
  <template v-else>
    <h2 class="h2" v-if="animalsFiltered.length === 1">Mon animal</h2>
    <h2 class="h2" v-if="animalsFiltered.length > 1">Mes animaux</h2>

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
        <RouterLink
          :to="{ name: 'PetDetails', params: { id: animal.id } }"
          class="btn btn-primary btn-soft btn-square btn-sm"
        >
          <IconChevronRight />
        </RouterLink>
      </li>
    </ul>
  </template>
</template>
