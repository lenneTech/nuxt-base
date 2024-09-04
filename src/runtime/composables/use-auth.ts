import type { JwtPayload } from 'jwt-decode';

import { jwtDecode } from 'jwt-decode';
import { useNuxtApp } from 'nuxt/app';

import { useAuthState } from '../states/auth';
import { gqlMutation } from './gql-mutation';

// Protection against multiple API calls
let inProgress = false;
let progressResult: {
  refreshToken: string;
  token: string;
};

export function useAuth() {
  /**
   * Request a new token
   *
   * With protection against multiple API calls to avoid invalid tokens
   */
  async function requestNewToken(): Promise<{
    refreshToken: string;
    token: string;
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
    const { data } = await gqlMutation('refreshToken', { disableTokenCheck: true, fields: ['token', 'refreshToken'] });

    if (data.value?.refreshToken) {
      setTokens(data.value.refreshToken.token, data.value.refreshToken.refreshToken);
    } else {
      return null;
    }

    const result = {
      refreshToken: data.value.refreshToken.refreshToken,
      token: data.value.refreshToken.token,
    };

    // Allow further calls again and transfer the result to waiting processes
    [inProgress, progressResult] = [false, result];

    // Return result
    return result;
  }

  async function checkTokenAndRenew(): Promise<{
    refreshToken: string;
    token: string;
  } | null> {
    const { accessTokenState } = useAuthState();

    if (isTokenExpired(accessTokenState.value)) {
      return requestNewToken();
    }

    return null;
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

  function signIn(input: { refreshToken: string; token: string; user: any }) {
    const { accessTokenState, currentUserState, refreshTokenState } = useAuthState();
    const { $setAuthCookies } = useNuxtApp();
    accessTokenState.value = input.token;
    refreshTokenState.value = input.refreshToken;
    currentUserState.value = input.user;
    $setAuthCookies(input.token, input.refreshToken);
  }

  function clearSession() {
    const { accessTokenState, currentUserState, refreshTokenState } = useAuthState();
    const { $setAuthCookies } = useNuxtApp();
    accessTokenState.value = null;
    refreshTokenState.value = null;
    currentUserState.value = null;
    $setAuthCookies(null, null);
  }

  function getDecodedAccessToken(token: string): JwtPayload | null {
    if (!token) {
      return null;
    }

    try {
      return jwtDecode(token);
    } catch (err) {
      return null;
    }
  }

  function isTokenExpired(token?: string): boolean {
    if (token) {
      const decoded = getDecodedAccessToken(token);
      return decoded?.exp < Date.now() / 1000;
    }

    return false;
  }

  return {
    checkTokenAndRenew,
    clearSession,
    getDecodedAccessToken,
    isTokenExpired,
    requestNewToken,
    setCurrentUser,
    setTokens,
    signIn,
  };
}
