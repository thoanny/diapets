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
  <div class="card">
    <div class="card-body">
      <h1 class="card-title">Mon compte</h1>
      <div class="flex flex-col mt-4 gap-2">
        <div><strong>Adresse e-mail&nbsp;:</strong> {{ user?.email }}</div>
      </div>
      <form @submit.prevent="submit">
        <button class="btn btn-error btn-outline mt-4 btn-block" type="submit">
          Se déconnecter
        </button>
      </form>
    </div>
  </div>
</template>
