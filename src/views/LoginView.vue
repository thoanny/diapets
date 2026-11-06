<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const { signIn } = useAuth();
const router = useRouter();
const email = ref<string>('');
const password = ref<string>('');
const error = ref<string>('');

const submit = async () => {
  if (!email.value || !password.value) {
    error.value = 'E-mail et mot de passe requis.';
    return;
  }
  const { error: e } = await signIn(email.value, password.value);
  if (e) error.value = e.message;
  else router.push('/');
};
</script>

<template>
  <div class="card">
    <form class="card-body" @submit.prevent="submit">
      <h1 class="card-title">Connexion</h1>
      <div class="alert alert-error alert-soft" v-if="error">
        {{ error }}
      </div>
      <fieldset class="fieldset">
        <label for="email" class="label">Adresse e-mail</label>
        <input id="email" type="email" class="input" autocomplete="email" v-model="email" />
      </fieldset>
      <fieldset class="fieldset">
        <label for="password" class="label">Mot de passe</label>
        <input
          id="password"
          type="password"
          class="input"
          autocomplete="current-password"
          v-model="password"
        />
        <RouterLink to="/forgot-password" class="text-end hover:underline">
          Mot de passe oublié&nbsp;?
        </RouterLink>
      </fieldset>
      <button type="submit" class="btn btn-primary">Se connecter</button>
      <RouterLink :to="{ name: 'Signup' }" class="btn btn-primary btn-outline">
        S'inscrire
      </RouterLink>
    </form>
  </div>
</template>
