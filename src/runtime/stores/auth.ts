import { defineStore, ref, useCookie } from "#imports";

export const useAuthStore = defineStore("auth", () => {
    const token = ref<string>(null);
    const refreshToken = ref<string>(null);
    const currentUser = ref<any>(null);

    function setTokens(newToken: string, newRefreshToken: string) {
        const tokenCookie = useCookie('token');
        tokenCookie.value = newToken;
        token.value = newToken;

        const refreshTokenCookie = useCookie('refreshToken');
        refreshTokenCookie.value = newRefreshToken;
        refreshToken.value = newRefreshToken;
    }

    function setCurrentUser(user: any) {
        currentUser.value = user;
    }
  
    return { token, refreshToken, currentUser, setTokens, setCurrentUser };
  });