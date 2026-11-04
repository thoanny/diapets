<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
import { ZxcvbnFactory, type FeedbackType, type ZxcvbnResult } from '@zxcvbn-ts/core';
import * as common from '@zxcvbn-ts/language-common';
import * as fr from '@zxcvbn-ts/language-fr';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const SIGNUP_OPEN = true;

const { signup } = useAuth();
const router = useRouter();
const email = ref<string>('');
const password = ref<string>('');
const error = ref<string>('');

const submit = async () => {
  if (!email.value || !password.value) {
    error.value = 'E-mail et mot de passe requis.';
    return;
  }
  const { error: e } = await signup(email.value, password.value);
  if (e) error.value = e.message;
  else router.push('/');
};

const zxcvbn = new ZxcvbnFactory({
  translations: fr.translations,
  graphs: common.adjacencyGraphs,
  dictionary: { ...common.dictionary, ...fr.dictionary },
});

const result = computed((): ZxcvbnResult | null => {
  if (!password.value) return null;
  return zxcvbn.check(password.value);
});

const score = computed((): number => result.value?.score ?? -1);
const feedback = computed((): FeedbackType | null => result.value?.feedback ?? null);
</script>

<template>
  <div class="card" v-if="SIGNUP_OPEN">
    <form class="card-body" @submit.prevent="submit">
      <h1 class="card-title">Inscription</h1>
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
        <progress
          class="progress w-full"
          :value="score"
          max="4"
          :class="{
            'progress-error': score > -1 && score < 3,
            'progress-info': score === 3,
            'progress-success': score > 3,
          }"
        ></progress>
        <div
          class="alert alert-soft px-2 py-1"
          :class="{
            'alert-error': score < 3,
            'alert-info': score === 3,
            'alert-success': score > 3,
          }"
          v-if="feedback?.warning || (feedback?.suggestions && feedback.suggestions.length > 0)"
        >
          <div class="text-xs">
            <p class="font-bold" v-if="feedback?.warning">{{ feedback.warning }}</p>
            <ul class="list-disc text-xs ml-4" v-if="feedback?.suggestions.length > 0">
              <li v-for="(suggestion, key) in feedback.suggestions" :key>{{ suggestion }}</li>
            </ul>
          </div>
        </div>
      </fieldset>
      <button type="submit" class="btn btn-primary" :disabled="score < 3">S'inscrire</button>
      <RouterLink :to="{ name: 'Login' }" class="btn btn-secondary btn-ghost">
        Se connecter
      </RouterLink>
    </form>
  </div>
  <div class="alert alert-info" v-else>Les inscriptions sont fermées temporairement...</div>
</template>
