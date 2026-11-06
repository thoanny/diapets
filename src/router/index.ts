import { supabase } from '@/lib/supabaseClient';
import AboutView from '@/views/AboutView.vue';
import AccountView from '@/views/AccountView.vue';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import PetsView from '@/views/PetsView.vue';
import SettingsView from '@/views/SettingsView.vue';
import SignupView from '@/views/SignupView.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView },
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      requiresAuth: true,
    },
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
    path: '/pets',
    name: 'Pets',
    component: PetsView,
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
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, behavior: 'smooth' };
    return { top: 0 };
  },
});

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return;
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return '/login';
});

export default router;
