import { defineStore, gqlMutation, ref, useCookie } from '#imports';
import { useRuntimeConfig } from 'nuxt/app';

export const useAuthStore: any = defineStore('auth', () => {
  const config = useRuntimeConfig();
  // Cookies
  const tokenCookie = useCookie(config.public.storagePrefix ? `${config.public.storagePrefix}-token` : 'token');
  const refreshTokenCookie = useCookie(config.public.storagePrefix ? `${config.public.storagePrefix}-refreshToken` : 'refreshToken');
  const currentUserCookie = useCookie(config.public.storagePrefix ? `${config.public.storagePrefix}-currentUser` : 'currentUser');

  // Refs
  const token = ref<string>(tokenCookie?.value || null);
  const refreshToken = ref<string>(refreshTokenCookie?.value || null);
  const currentUser = ref<any>(currentUserCookie?.value || null);

  async function requestNewToken(): Promise<{
    token: string;
    refreshToken: string;
  }> {
    console.log('requestNewToken');
    const { mutate } = await gqlMutation('refreshToken', {
      fields: ['token', 'refreshToken'],
      log: true,
    });

    const result = await mutate();

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
    tokenCookie.value = newToken;
    token.value = newToken;

    refreshTokenCookie.value = newRefreshToken;
    refreshToken.value = newRefreshToken;
  }

  function setCurrentUser(user: any) {
    currentUserCookie.value = user;
    currentUser.value = user;
  }

  function clearSession() {
    tokenCookie.value = null;
    token.value = null;

    refreshTokenCookie.value = null;
    refreshToken.value = null;

    currentUserCookie.value = null;
    currentUser.value = null;
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
