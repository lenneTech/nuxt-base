import { useCookie, useState } from 'nuxt/app';

const accessTokenState = () => useState<string | null>('access_token_state', () => null);
const refreshTokenState = () => useState<string | null>('refresh_token_state', () => null);
const currentUserState = () => useState<any | null>('current_user_state', () => null);

export function useAuthState() {
  function sync(token: string, refreshToken: string) {
    accessTokenState().value = token;
    refreshTokenState().value = refreshToken;
  }

  return {
    accessTokenState: accessTokenState(),
    refreshTokenState: refreshTokenState(),
    currentUserState: currentUserState(),
    sync,
  };
}
