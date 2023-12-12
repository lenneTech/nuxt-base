import { gqlMutation } from './gql-mutation';
import { useAuthState } from '../states/auth';
import jwt_decode from 'jwt-decode';
import { callWithNuxt, useNuxtApp } from 'nuxt/app';

// Protection against multiple API calls
let inProgress = false;
let progressResult: {
  token: string;
  refreshToken: string;
};

export function useAuth() {

  /**
   * Request a new token
   *
   * With protection against multiple API calls to avoid invalid tokens
   */
  async function requestNewToken(): Promise<{
    token: string;
    refreshToken: string;
  }> {
    // Check if already in progress
    if (inProgress) {

      // Wait for result
      while (!progressResult) {
        await new Promise((resolve) => setTimeout(resolve, 10));
      }

      // Return result
      return progressResult;
    }
    [inProgress, progressResult] = [true, null];

    // Get and set new tokens
    const _nuxt = useNuxtApp();
    const { mutate } = await callWithNuxt(_nuxt, gqlMutation, ['refreshToken', {
      fields: ['token', 'refreshToken'],
    }]);
    const response: any = await callWithNuxt(_nuxt, mutate);
    if (response?.data?.refreshToken) {
      setTokens(response.data.refreshToken.token, response.data.refreshToken.refreshToken);
    }
    const result = {
      token: response.data.refreshToken.token,
      refreshToken: response.data.refreshToken.refreshToken,
    };

    // Allow further calls again and transfer the result to waiting processes
    [inProgress, progressResult] = [false, result];

    // Return result
    return result;
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
