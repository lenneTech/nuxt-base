import { useState } from 'nuxt/app';

const accessTokenState = () => useState<null | string>('access_token_state', () => null);
const refreshTokenState = () => useState<null | string>('refresh_token_state', () => null);
const currentUserState = () => useState<any | null>('current_user_state', () => null);

export function useAuthState() {
  function sync(token: string, refreshToken: string) {
    accessTokenState().value = token;
    refreshTokenState().value = refreshToken;
  }

  return {
    accessTokenState: accessTokenState(),
    currentUserState: currentUserState(),
    refreshTokenState: refreshTokenState(),
    sync,
  };
}
