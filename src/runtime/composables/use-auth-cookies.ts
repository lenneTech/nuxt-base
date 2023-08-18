import { ref, useCookie, useRuntimeConfig } from '#imports';
import { callWithNuxt } from 'nuxt/app';

export function useAuthCookies(nuxtApp: any) {
  const config = callWithNuxt(nuxtApp, useRuntimeConfig);
  const tokenCookie = callWithNuxt(nuxtApp, useCookie(config.public?.storagePrefix ? `${config.public.storagePrefix}-token` : 'token'));
  const refreshTokenCookie = callWithNuxt(nuxtApp, useCookie(config.public?.storagePrefix ? `${config.public.storagePrefix}-refreshToken` : 'refreshToken'));
  const userCookie = callWithNuxt(nuxtApp, useCookie(config.public?.storagePrefix ? `${config.public.storagePrefix}-currentUser` : 'currentUser'));

  const token = ref<string | null>(tokenCookie.value ?? null);
  const refreshToken = ref<string | null>(refreshTokenCookie.value ?? null);
  const currentUser = ref<object | null>(userCookie.value ?? null);

  function setTokenCookie(newToken: string | null) {
    token.value = newToken;
    tokenCookie.value = newToken;
  }

  function setRefreshTokenCookie(newToken: string | null) {
    refreshToken.value = newToken;
    refreshTokenCookie.value = newToken;
  }

  function setUserCookie(user: object | null) {
    currentUser.value = user;
    userCookie.value = token;
  }

  return { setTokenCookie, setUserCookie, setRefreshTokenCookie, token, refreshToken, currentUser };
}
