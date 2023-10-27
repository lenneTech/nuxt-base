import { gqlMutation } from './gql-mutation';
import { useAuthState } from '../states/auth';
import jwt_decode from 'jwt-decode';
import { callWithNuxt, useNuxtApp } from 'nuxt/app';

export function useAuth() {
  async function requestNewToken(): Promise<{
    token: string;
    refreshToken: string;
  }> {
    const _nuxt = useNuxtApp();
    const { mutate } = await callWithNuxt(_nuxt, gqlMutation, ['refreshToken', {
      fields: ['token', 'refreshToken'],
    }]);

    const result: any = await callWithNuxt(_nuxt, mutate);

    if (result?.data?.refreshToken) {
      setTokens(result.data.refreshToken.token, result.data.refreshToken.refreshToken);
    }

    return {
      token: result.data.refreshToken.token,
      refreshToken: result.data.refreshToken.refreshToken,
    };
  }

  function setTokens(newToken: string, newRefreshToken: string) {
    const { accessTokenState, refreshTokenState } = useAuthState();
    const { $setAuthCookies } = useNuxtApp();
    accessTokenState.value = newToken;
    refreshTokenState.value = newRefreshToken;
    $setAuthCookies(newToken, newRefreshToken);
  }

  function setCurrentUser<T>(user: T) {
    const { currentUserState } = useAuthState();
    currentUserState.value = user;
  }

  function clearSession() {
    const { accessTokenState, refreshTokenState, currentUserState } = useAuthState();
    const { $setAuthCookies } = useNuxtApp();
    accessTokenState.value = null;
    refreshTokenState.value = null;
    currentUserState.value = null;
    $setAuthCookies(null, null);
  }

  function getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (err) {
      return null;
    }
  }

  function isTokenExpired(token?: string): boolean {
    if (token) {
      const decoded: { exp: number } = getDecodedAccessToken(token);
      return decoded.exp < Date.now() / 1000;
    }
    return false;
  }

  return {
    requestNewToken,
    setTokens,
    setCurrentUser,
    clearSession,
    getDecodedAccessToken,
    isTokenExpired,
  };
}
