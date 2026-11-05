import { useAuth } from '@/composables/useAuth';
import { supabase } from '@/lib/supabaseClient';
import type { Animal, AnimalInvite, AnimalMember } from '@/types/animals';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useEntriesStore } from './entries';

const { user } = useAuth();

export const useAnimalsStore = defineStore('animals', () => {
  const animals = ref<Animal[]>([]);
  const members = ref<AnimalMember[]>([]);
  const invites = ref<AnimalInvite[]>([]);
  const errors = ref<string[]>([]);
  const isAnimalsLoading = ref<boolean>(true);
  const isMembersLoading = ref<boolean>(true);
  const isInvitesLoading = ref<boolean>(true);

  const animalsFiltered = computed(() => {
    return animals.value
      .map((animal) => ({
        ...animal,
        ...members.value.find((m) => m.animal_id === animal.id),
        is_owner: animal.created_by === user.value?.id,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  const invitesFiltered = computed(() => {
    return invites.value
      .map((invite) => ({
        ...invite,
        ...animals.value.find((a) => a.id === invite.animal_id),
      }))
      .filter((i) => i.created_by === user.value?.id);
  });

  const getAnimals = async () => {
    isAnimalsLoading.value = true;
    const { data, error: fetchError } = await supabase.from('animals').select();
    if (fetchError) {
      errors.value.push(fetchError.message);
      isAnimalsLoading.value = false;
      return;
    }

    animals.value = data;
    isAnimalsLoading.value = false;
  };

  const getAnimalMembers = async () => {
    isMembersLoading.value = true;
    const { data, error: fetchError } = await supabase.from('animal_members').select();
    if (fetchError) {
      errors.value.push(fetchError.message);
      isMembersLoading.value = false;
      return;
    }

    members.value = data;
    isMembersLoading.value = false;
  };

  const getInvites = async () => {
    isInvitesLoading.value = true;
    const { data, error: fetchError } = await supabase.from('invites').select();
    if (fetchError) {
      errors.value.push(fetchError.message);
      isInvitesLoading.value = false;
      return;
    }

    invites.value = data;
    isInvitesLoading.value = false;
  };

  const refresh = () => {
    getAnimals();
    getAnimalMembers();
    getInvites();
  };

  const addAnimal = async (type: string, value: string) => {
    if (!user.value) {
      errors.value.push("Vous n'êtes pas connecté·e");
      return;
    }

    if (type === 'code') {
      const { refresh: entriesRefresh } = useEntriesStore();
      const { data: animal, error: addError } = await supabase.rpc('join_animal', {
        p_code: value,
      });
      if (addError) {
        errors.value.push(addError.message);
        return;
      }

      console.log(`${animal.name} a été ajouté`);
      entriesRefresh();
      refresh();
    } else if (type === 'name') {
      const { data: animal, error: insertError } = await supabase
        .from('animals')
        .insert({ name: value })
        .select()
        .single();

      if (insertError) {
        errors.value.push(insertError.message);
        return;
      }

      console.log(`${animal.name} a été ajouté`);

      refresh();
    }
  };

  const deleteAnimal = async (animalId: string) => {
    const { refresh: entriesRefresh } = useEntriesStore();
    const { data, error: deleteError } = await supabase
      .from('animals')
      .delete()
      .eq('id', animalId)
      .select();
    if (deleteError) {
      errors.value.push(deleteError.message);
      return;
    }
    if (!data.length) {
      errors.value.push("Seul le propriétaire peut supprimer l'animal");
      return;
    }
    refresh();
    entriesRefresh();
  };

  const leaveAnimal = async (animalId: string) => {
    if (!user.value) {
      errors.value.push("Vous n'êtes pas connecté·e");
      return;
    }

    const { refresh: entriesRefresh } = useEntriesStore();
    const { data, error: deleteError } = await supabase
      .from('animal_members')
      .delete()
      .eq('animal_id', animalId)
      .eq('user_id', user.value.id)
      .select();

    if (deleteError) {
      errors.value.push(deleteError.message);
      return;
    }

    if (!data.length) {
      errors.value.push('Vous ne pouvez pas quitter cet animal...');
      return;
    }

    refresh();
    entriesRefresh();
  };

  return {
    errors,
    animals,
    animalsFiltered,
    invitesFiltered,
    refresh,
    addAnimal,
    deleteAnimal,
    leaveAnimal,
    getInvites,
    isAnimalsLoading,
    isMembersLoading,
    isInvitesLoading,
  };
});
