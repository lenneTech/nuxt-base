import { defineStore, gqlMutation } from '#imports';
import { useAuthCookies } from '../composables/use-auth-cookies';

export const useAuthStore: any = defineStore('auth', () => {
  const { token, refreshToken, currentUser, setTokenCookie, setRefreshTokenCookie, setUserCookie } = useAuthCookies();

  async function requestNewToken(): Promise<{
    token: string;
    refreshToken: string;
  }> {
    const { mutate } = await gqlMutation('refreshToken', {
      fields: ['token', 'refreshToken'],
      log: true,
    });
    const result = await mutate();

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
