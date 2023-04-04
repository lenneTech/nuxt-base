import { defineStore, ref, useCookie, useGraphQL } from "#imports";

export const useAuthStore = defineStore("auth", () => {
    const token = ref<string>(null);
    const refreshToken = ref<string>(null);
    const currentUser = ref<any>(null);

    async function requestNewToken(): Promise<{ token: string; refreshToken: string }> {
        const { result } = await useGraphQL('refreshToken', {
            fields: ['token', 'refreshToken']
        })

        if (result.refreshToken) {
            setTokens(result.refreshToken.token, result.refreshToken.refreshToken);
        }

        return { token: result.refreshToken.token, refreshToken: result.refreshToken.refreshToken }
    }

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

    function clearSession() {
        const tokenCookie = useCookie('token');
        tokenCookie.value = null;
        token.value = null;

        const refreshTokenCookie = useCookie('refreshToken');
        refreshTokenCookie.value = null;
        refreshToken.value = null;

        currentUser.value = null;
    }
  
    return { token, refreshToken, currentUser, setTokens, requestNewToken, clearSession, setCurrentUser };
  });