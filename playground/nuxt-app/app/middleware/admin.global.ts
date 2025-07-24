import { defineNuxtRouteMiddleware } from '#app';
import { navigateTo, useAuthState } from '#imports';

export default defineNuxtRouteMiddleware((to, from) => {
  const { currentUserState } = useAuthState();

  if (to.fullPath.startsWith('/app/admin')) {
    if (!currentUserState?.value?.roles?.includes('admin')) {
      return navigateTo('/app');
    }
  }
});
