import { ref, useCookie } from '#imports';

console.log(process.env);
const tokenCookie = useCookie(process.env['NUXT_PUBLIC_STORAGE_PREFIX'] ? `${process.env['NUXT_PUBLIC_STORAGE_PREFIX']}-token` : 'token');
const refreshTokenCookie = useCookie(process.env['NUXT_PUBLIC_STORAGE_PREFIX'] ? `${process.env['NUXT_PUBLIC_STORAGE_PREFIX']}-refreshToken` : 'refreshToken');
const userCookie = useCookie(process.env['NUXT_PUBLIC_STORAGE_PREFIX'] ? `${process.env['NUXT_PUBLIC_STORAGE_PREFIX']}-currentUser` : 'currentUser');

export function useAuthCookies() {
  const token = ref<string | null>(tokenCookie.value ?? null);
  const refreshToken = ref<string | null>(refreshTokenCookie.value ?? null);
  const currentUser = ref<object | null>(userCookie.value ?? null);

  function setTokenCookie(newToken: string | null) {
    token.value = newToken;
    tokenCookie.value = newToken;
  }

  function setRefreshTokenCookie(newToken: string | null) {
    refreshToken.value = newToken;
    refreshTokenCookie.value = newToken;
  }

  function setUserCookie(user: object | null) {
    currentUser.value = user;
    userCookie.value = token;
  }

  return { setTokenCookie, setUserCookie, setRefreshTokenCookie, token, refreshToken, currentUser };
}
