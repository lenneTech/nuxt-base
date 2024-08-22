import { defineNuxtRouteMiddleware } from '#app';
import { navigateTo, useAuthState } from '#imports';

export default defineNuxtRouteMiddleware((to, from) => {
  const { accessTokenState } = useAuthState();

  if (to.fullPath.startsWith('/app') || to.fullPath === '/app') {
    if (!accessTokenState?.value) {
      return navigateTo({ path: '/auth/login', query: { redirect: to.fullPath } });
    }
  }
});
