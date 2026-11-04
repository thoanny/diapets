import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';
import { ref } from 'vue';

const user = ref<User | null>(null);
supabase.auth.onAuthStateChange((_event, session) => {
  user.value = session?.user ?? null;
});

export const useAuth = () => ({
  user,
  signup: (email: string, password: string) => {
    return supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${location.origin}/login` },
    });
  },
  signIn: (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  },
  signOut: () => {
    return supabase.auth.signOut();
  },
  forgotPassword: (email: string) => {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/reset-password`,
    });
  },
  updatePassword: (password: string) => {
    return supabase.auth.updateUser({ password });
  },
  async deleteAccount() {
    const { error } = await supabase.functions.invoke('delete-account');
    if (!error) await supabase.auth.signOut();
    return { error };
  },
});
