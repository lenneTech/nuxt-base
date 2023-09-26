import { useCookie, useState } from 'nuxt/app';

const ONE_WEEK = 60 * 60 * 24 * 7;
const accessToken = () => useCookie<string | null>('access_token', { default: () => null, sameSite: 'strict', maxAge: ONE_WEEK, watch: 'shallow' });
const refreshToken = () => useCookie<string | null>('refresh_token', { default: () => null, sameSite: 'strict', maxAge: ONE_WEEK, watch: 'shallow' });
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
