import { defineNuxtPlugin, useCookie, useRuntimeConfig } from 'nuxt/app';

import { useAuthState } from '../states/auth';

export default defineNuxtPlugin({
  name: 'cookies',
  async setup() {
    const { storagePrefix } = useRuntimeConfig().public;
    const { sync } = useAuthState();
    const ONE_WEEK = 60 * 60 * 24 * 7;
    const token = useCookie<null | string>(`${storagePrefix}_access_token`, { default: () => null, maxAge: ONE_WEEK, sameSite: 'strict', watch: 'shallow' });
    const refreshToken = useCookie<null | string>(`${storagePrefix}_refresh_token`, { default: () => null, maxAge: ONE_WEEK, sameSite: 'strict', watch: 'shallow' });

    if (token.value && refreshToken.value) {
      sync(token.value, refreshToken.value);
    }

    function setCookies(newToken: string, newRefreshToken: string) {
      token.value = newToken;
      refreshToken.value = newRefreshToken;
    }

    return {
      provide: {
        setAuthCookies: (newToken: string, newRefreshToken: string) => setCookies(newToken, newRefreshToken),
      },
    };
  },
});
