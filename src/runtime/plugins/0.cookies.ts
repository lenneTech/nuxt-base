import { defineNuxtPlugin, useCookie } from 'nuxt/app';
import { useAuthState } from '../states/auth';

export default defineNuxtPlugin({
  name: 'cookies',
  enforce: 'pre',
  async setup() {
    const { storagePrefix } = useRuntimeConfig().public;
    const { sync } = useAuthState();

    console.debug('0.cookies.ts::init');

    const ONE_WEEK = 60 * 60 * 24 * 7;
    const token = useCookie<string | null>(`${storagePrefix}_access_token`, { default: () => null, sameSite: 'strict', maxAge: ONE_WEEK, watch: 'shallow' });
    const refreshToken = useCookie<string | null>(`${storagePrefix}_refresh_token`, { default: () => null, sameSite: 'strict', maxAge: ONE_WEEK, watch: 'shallow' });
    sync(token.value, refreshToken.value);
  },
});
