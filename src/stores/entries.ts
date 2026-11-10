import { useAuth } from '@/composables/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { ENTRY_TYPES, type Entry, type EntryTypeDetails } from '@/types/entries';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

const { user } = useAuth();

export const useEntriesStore = defineStore('entries', () => {
  const entries = ref<Entry[]>([]);
  const errors = ref<string[]>([]);
  const isEntriesLoading = ref<boolean>(true);
  const currentEntryType = ref<EntryTypeDetails | undefined>();

  const entriesFiltered = computed(() => {
    return entries.value
      .map((entry) => ({
        ...entry,
        _is_user: entry.user_id === user.value?.id,
        _type: ENTRY_TYPES.find((t) => t.id === entry.type),
      }))
      .filter((entry) => {
        if (!currentEntryType.value) {
          return true;
        }

        return entry.type === currentEntryType.value.id;
      })
      .sort((a, b) => new Date(a.measured_at).getTime() - new Date(b.measured_at).getTime())
      .reverse();
  });

  const getEntries = async () => {
    isEntriesLoading.value = true;
    const { data, error: fetchError } = await supabase
      .from('entries')
      .select('id, user_id, measured_at, type, value, notes, animals(id,name)')
      .overrideTypes<Entry[], { merge: false }>();
    if (fetchError) {
      errors.value.push(fetchError.message);
      isEntriesLoading.value = false;
      return;
    }

    entries.value = data;
    isEntriesLoading.value = false;
  };

  const refreshEntries = () => {
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

    refreshEntries();
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
    refreshEntries();
  };

  return {
    entriesFiltered,
    getEntries,
    addEntry,
    deleteEntry,
    refreshEntries,
    errors,
    isEntriesLoading,
    currentEntryType,
  };
});
