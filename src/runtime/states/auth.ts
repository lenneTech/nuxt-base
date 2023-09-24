import { useCookie, useState } from 'nuxt/app';

const accessToken = () => useCookie<string | null>('access_token', { default: () => null, sameSite: 'strict' });
const refreshToken = () => useCookie<string | null>('refresh_token', { default: () => null, sameSite: 'strict' });
const accessTokenState = () => useState<string | null>('access_token_state', () => null);
const refreshTokenState = () => useState<string | null>('refresh_token_state', () => null);
const currentUserState = () => useState<any | null>('current_user_state', () => null);

export function useAuthState() {
  function sync() {
    accessTokenState().value = accessToken().value;
    refreshTokenState().value = refreshToken().value;
  }

  return {
    accessToken: accessToken(),
    refreshToken: refreshToken(),
    accessTokenState: accessTokenState(),
    refreshTokenState: refreshTokenState(),
    currentUserState: currentUserState(),
    sync,
  };
}
