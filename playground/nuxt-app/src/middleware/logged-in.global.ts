import { defineNuxtRouteMiddleware } from '#app';
import { navigateTo, useAuthState } from '#imports';

export default defineNuxtRouteMiddleware((to, from) => {
  const { accessTokenState } = useAuthState();

  if (to.fullPath.startsWith('/auth')) {
    if (accessTokenState?.value) {
      return navigateTo({ path: '/app' });
    }
  }
});
