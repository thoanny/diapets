import { supabase } from '@/lib/supabaseClient';
import AboutView from '@/views/AboutView.vue';
import AccountView from '@/views/AccountView.vue';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import PetView from '@/views/PetView.vue';
import SettingsView from '@/views/SettingsView.vue';
import SignupView from '@/views/SignupView.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView },
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/signup',
    name: 'Signup',
    component: SignupView,
  },
  {
    path: '/account',
    name: 'Account',
    component: AccountView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/pet',
    name: 'Pet',
    component: PetView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsView,
    meta: {
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return;
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return '/login';
});

export default router;
