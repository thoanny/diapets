import { useAuth } from '@/composables/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { ENTRY_TYPES, type Entry } from '@/types/entries';
import { defineStore, storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useAnimalsStore } from './animals';

const { user } = useAuth();

export const useEntriesStore = defineStore('entries', () => {
  const entries = ref<Entry[]>([]);
  const errors = ref<string[]>([]);

  const entriesFiltered = computed(() => {
    const animalsStore = useAnimalsStore();
    const { animals } = storeToRefs(animalsStore);

    return entries.value
      .map((e) => ({
        ...e,
        _animal: animals.value.find((a) => a.id === e.animal_id),
        _is_user: e.user_id === user.value?.id,
        _type: ENTRY_TYPES.find((t) => t.id === e.type),
      }))
      .reverse();
  });

  const getEntries = async () => {
    const { data, error: fetchError } = await supabase.from('entries').select();
    if (fetchError) {
      errors.value.push(fetchError.message);
      return;
    }

    entries.value = data;
  };

  const refresh = () => {
    getEntries();
  };

  const addEntry = async (
    animal_id: string,
    measured_at: string,
    type: string,
    value: string | null,
    notes: string | undefined,
  ) => {
    if (!user.value) {
      errors.value.push("Vous n'êtes pas connecté·e");
      return;
    }

    const { data: entry, error: insertError } = await supabase
      .from('entries')
      .insert({
        animal_id,
        measured_at: new Date(measured_at).toISOString(),
        type,
        value: value ? Number(value) : 0,
        notes,
      })
      .select()
      .single();

    if (insertError) {
      errors.value.push(insertError.message);
      return;
    }

    console.log(`Mesure ${entry.id} a été ajoutée`);

    refresh();
  };

  const deleteEntry = async (entryId: string) => {
    const { data, error: deleteError } = await supabase
      .from('entries')
      .delete()
      .eq('id', entryId)
      .select();
    if (deleteError) {
      errors.value.push(deleteError.message);
      return;
    }
    if (!data.length) {
      errors.value.push("Seul le propriétaire peut supprimer l'entrée");
      return;
    }
    refresh();
  };

  return { entriesFiltered, getEntries, addEntry, deleteEntry, refresh, errors };
});
