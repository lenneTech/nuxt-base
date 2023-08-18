import { defineStore, gqlMutation } from '#imports';
import { callWithNuxt, useNuxtApp } from 'nuxt/app';
import { useAuthCookies } from '../composables/use-auth-cookies';

export const useAuthStore: any = defineStore('auth', (_nuxtApp?: any) => {
  const nuxtApp = _nuxtApp ? _nuxtApp : useNuxtApp();
  const { token, refreshToken, currentUser, setTokenCookie, setRefreshTokenCookie, setUserCookie } = useAuthCookies(nuxtApp);

  async function requestNewToken(): Promise<{
    token: string;
    refreshToken: string;
  }> {
    console.log('requestNewToken');
    const { mutate } = await callWithNuxt(nuxtApp, gqlMutation, [
      'refreshToken',
      {
        fields: ['token', 'refreshToken'],
        log: true,
      },
    ]);

    const result = await callWithNuxt(nuxtApp, mutate);

    console.log('requestNewToken::result', JSON.stringify(result));

    if (result?.data?.refreshToken) {
      setTokens(
        result.data.refreshToken.token,
        result.data.refreshToken.refreshToken,
      );
    }

    return {
      token: result.data.refreshToken.token,
      refreshToken: result.data.refreshToken.refreshToken,
    };
  }

  function setTokens(newToken: string, newRefreshToken: string) {
    setTokenCookie(newToken);
    setRefreshTokenCookie(newRefreshToken);
  }

  function setCurrentUser(user: any) {
    setUserCookie(user);
  }

  function clearSession() {
    setTokenCookie(null);
    setRefreshTokenCookie(null);
    setUserCookie(null);
  }

  return {
    token,
    refreshToken,
    currentUser,
    setTokens,
    requestNewToken,
    clearSession,
    setCurrentUser,
  };
});
