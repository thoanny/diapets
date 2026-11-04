<script lang="ts" setup>
import { useAuth } from '@/composables/useAuth';
import { useRouter } from 'vue-router';
const { user, signOut } = useAuth();

const router = useRouter();

const submit = async () => {
  signOut();
  router.push('/');
};
</script>

<template>
  <h1>Mon compte</h1>
  <pre>{{ user?.email }}</pre>
  <form @submit.prevent="submit">
    <button class="btn btn-error btn-outline mt-4" type="submit">Se déconnecter</button>
  </form>
</template>
